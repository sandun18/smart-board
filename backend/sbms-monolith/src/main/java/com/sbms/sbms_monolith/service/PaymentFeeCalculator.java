package com.sbms.sbms_monolith.service;


import java.math.BigDecimal;
import java.math.RoundingMode;

import org.springframework.stereotype.Component;

@Component
public class PaymentFeeCalculator {

    private static final BigDecimal PLATFORM_RATE = new BigDecimal("0.02");
    private static final BigDecimal GATEWAY_RATE  = new BigDecimal("0.01");

    public FeeBreakdown calculate(BigDecimal amount) {

        BigDecimal platformFee =
                amount.multiply(PLATFORM_RATE)
                      .setScale(2, RoundingMode.HALF_UP);

        BigDecimal gatewayFee =
                amount.multiply(GATEWAY_RATE)
                      .setScale(2, RoundingMode.HALF_UP);

        BigDecimal netAmount =
                amount.subtract(platformFee).subtract(gatewayFee);

        return new FeeBreakdown(platformFee, gatewayFee, netAmount);
    }

    public record FeeBreakdown(
            BigDecimal platformFee,
            BigDecimal gatewayFee,
            BigDecimal netAmount
    ) {}
}
