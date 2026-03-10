package com.sbms.sbms_monolith.service;

import com.sbms.sbms_monolith.dto.subscription.SubscriptionPlanCreateDTO;
import com.sbms.sbms_monolith.dto.subscription.SubscriptionPlanResponseDTO;
import com.sbms.sbms_monolith.mapper.SubscriptionPlanMapper;
import com.sbms.sbms_monolith.model.SubscriptionPlan;
import com.sbms.sbms_monolith.repository.SubscriptionPlanRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SubscriptionPlanService {

    private final SubscriptionPlanRepository subscriptionPlanRepository;
    private final SubscriptionPlanMapper subscriptionPlanMapper;

    /**
     * Create a new subscription plan (Admin only)
     */
    @Transactional
    public SubscriptionPlanResponseDTO createPlan(SubscriptionPlanCreateDTO dto) {
        SubscriptionPlan plan = subscriptionPlanMapper.toEntity(dto);
        SubscriptionPlan saved = subscriptionPlanRepository.save(plan);
        return subscriptionPlanMapper.toResponseDto(saved);
    }

    /**
     * Update an existing subscription plan (Admin only)
     */
    @Transactional
    public SubscriptionPlanResponseDTO updatePlan(Long id, SubscriptionPlanCreateDTO dto) {
        SubscriptionPlan plan = subscriptionPlanRepository.findById(id)
                .orElseThrow(() -> new IllegalStateException("Subscription plan not found with id: " + id));

        subscriptionPlanMapper.updateEntity(plan, dto);
        SubscriptionPlan saved = subscriptionPlanRepository.save(plan);
        return subscriptionPlanMapper.toResponseDto(saved);
    }

    /**
     * Delete a subscription plan (Admin only)
     */
    @Transactional
    public void deletePlan(Long id) {
        if (!subscriptionPlanRepository.existsById(id)) {
            throw new IllegalStateException("Subscription plan not found with id: " + id);
        }
        subscriptionPlanRepository.deleteById(id);
    }

    /**
     * Get all subscription plans (Admin view - includes inactive)
     */
    public List<SubscriptionPlanResponseDTO> getAllPlans() {
        return subscriptionPlanRepository.findAllByOrderByCreatedAtDesc()
                .stream()
                .map(subscriptionPlanMapper::toResponseDto)
                .collect(Collectors.toList());
    }

    /**
     * Get only active subscription plans (For owners/students)
     */
    public List<SubscriptionPlanResponseDTO> getActivePlans() {
        return subscriptionPlanRepository.findByActiveTrue()
                .stream()
                .map(subscriptionPlanMapper::toResponseDto)
                .collect(Collectors.toList());
    }

    /**
     * Get a single plan by ID
     */
    public SubscriptionPlanResponseDTO getPlanById(Long id) {
        SubscriptionPlan plan = subscriptionPlanRepository.findById(id)
                .orElseThrow(() -> new IllegalStateException("Subscription plan not found with id: " + id));
        return subscriptionPlanMapper.toResponseDto(plan);
    }
}
