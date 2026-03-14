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

        int durationDays = parseDurationToDays(entity.getPlan().getDuration());

        return OwnerSubscriptionResponseDTO.builder()
                .id(entity.getId())
                .ownerId(entity.getOwner().getId())
                .ownerName(entity.getOwner().getFullName())
                .planId(entity.getPlan().getId())
                .planName(entity.getPlan().getName())
                .planPrice(entity.getPlan().getPrice())
                .planDurationDays(durationDays)
                .startDate(entity.getStartDate())
                .endDate(entity.getEndDate())
                .status(entity.getStatus().name())
                .createdAt(entity.getCreatedAt())
                .build();
    }

    /**
     * Parses a human-readable duration string like "7 Days" or "30 days"
     * into an integer number of days. Falls back to 30 if parsing fails.
     */
    private int parseDurationToDays(String duration) {
        if (duration == null) {
            return 30;
        }

        String trimmed = duration.trim();
        if (trimmed.isEmpty()) {
            return 30;
        }

        String[] parts = trimmed.split("\\s+");
        try {
            return Integer.parseInt(parts[0]);
        } catch (NumberFormatException ex) {
            return 30;
        }
    }
}
