package com.sbms.sbms_monolith.dto.subscription;

import lombok.Data;

@Data
public class SubscriptionCreateRequestDTO {
    private Long ownerId;
    private Long planId;
    private String startDate;
    private String endDate;
    private String status;
}
