package com.sbms.sbms_monolith.dto.ads;

import lombok.Data;

@Data
public class PlanDTO {
    private Long id;
    private String name;
    private Double price;
    private Integer durationDays;
    private String description;
    private boolean active;
    private java.util.List<String> features;
}
