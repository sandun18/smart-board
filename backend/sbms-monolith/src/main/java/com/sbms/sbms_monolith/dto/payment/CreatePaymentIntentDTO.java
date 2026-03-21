package com.sbms.sbms_monolith.dto.payment;


import com.sbms.sbms_monolith.model.enums.PaymentType;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class CreatePaymentIntentDTO {

    private Long studentId;
    private Long ownerId;
    private Long boardingId;

    private PaymentType type; // KEY_MONEY, MONTHLY_RENT, UTILITIES

    private BigDecimal amount;

    // Optional (used for rent/utilities)
    private Long monthlyBillId;

    private String description; // "January Rent", "Key Money", etc.

    private Long maintenanceRequestId;
}