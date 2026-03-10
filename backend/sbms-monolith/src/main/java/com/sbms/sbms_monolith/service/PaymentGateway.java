package com.sbms.sbms_monolith.service;


import com.sbms.sbms_monolith.dto.payment.GatewayChargeResult;
import com.sbms.sbms_monolith.model.PaymentIntent;
import com.sbms.sbms_monolith.model.enums.PaymentMethod;

public interface PaymentGateway {

    GatewayChargeResult charge(
            PaymentIntent intent,
            PaymentMethod method
    );
}
