package com.sbms.sbms_monolith.controller;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import com.sbms.sbms_monolith.model.MonthlyBill;
import com.sbms.sbms_monolith.model.PaymentIntent;
import com.sbms.sbms_monolith.model.PaymentTransaction;
import com.sbms.sbms_monolith.model.enums.ManualApprovalStatus;
import com.sbms.sbms_monolith.model.enums.MonthlyBillStatus;
import com.sbms.sbms_monolith.model.enums.PaymentIntentStatus;
import com.sbms.sbms_monolith.model.enums.PaymentMethod;
import com.sbms.sbms_monolith.model.enums.PaymentStatus;
import com.sbms.sbms_monolith.repository.MonthlyBillRepository;
import com.sbms.sbms_monolith.repository.PaymentIntentRepository;
import com.sbms.sbms_monolith.repository.PaymentTransactionRepository;
import com.sbms.sbms_monolith.service.OwnerWalletService;
import com.sbms.sbms_monolith.service.PaymentReceiptPdfService;
import com.sbms.sbms_monolith.service.S3Service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/api/owner/payments")
@RequiredArgsConstructor
@Slf4j
public class OwnerPaymentApprovalController {

    private final PaymentIntentRepository intentRepo;
    private final PaymentTransactionRepository txRepo;
    private final OwnerWalletService ownerWalletService;
    private final MonthlyBillRepository billRepo;
    
    private final S3Service s3Service;
    private final PaymentReceiptPdfService  receiptPdfService;
    
    
    @GetMapping("pendingIntents/{ownerId}")
    @PreAuthorize("hasRole('OWNER')")
    public List<PaymentIntent>  getAllPendingIntents(@PathVariable Long ownerId) {
    	List<PaymentIntent> intents = intentRepo.findByOwnerId(ownerId);
    	
    	if (intents.isEmpty()) {
            throw new RuntimeException("Payment intents not found for owner: " + ownerId);
        }
    	
    	return intents;
    	
    	
    }
    @PostMapping("/{intentId}/approve")
    @PreAuthorize("hasRole('OWNER')")
    @Transactional
    public void approve(@PathVariable Long intentId) {

        PaymentIntent intent = intentRepo.findById(intentId)
                .orElseThrow(() -> new RuntimeException("Payment intent not found"));

        // 🔒 Idempotency
        if (intent.getStatus() == PaymentIntentStatus.SUCCESS) {
            return; // already approved
        }

        if (intent.getStatus() != PaymentIntentStatus.AWAITING_MANUAL_APPROVAL) {
            throw new RuntimeException("Payment is not awaiting approval");
        }

        // 1️ Mark intent as SUCCESS
        intent.setManualApprovalStatus(ManualApprovalStatus.APPROVED);
        intent.setStatus(PaymentIntentStatus.SUCCESS);
        intent.setCompletedAt(LocalDateTime.now());
        intentRepo.save(intent);
        
        if (intent.getMonthlyBillId() != null) {
            billRepo.findById(intent.getMonthlyBillId()).ifPresentOrElse(
                bill -> {
                    bill.setStatus(MonthlyBillStatus.PAID);
                    billRepo.save(bill);
                },
                () -> {
                    log.error(
                        "CRITICAL: Payment succeeded but MonthlyBill {} was not found!",
                        intent.getMonthlyBillId()
                    );
                }
            );
        }

        // 2️ Create immutable transaction record
        PaymentTransaction tx = new PaymentTransaction();
        tx.setIntent(intent);
        tx.setStatus(PaymentStatus.SUCCESS);
        tx.setAmount(intent.getAmount());
        tx.setPaidAt(LocalDateTime.now());
        tx.setTransactionRef("MANUAL-" + intent.getId());
        
        tx.setMethod(intent.getMethod());
        tx.setVerifiedAt(LocalDateTime.now());
        tx.setVerifiedByOwnerId(intent.getOwnerId());
        BigDecimal platformFee = BigDecimal.valueOf(0.02).multiply(intent.getAmount()); // Error: * is undefined
        tx.setGatewayFee(BigDecimal.ZERO);
      //  tx.setPlatformFee(platformFee);
        tx.setPlatformFee(BigDecimal.ZERO);
       // tx.setNetAmount(intent.getAmount().add(platformFee));
        tx.setNetAmount(intent.getAmount());

        if (intent.getMethod() == PaymentMethod.BANK_SLIP) {
            tx.setSlipUrl(intent.getReferenceId());
        }
        
        byte[] pdfBytes = receiptPdfService.generate(tx);
        System.out.println("PDF created");
     // 4️Upload to S3
     String receiptKey = "receipts/payment_" + tx.getTransactionRef() + ".pdf";
     String receiptUrl = s3Service.uploadBytes(
             pdfBytes,
             receiptKey,
             "application/pdf"
     );
     System.out.println("PDF uploaded");

     // 5️ Save receipt URL
     tx.setReceiptPath(receiptUrl);

        txRepo.save(tx);

        // 3️ Credit owner wallet (ONCE)
        ownerWalletService.credit(
                intent.getOwnerId(),
                intent.getAmount(),
                tx.getTransactionRef()
        );
    }
}
