package com.sbms.sbms_monolith.dto.dashboard;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import lombok.Data;

@Data
public class OwnerEarningTransactionDTO {

    private String reference;
    private BigDecimal amount;
    private String type; // CREDIT / DEBIT
    private LocalDateTime date;
}
