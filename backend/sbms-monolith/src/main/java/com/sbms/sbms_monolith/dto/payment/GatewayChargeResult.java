package com.sbms.sbms_monolith.dto.payment;


import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class GatewayChargeResult {

    private boolean success;
    private String gatewayRef;
    private String message;
}
