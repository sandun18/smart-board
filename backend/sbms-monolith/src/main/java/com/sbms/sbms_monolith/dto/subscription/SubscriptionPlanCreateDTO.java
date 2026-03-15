package com.sbms.sbms_monolith.dto.subscription;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.util.List;

@Data
public class SubscriptionPlanCreateDTO {
    @NotBlank(message = "Plan name is required")
    @Size(max = 100, message = "Plan name must be at most 100 characters")
    private String name;

    @NotNull(message = "Price is required")
    @DecimalMin(value = "0.0", inclusive = true, message = "Price must be zero or greater")
    private Double price;

    @Min(value = 1, message = "durationDays must be at least 1")
    private Integer durationDays;

    @Min(value = 1, message = "maxAds must be at least 1")
    private Integer maxAds;

    private Boolean boostAllowed;

    @Size(max = 50, message = "Duration must be at most 50 characters")
    private String duration;

    @Size(max = 1000, message = "Description must be at most 1000 characters")
    private String description;

    private List<String> features;

    private Boolean active;
}
