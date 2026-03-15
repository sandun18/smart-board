package com.sbms.sbms_monolith.model;

import com.sbms.sbms_monolith.common.BaseEntity;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "subscription_plan")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class SubscriptionPlan extends BaseEntity {

    @Column(nullable = false, length = 100)
    private String name;

    @Column(nullable = false)
    private Double price;

    @Column
    private Integer durationDays = 30;

    @Column(length = 50)
    private String duration;

    @Column
    private Integer maxAds = 1;

    @Column
    private Boolean boostAllowed = false;

    @Column(columnDefinition = "TEXT")
    private String features;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false, columnDefinition = "BOOLEAN DEFAULT TRUE")
    private Boolean active = true;
}
