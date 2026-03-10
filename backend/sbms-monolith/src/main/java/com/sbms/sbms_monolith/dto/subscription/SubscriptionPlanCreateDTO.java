package com.sbms.sbms_monolith.dto.subscription;

import lombok.Data;

import java.util.List;

@Data
public class SubscriptionPlanCreateDTO {
    private String name;
    private Double price;
    private Integer durationDays;
    private String description;
    private List<String> features;
    private Boolean active;
}
