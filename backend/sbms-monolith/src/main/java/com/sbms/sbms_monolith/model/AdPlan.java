package com.sbms.sbms_monolith.model;

import com.sbms.sbms_monolith.common.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.CollectionTable;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.FetchType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@Entity
@Table(name = "ad_plans")
@EqualsAndHashCode(callSuper = true)
public class AdPlan extends BaseEntity {

    @Column(nullable = false, unique = true)
    private String name;

    @Column(nullable = false)
    private Double price;

    @Column(nullable = true)
    private Integer durationDays; // Duration in days

    @Column(length = 1000)
    private String description;

    @Column
    private boolean active = true;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "ad_plan_features", joinColumns = @JoinColumn(name = "plan_id"))
    @Column(name = "feature", length = 200)
    private java.util.List<String> features = new java.util.ArrayList<>();

}
