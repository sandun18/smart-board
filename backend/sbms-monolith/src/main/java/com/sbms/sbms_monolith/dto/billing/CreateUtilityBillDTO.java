package com.sbms.sbms_monolith.dto.billing;


import java.math.BigDecimal;

import lombok.Data;

@Data
public class CreateUtilityBillDTO {

    private Long boardingId;

    // YYYY-MM (e.g. 2026-01)
    private String month;

    private BigDecimal electricityAmount;
    private BigDecimal waterAmount;
    private String proofUrl;
}
