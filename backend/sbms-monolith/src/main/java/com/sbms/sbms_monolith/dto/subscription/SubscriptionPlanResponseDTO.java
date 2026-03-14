package com.sbms.sbms_monolith.dto.subscription;

import lombok.Data;

import java.util.List;

@Data
public class SubscriptionPlanResponseDTO {
    private Long id;
    private String name;
    private Double price;
    private Integer durationDays;
    private String description;
    private List<String> features;
    private Boolean active;
    private String createdAt;
    private String updatedAt;
}
