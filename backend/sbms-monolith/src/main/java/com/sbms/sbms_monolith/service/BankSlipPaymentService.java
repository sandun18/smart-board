package com.sbms.sbms_monolith.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.sbms.sbms_monolith.model.PaymentIntent;
import com.sbms.sbms_monolith.model.enums.ManualApprovalStatus;
import com.sbms.sbms_monolith.model.enums.PaymentIntentStatus;
import com.sbms.sbms_monolith.model.enums.PaymentMethod;
import com.sbms.sbms_monolith.repository.PaymentIntentRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class BankSlipPaymentService {

    private final PaymentIntentRepository intentRepo;
    private final S3Service s3Service;

    @Transactional
    public void uploadSlip(Long intentId, MultipartFile slip) {

        PaymentIntent intent = intentRepo.findById(intentId)
                .orElseThrow(() -> new RuntimeException("Payment intent not found"));

        // 🔒 Hard safety
        if (intent.getStatus() == PaymentIntentStatus.SUCCESS) {
            throw new IllegalStateException("Payment already completed");
        }

        // 1️ Upload slip → URL
        String slipUrl = s3Service.uploadFile(slip, "bank-slips/");

        // 2️ Store URL (choose ONE place — intent OR transaction)
        // Recommended: PaymentTransaction (later step)
        intent.setReferenceId(slipUrl);

        // 3️ Mark as awaiting owner verification
        
        intent.setMethod(PaymentMethod.BANK_SLIP);
        intent.setReferenceId(slipUrl);
        intent.setStatus(PaymentIntentStatus.AWAITING_MANUAL_APPROVAL);
        intent.setManualApprovalStatus(ManualApprovalStatus.PENDING);

        intentRepo.save(intent);
    }
    
    @Transactional
    public void attachSlipUrl(Long intentId, String slipUrl) {

        PaymentIntent intent = intentRepo.findById(intentId)
                .orElseThrow(() -> new RuntimeException("Payment intent not found"));

        if (intent.getStatus() == PaymentIntentStatus.SUCCESS) {
            throw new IllegalStateException("Payment already completed");
        }

        intent.setReferenceId(slipUrl);
        intent.setMethod(PaymentMethod.BANK_SLIP);
        intent.setReferenceId(slipUrl);

        intent.setStatus(PaymentIntentStatus.AWAITING_MANUAL_APPROVAL);
        intent.setManualApprovalStatus(ManualApprovalStatus.PENDING);

        intentRepo.save(intent);
    }

}
