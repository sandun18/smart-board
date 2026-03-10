package com.sbms.sbms_monolith.service;

import java.util.UUID;

import org.springframework.stereotype.Service;

import com.sbms.sbms_monolith.dto.payment.GatewayChargeResult;
import com.sbms.sbms_monolith.model.PaymentIntent;
import com.sbms.sbms_monolith.model.enums.PaymentMethod;

@Service
public class DummyPayHereGateway implements PaymentGateway {

    @Override
    public GatewayChargeResult charge(
            PaymentIntent intent,
            PaymentMethod method
    ) {
        return new GatewayChargeResult(
                true,
                "PH-" + UUID.randomUUID(),
                "Payment successful (Dummy PayHere)"
        );
    }
}
