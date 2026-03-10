package com.sbms.sbms_monolith.mapper;

import com.sbms.sbms_monolith.dto.subscription.SubscriptionPlanCreateDTO;
import com.sbms.sbms_monolith.dto.subscription.SubscriptionPlanResponseDTO;
import com.sbms.sbms_monolith.model.SubscriptionPlan;
import org.springframework.stereotype.Component;

import java.time.format.DateTimeFormatter;
import java.util.ArrayList;

@Component
public class SubscriptionPlanMapper {

    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm");

    /**
     * Converts SubscriptionPlanCreateDTO to SubscriptionPlan Entity
     */
    public SubscriptionPlan toEntity(SubscriptionPlanCreateDTO dto) {
        if (dto == null) {
            return null;
        }

        SubscriptionPlan plan = new SubscriptionPlan();
        plan.setName(dto.getName());
        plan.setPrice(dto.getPrice());
        plan.setDurationDays(dto.getDurationDays());
        plan.setDescription(dto.getDescription());
        plan.setFeatures(dto.getFeatures() != null ? dto.getFeatures() : new ArrayList<>());
        plan.setActive(dto.getActive() != null ? dto.getActive() : true);

        return plan;
    }

    /**
     * Converts SubscriptionPlan Entity to SubscriptionPlanResponseDTO
     */
    public SubscriptionPlanResponseDTO toResponseDto(SubscriptionPlan plan) {
        if (plan == null) {
            return null;
        }

        SubscriptionPlanResponseDTO dto = new SubscriptionPlanResponseDTO();
        dto.setId(plan.getId());
        dto.setName(plan.getName());
        dto.setPrice(plan.getPrice());
        dto.setDurationDays(plan.getDurationDays());
        dto.setDescription(plan.getDescription());
        dto.setFeatures(plan.getFeatures() != null ? plan.getFeatures() : new ArrayList<>());
        dto.setActive(plan.isActive());

        if (plan.getCreatedAt() != null) {
            dto.setCreatedAt(plan.getCreatedAt().format(DATE_FORMATTER));
        }
        if (plan.getUpdatedAt() != null) {
            dto.setUpdatedAt(plan.getUpdatedAt().format(DATE_FORMATTER));
        }

        return dto;
    }

    /**
     * Updates an existing SubscriptionPlan entity with data from DTO
     */
    public void updateEntity(SubscriptionPlan plan, SubscriptionPlanCreateDTO dto) {
        if (dto.getName() != null) {
            plan.setName(dto.getName());
        }
        if (dto.getPrice() != null) {
            plan.setPrice(dto.getPrice());
        }
        if (dto.getDurationDays() != null) {
            plan.setDurationDays(dto.getDurationDays());
        }
        if (dto.getDescription() != null) {
            plan.setDescription(dto.getDescription());
        }
        if (dto.getFeatures() != null) {
            plan.setFeatures(dto.getFeatures());
        }
        if (dto.getActive() != null) {
            plan.setActive(dto.getActive());
        }
    }
}
