package com.sbms.sbms_monolith.service;

import com.sbms.sbms_monolith.dto.payment.CreatePaymentIntentDTO;
import com.sbms.sbms_monolith.model.Maintenance;
import com.sbms.sbms_monolith.model.MonthlyBill;
import com.sbms.sbms_monolith.model.PaymentIntent;
import com.sbms.sbms_monolith.model.enums.MaintenanceStatus;
import com.sbms.sbms_monolith.model.enums.ManualApprovalStatus;
import com.sbms.sbms_monolith.model.enums.PaymentIntentStatus;
import com.sbms.sbms_monolith.model.enums.PaymentType;
import com.sbms.sbms_monolith.repository.MaintenanceRepository;
import com.sbms.sbms_monolith.repository.MonthlyBillRepository;
import com.sbms.sbms_monolith.repository.PaymentIntentRepository;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class PaymentIntentService {

    private final PaymentIntentRepository intentRepo;
    private final MonthlyBillRepository monthlyBillRepo;
    private final MaintenanceRepository maintenanceRepo;

    private String generateReferenceId() {
        return "PI-" + System.currentTimeMillis();
    }


    /**
     * Create a new payment intent with lifecycle state
     *
     *
     */
    public PaymentIntent create(CreatePaymentIntentDTO dto) {

        PaymentIntent intent = new PaymentIntent();

        intent.setStudentId(dto.getStudentId());
        intent.setOwnerId(dto.getOwnerId());
        intent.setBoardingId(dto.getBoardingId());
        intent.setType(dto.getType());
        intent.setAmount(dto.getAmount());
        intent.setDescription(dto.getDescription());
        intent.setMonthlyBillId(dto.getMonthlyBillId());
        intent.setMaintenanceRequestId(dto.getMaintenanceRequestId());

        if (dto.getType() == PaymentType.TECHNICIAN_FEE) {
            Maintenance m = maintenanceRepo.findById(dto.getMaintenanceRequestId())
                    .orElseThrow(() -> new RuntimeException("Maintenance Request not found"));

            // FORCE the amount to be exactly what the technician entered
            // This prevents the Owner from tampering with the price in the API request
            if (m.getTechnicianFee() == null) {
                throw new RuntimeException("Technician has not set a fee for this job yet.");
            }
            intent.setAmount(m.getTechnicianFee());
            intent.setDescription("Technician Fee for Job #" + m.getId() + ": " + m.getTitle());
        } else {
            // For Rent/Key Money, use the standard amount
            intent.setAmount(dto.getAmount());
            intent.setDescription(dto.getDescription());
        }

        intent.setStatus(PaymentIntentStatus.CREATED);

        intent.setManualApprovalStatus(
                dto.getType() == PaymentType.KEY_MONEY
                        ? ManualApprovalStatus.PENDING
                        : ManualApprovalStatus.NOT_REQUIRED
        );
        intent.setExpiresAt(calculateExpiry(dto));


        intent.setCurrency("LKR");
        intent.setReferenceId(UUID.randomUUID().toString());

        //  intent.setReferenceType("KEY_MONEY");

        PaymentIntent savedIntent = intentRepo.save(intent);

        //  UPDATE MAINTENANCE STATUS TO 'PAYMENT_PENDING'
        // This locks the job so the Technician can't change the price again while payment is processing
        if (dto.getType() == PaymentType.TECHNICIAN_FEE) {
            Maintenance m = maintenanceRepo.findById(dto.getMaintenanceRequestId()).orElseThrow();
            m.setStatus(MaintenanceStatus.PAYMENT_PENDING);
            maintenanceRepo.save(m);
        }

        return savedIntent;
    }


    // -------------------- EXPIRY RULES --------------------

    private LocalDateTime calculateExpiry(CreatePaymentIntentDTO dto) {

        return switch (dto.getType()) {
            case KEY_MONEY, TECHNICIAN_FEE -> LocalDateTime.now().plusHours(24);
            case MONTHLY_RENT, UTILITIES -> LocalDateTime.now().plusDays(14);
        };
    }

    // -------------------- VALIDATION --------------------

    private void validate(CreatePaymentIntentDTO dto) {

        if (dto.getOwnerId() == null)
            throw new RuntimeException("Owner ID required");

        if (dto.getBoardingId() == null)
            throw new RuntimeException("Boarding ID required");

        if (dto.getType() == null)
            throw new RuntimeException("Payment type required");

        // 1. TECHNICIAN FEE SPECIFIC VALIDATION
        if (dto.getType() == PaymentType.TECHNICIAN_FEE) {
            if (dto.getMaintenanceRequestId() == null)
                throw new RuntimeException("Maintenance Request ID required for Technician Fee");

            Maintenance m = maintenanceRepo.findById(dto.getMaintenanceRequestId())
                    .orElseThrow(() -> new RuntimeException("Request not found"));

            // Rule: Can only pay if work is done (or if retrying a pending payment)
            if (m.getStatus() != MaintenanceStatus.WORK_DONE && m.getStatus() != MaintenanceStatus.PAYMENT_PENDING) {
                throw new RuntimeException("Cannot pay: Technician has not completed the work yet.");
            }

            // Rule: Only the owner of the boarding can pay
            if (!m.getBoarding().getOwner().getId().equals(dto.getOwnerId())) {
                throw new RuntimeException("Unauthorized: You are not the owner of this job.");
            }

            // Note: We skip the "Amount" check here because we override it in the create method anyway
            return;
        }

        // 2. STANDARD VALIDATION (Rent, Key Money, etc.)

        if (dto.getStudentId() == null)
            throw new RuntimeException("Student ID required");

        if (dto.getAmount() == null || dto.getAmount().signum() <= 0)
            throw new RuntimeException("Invalid amount");

        //  Updated: Allow null monthlyBillId for Technician Fees (already handled above) and Key Money
        boolean isRecurringBill = dto.getType() == PaymentType.MONTHLY_RENT || dto.getType() == PaymentType.UTILITIES;

        if (isRecurringBill && dto.getMonthlyBillId() == null)
            throw new RuntimeException("Monthly bill ID required");

        if (dto.getType() == PaymentType.KEY_MONEY && dto.getMonthlyBillId() != null)
            throw new RuntimeException("Key money cannot reference monthly bill");
    }
}