package com.sbms.sbms_monolith.dto.dashboard;


import java.math.BigDecimal;

import lombok.Data;

@Data
public class OwnerEarningsSummaryDTO {

    private BigDecimal walletBalance;

    private BigDecimal totalEarnings;
    private BigDecimal monthlyEarnings;

    private BigDecimal totalPlatformFees;
    private BigDecimal totalGatewayFees;
}
