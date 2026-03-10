package com.sbms.sbms_monolith.service;


import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;

import com.sbms.sbms_monolith.dto.payment.GatewayChargeResult;
import com.sbms.sbms_monolith.dto.payment.PaymentHistoryDTO;
import com.sbms.sbms_monolith.dto.payment.PaymentResult;
import com.sbms.sbms_monolith.model.MonthlyBill;
import com.sbms.sbms_monolith.model.PaymentIntent;
import com.sbms.sbms_monolith.model.PaymentTransaction;
import com.sbms.sbms_monolith.model.enums.MonthlyBillStatus;
import com.sbms.sbms_monolith.model.enums.PaymentIntentStatus;
import com.sbms.sbms_monolith.model.enums.PaymentMethod;
import com.sbms.sbms_monolith.model.enums.PaymentStatus;
import com.sbms.sbms_monolith.repository.MonthlyBillRepository;
import com.sbms.sbms_monolith.repository.PaymentIntentRepository;
import com.sbms.sbms_monolith.repository.PaymentTransactionRepository;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
@RequiredArgsConstructor
public class PaymentService {

    private final PaymentIntentRepository intentRepo;
    private final PaymentTransactionRepository txRepo;
    private final PaymentGateway paymentGateway;
    private final MonthlyBillRepository billRepo;
    
    private final PaymentReceiptPdfService receiptPdfService;
    private final OwnerWalletService ownerWalletService;
    
    private final S3Service s3Service;


    @Transactional
    public PaymentResult pay(Long intentId, PaymentMethod method) {

        PaymentIntent intent = intentRepo.findById(intentId)
                .orElseThrow(() -> new RuntimeException("Payment intent not found"));

        if (intent.getStatus() == PaymentIntentStatus.SUCCESS)
            throw new RuntimeException("Payment already completed");

        // ===============================
        // PAYHERE → AUTO SUCCESS (MOCK)
        // ===============================
        if (method == PaymentMethod.CARD) {

            intent.setStatus(PaymentIntentStatus.SUCCESS);
            intent.setCompletedAt(LocalDateTime.now());
            intentRepo.save(intent);

            PaymentTransaction tx = new PaymentTransaction();
            tx.setIntent(intent);
            tx.setMethod(method);
            tx.setGateway("PAYHERE");
            tx.setStatus(PaymentStatus.SUCCESS);
            tx.setAmount(intent.getAmount());
            tx.setPaidAt(LocalDateTime.now());
            tx.setTransactionRef("PH-" + intent.getId());
            
            
           
            tx.setVerifiedAt(LocalDateTime.now());
            
            BigDecimal platformFee = intent.getAmount()
                    .multiply(new BigDecimal("0.02"));

            BigDecimal gateWayFee = intent.getAmount()
                    .multiply(new BigDecimal("0.01"));

            tx.setGatewayFee(gateWayFee);
          //  tx.setPlatformFee(platformFee);
            tx.setPlatformFee(platformFee);
            BigDecimal netAmount = intent.getAmount().add(platformFee).add(gateWayFee);
            tx.setNetAmount(netAmount);

            txRepo.save(tx);
            
            
            
            ownerWalletService.credit(
                    intent.getOwnerId(),
                    netAmount,
                    tx.getTransactionRef()
            );
            
            
            
            
            byte[] pdfBytes = receiptPdfService.generate(tx);

            // 4️ Upload PDF to S3
            String receiptUrl = s3Service.uploadBytes(
                    pdfBytes,
                    "payment-receipts/receipt-" + tx.getTransactionRef() + ".pdf",
                    "application/pdf"
            );

            // 5️ Save receipt URL
            tx.setReceiptPath(receiptUrl);
            txRepo.save(tx);
            
            
            
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

            
            

                    return new PaymentResult(
                            tx.getId(),
                            tx.getTransactionRef(),
                            intent.getAmount().doubleValue(),
                            "SUCCESS",
                            receiptUrl
                    );

        }

        // ===============================
        // OTHER METHODS (UNCHANGED)
        // ===============================
        intent.setStatus(PaymentIntentStatus.PROCESSING);
        intentRepo.save(intent);

        GatewayChargeResult gateway =
                paymentGateway.charge(intent, method);

        PaymentTransaction tx = new PaymentTransaction();
        tx.setIntent(intent);
        tx.setTransactionRef(gateway.getGatewayRef());
        tx.setAmount(intent.getAmount());
        tx.setMethod(method);
        tx.setGateway("PAYHERE");
        tx.setStatus(PaymentStatus.PENDING);

        txRepo.save(tx);
        
        
     


        return new PaymentResult(
                tx.getId(),
                tx.getTransactionRef(),
                intent.getAmount().doubleValue(),
                "PENDING",
                null
        );
    }


    public List<PaymentHistoryDTO> history(Long userId) {

        return txRepo.findByIntentStudentId(userId)
                .stream()
                .map(tx -> {
                    PaymentHistoryDTO dto = new PaymentHistoryDTO();
                    dto.setId(tx.getId());
                    dto.setTransactionRef(tx.getTransactionRef());
                    dto.setAmount(tx.getAmount());
                    dto.setMethod(tx.getMethod());
                    dto.setStatus(tx.getStatus());
                    dto.setPaidAt(tx.getPaidAt());
                    dto.setReceiptUrl(tx.getReceiptPath());
                    return dto;
                })
                .toList();
    }
}

