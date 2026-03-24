package com.sbms.sbms_monolith.model;

import com.sbms.sbms_monolith.common.BaseEntity;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "subscriptions")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Subscription extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "owner_id", nullable = false)
    private User owner;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "subscription_plan_id", nullable = false)
    private SubscriptionPlan subscriptionPlan;

    @Column(name = "start_date", nullable = false)
    private LocalDateTime startDate;

    @Column(name = "end_date", nullable = false)
    private LocalDateTime endDate;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private SubscriptionStatus status = SubscriptionStatus.ACTIVE;

    @Column(name = "ad_id")
    private Long adId; // For ad boosting subscriptions

    public enum SubscriptionStatus {
        ACTIVE, EXPIRED, CANCELLED
    }
}