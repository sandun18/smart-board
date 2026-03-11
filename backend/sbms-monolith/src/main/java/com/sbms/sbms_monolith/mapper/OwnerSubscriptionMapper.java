package com.sbms.sbms_monolith.mapper;

import com.sbms.sbms_monolith.dto.subscription.OwnerSubscriptionResponseDTO;
import com.sbms.sbms_monolith.model.OwnerSubscription;
import org.springframework.stereotype.Component;

@Component
public class OwnerSubscriptionMapper {

    public OwnerSubscriptionResponseDTO toResponseDto(OwnerSubscription entity) {
        if (entity == null) {
            return null;
        }

        return OwnerSubscriptionResponseDTO.builder()
                .id(entity.getId())
                .ownerId(entity.getOwner().getId())
                .ownerName(entity.getOwner().getFullName())
                .planId(entity.getPlan().getId())
                .planName(entity.getPlan().getName())
                .planPrice(entity.getPlan().getPrice())
                .planDurationDays(entity.getPlan().getDurationDays())
                .startDate(entity.getStartDate())
                .endDate(entity.getEndDate())
                .status(entity.getStatus().name())
                .createdAt(entity.getCreatedAt())
                .build();
    }
}
