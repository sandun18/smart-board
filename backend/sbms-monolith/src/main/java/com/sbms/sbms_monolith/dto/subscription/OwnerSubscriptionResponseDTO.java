package com.sbms.sbms_monolith.dto.subscription;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class OwnerSubscriptionResponseDTO {
    private Long id;
    private Long ownerId;
    private String ownerName;
    private Long planId;
    private String planName;
    private Double planPrice;
    private Integer planDurationDays;
    private Integer maxAds;
    private Boolean boostAllowed;
    private Long usedAds;
    private Long remainingAdsAllowed;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private String status;
    private LocalDateTime createdAt;
}
