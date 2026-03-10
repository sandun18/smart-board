package com.sbms.sbms_monolith.service;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import org.springframework.stereotype.Service;

import com.sbms.sbms_monolith.model.MonthlyBill;
import com.sbms.sbms_monolith.model.PaymentIntent;
import com.sbms.sbms_monolith.model.PaymentTransaction;
import com.sbms.sbms_monolith.model.User;
import com.sbms.sbms_monolith.model.enums.MonthlyBillStatus;
import com.sbms.sbms_monolith.model.enums.PaymentIntentStatus;
import com.sbms.sbms_monolith.model.enums.PaymentMethod;
import com.sbms.sbms_monolith.model.enums.PaymentStatus;
import com.sbms.sbms_monolith.repository.MonthlyBillRepository;
import com.sbms.sbms_monolith.repository.PaymentIntentRepository;
import com.sbms.sbms_monolith.repository.PaymentTransactionRepository;
import com.sbms.sbms_monolith.repository.UserRepository;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class OwnerPaymentVerificationService {

    private final PaymentTransactionRepository txRepo;
    private final PaymentIntentRepository intentRepo;
    private final PaymentFeeCalculator feeCalculator;
    private final OwnerWalletService ownerWalletService;
    private final PaymentReceiptPdfService pdfService;
    private final S3Service s3Service;
    private final EmailService emailService;
    private final UserRepository userRepo;
    
    private final MonthlyBillRepository monthlyBillRepo;


    @Transactional
    public void verify(Long txId, Long ownerId, boolean approve) {

        PaymentTransaction tx = txRepo.findById(txId)
                .orElseThrow(() -> new RuntimeException("Transaction not found"));

        // ONLY CASH & BANK_SLIP allowed
        if (tx.getMethod() == PaymentMethod.CARD) {
            throw new RuntimeException("Card payments cannot be manually verified");
        }

        if (tx.getStatus() != PaymentStatus.AWAITING_VERIFICATION) {
            throw new RuntimeException("Transaction not awaiting verification");
        }

        PaymentIntent intent = tx.getIntent();

        // ❌ REJECTED
        if (!approve) {
            tx.setStatus(PaymentStatus.FAILED);
            tx.setFailureReason("Rejected by owner");
            txRepo.save(tx);

            intent.setStatus(PaymentIntentStatus.FAILED);
            intentRepo.save(intent);
            return;
        }

        // ✅ APPROVED
        tx.setStatus(PaymentStatus.SUCCESS);
        tx.setPaidAt(LocalDateTime.now());
        tx.setVerifiedAt(LocalDateTime.now());
        tx.setVerifiedByOwnerId(ownerId);

        // ✅ FEES (NO GATEWAY FEE)
        var fees = feeCalculator.calculate(tx.getAmount());
        tx.setPlatformFee(fees.platformFee());
        tx.setGatewayFee(BigDecimal.ZERO);
        tx.setNetAmount(fees.netAmount());

        // 💰 CREDIT OWNER
        ownerWalletService.credit(
                intent.getOwnerId(),
                tx.getNetAmount(),
                tx.getTransactionRef()
        );

        // 📄 RECEIPT
        byte[] pdf = pdfService.generate(tx);
        String receiptUrl = s3Service.uploadBytes(
                pdf,
                "payment-receipts/" + tx.getTransactionRef() + ".pdf",
                "application/pdf"
        );
        tx.setReceiptPath(receiptUrl);
        txRepo.save(tx);

        //  INTENT COMPLETE
        intent.setStatus(PaymentIntentStatus.SUCCESS);
        intent.setCompletedAt(LocalDateTime.now());
        intentRepo.save(intent);
        
        if (intent.getMonthlyBillId() != null) {
            MonthlyBill bill = monthlyBillRepo
                    .findById(intent.getMonthlyBillId())
                    .orElseThrow();

            bill.setStatus(MonthlyBillStatus.PAID);
            monthlyBillRepo.save(bill);
        }


        // 📧 EMAIL STUDENT
        User student = userRepo.findById(intent.getStudentId()).orElseThrow();
        emailService.sendPaymentReceipt(
                student.getEmail(),
                student.getFullName(),
                pdf,
                tx.getTransactionRef()
        );
    }

}
