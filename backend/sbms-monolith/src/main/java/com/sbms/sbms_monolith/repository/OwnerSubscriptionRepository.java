package com.sbms.sbms_monolith.repository;

import com.sbms.sbms_monolith.model.OwnerSubscription;
import com.sbms.sbms_monolith.model.enums.OwnerSubscriptionStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface OwnerSubscriptionRepository extends JpaRepository<OwnerSubscription, Long> {

    List<OwnerSubscription> findByOwnerIdOrderByCreatedAtDesc(Long ownerId);

    Optional<OwnerSubscription> findByOwnerIdAndStatus(Long ownerId, OwnerSubscriptionStatus status);

        Optional<OwnerSubscription> findByOwnerIdAndStatusAndEndDateAfter(
            Long ownerId,
            OwnerSubscriptionStatus status,
            LocalDateTime now);

    boolean existsByOwnerIdAndStatus(Long ownerId, OwnerSubscriptionStatus status);

        boolean existsByOwnerIdAndStatusAndEndDateAfter(
            Long ownerId,
            OwnerSubscriptionStatus status,
            LocalDateTime now);

        List<OwnerSubscription> findByStatusAndEndDateBefore(OwnerSubscriptionStatus status, LocalDateTime now);

    boolean existsByPlanId(Long planId);

    long countByPlanId(Long planId);

    long countByPlanIdAndStatus(Long planId, OwnerSubscriptionStatus status);
}
