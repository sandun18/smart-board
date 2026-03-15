package com.sbms.sbms_monolith.repository;

import com.sbms.sbms_monolith.model.Subscription;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface SubscriptionRepository extends JpaRepository<Subscription, Long> {

    List<Subscription> findByOwnerIdOrderByCreatedAtDesc(Long ownerId);
    
    List<Subscription> findByStatusOrderByCreatedAtDesc(Subscription.SubscriptionStatus status);
    
    @Query("SELECT s FROM Subscription s WHERE s.owner.id = :ownerId AND s.status = 'ACTIVE' AND s.endDate > :now")
    List<Subscription> findActiveSubscriptionsByOwner(@Param("ownerId") Long ownerId, @Param("now") LocalDateTime now);
    
    @Query("SELECT s FROM Subscription s WHERE s.adId = :adId AND s.status = 'ACTIVE' AND s.endDate > :now")
    Optional<Subscription> findActiveSubscriptionByAdId(@Param("adId") Long adId, @Param("now") LocalDateTime now);
    
    @Query("SELECT s FROM Subscription s WHERE s.endDate < :now AND s.status = 'ACTIVE'")
    List<Subscription> findExpiredSubscriptions(@Param("now") LocalDateTime now);

    boolean existsBySubscriptionPlanId(Long subscriptionPlanId);

    long countBySubscriptionPlanId(Long subscriptionPlanId);

    long countBySubscriptionPlanIdAndStatus(Long subscriptionPlanId, Subscription.SubscriptionStatus status);
}