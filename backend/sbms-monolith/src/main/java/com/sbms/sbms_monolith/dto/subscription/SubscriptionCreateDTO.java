package com.sbms.sbms_monolith.dto.subscription;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class SubscriptionCreateDTO {
    
    @NotNull(message = "Owner ID is required")
    private Long ownerId;
    
    @NotNull(message = "Plan ID is required")
    private Long planId;
    
    private LocalDateTime startDate;
    
    private LocalDateTime endDate;
    
    private String status = "ACTIVE";
    
    private Long adId; // For ad boosting
}