package com.sbms.sbms_monolith.dto.subscription;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class SubscriptionSubscribeRequestDTO {

    @NotNull(message = "subscriptionPlanId is required")
    private Long subscriptionPlanId;

    // Simulated payment flag for subscription activation.
    private Boolean paymentSuccessful = false;
}
