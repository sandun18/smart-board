package com.sbms.sbms_monolith.model;

import com.sbms.sbms_monolith.common.BaseEntity;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

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

    @Column(nullable = false)
    private Integer durationDays;

    @Column(columnDefinition = "TEXT")
    private String description;

    @ElementCollection
    @CollectionTable(name = "subscription_plan_features", joinColumns = @JoinColumn(name = "plan_id"))
    @Column(name = "feature")
    private List<String> features = new ArrayList<>();

    @Column(nullable = false)
    private boolean active = true;
}
