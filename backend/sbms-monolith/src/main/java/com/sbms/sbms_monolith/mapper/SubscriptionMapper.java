package com.sbms.sbms_monolith.mapper;

import com.sbms.sbms_monolith.dto.subscription.SubscriptionCreateDTO;
import com.sbms.sbms_monolith.dto.subscription.SubscriptionResponseDTO;
import com.sbms.sbms_monolith.model.Subscription;
import org.springframework.stereotype.Component;

import java.time.format.DateTimeFormatter;

@Component
public class SubscriptionMapper {

    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm");

    public SubscriptionResponseDTO toResponseDto(Subscription subscription) {
        if (subscription == null) {
            return null;
        }

        SubscriptionResponseDTO dto = new SubscriptionResponseDTO();
        dto.setId(subscription.getId());
        dto.setOwnerId(subscription.getOwner().getId());
        dto.setOwnerName(subscription.getOwner().getFullName());
        dto.setPlanId(subscription.getSubscriptionPlan().getId());
        dto.setPlanName(subscription.getSubscriptionPlan().getName());
        dto.setPlanPrice(subscription.getSubscriptionPlan().getPrice());
        dto.setPlanDuration(subscription.getSubscriptionPlan().getDuration());
        dto.setStatus(subscription.getStatus().name());
        dto.setAdId(subscription.getAdId());

        if (subscription.getStartDate() != null) {
            dto.setStartDate(subscription.getStartDate().format(DATE_FORMATTER));
        }
        if (subscription.getEndDate() != null) {
            dto.setEndDate(subscription.getEndDate().format(DATE_FORMATTER));
        }
        if (subscription.getCreatedAt() != null) {
            dto.setCreatedAt(subscription.getCreatedAt().format(DATE_FORMATTER));
        }
        if (subscription.getUpdatedAt() != null) {
            dto.setUpdatedAt(subscription.getUpdatedAt().format(DATE_FORMATTER));
        }

        return dto;
    }
}