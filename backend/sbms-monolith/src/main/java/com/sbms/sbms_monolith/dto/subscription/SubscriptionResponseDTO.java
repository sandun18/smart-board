package com.sbms.sbms_monolith.dto.subscription;

import lombok.Data;

@Data
public class SubscriptionResponseDTO {
    private Long id;
    private Long ownerId;
    private String ownerName;
    private Long planId;
    private String planName;
    private Double planPrice;
    private String planDuration;
    private String startDate;
    private String endDate;
    private String status;
    private Long adId;
    private String createdAt;
    private String updatedAt;
}