package com.sbms.sbms_monolith.dto.subscription;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
public class OwnerSubscriptionRequestDTO {

    @JsonProperty("subscriptionPlanId")
    private Long subscriptionPlanId;
}
