package com.sbms.sbms_monolith.mapper;

import com.sbms.sbms_monolith.dto.subscription.SubscriptionPlanCreateDTO;
import com.sbms.sbms_monolith.dto.subscription.SubscriptionPlanResponseDTO;
import com.sbms.sbms_monolith.model.SubscriptionPlan;
import org.springframework.stereotype.Component;

import java.time.format.DateTimeFormatter;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Component
public class SubscriptionPlanMapper {

    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm");
    private static final int DEFAULT_DURATION_DAYS = 30;

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
        Integer durationDays = resolveDurationDays(dto);
        plan.setDurationDays(durationDays);
        plan.setDuration(formatDuration(durationDays));
        plan.setMaxAds(dto.getMaxAds() != null ? dto.getMaxAds() : 1);
        plan.setBoostAllowed(dto.getBoostAllowed() != null ? dto.getBoostAllowed() : false);
        plan.setDescription(dto.getDescription() != null ? dto.getDescription() : "");
        plan.setFeatures(serializeFeatures(dto.getFeatures()));
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
        dto.setDurationDays(resolveEntityDurationDays(plan));
        dto.setMaxAds(plan.getMaxAds() != null ? plan.getMaxAds() : 1);
        dto.setBoostAllowed(plan.getBoostAllowed() != null ? plan.getBoostAllowed() : false);
        dto.setDescription(plan.getDescription() != null ? plan.getDescription() : "");
        dto.setFeatures(deserializeFeatures(plan.getFeatures()));
        dto.setActive(plan.getActive() != null ? plan.getActive() : true);

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
            plan.setDuration(formatDuration(dto.getDurationDays()));
        } else if (dto.getDuration() != null && !dto.getDuration().isBlank()) {
            Integer parsedDurationDays = parseDurationDays(dto.getDuration());
            plan.setDurationDays(parsedDurationDays);
            plan.setDuration(formatDuration(parsedDurationDays));
        }

        if (dto.getMaxAds() != null) {
            plan.setMaxAds(dto.getMaxAds());
        }

        if (dto.getBoostAllowed() != null) {
            plan.setBoostAllowed(dto.getBoostAllowed());
        }

        if (dto.getDescription() != null) {
            plan.setDescription(dto.getDescription());
        }
        if (dto.getFeatures() != null) {
            plan.setFeatures(serializeFeatures(dto.getFeatures()));
        }
        if (dto.getActive() != null) {
            plan.setActive(dto.getActive());
        }
    }

    private Integer parseDurationDays(String duration) {
        if (duration == null || duration.isBlank()) {
            return DEFAULT_DURATION_DAYS;
        }

        String[] tokens = duration.trim().split("\\s+");
        if (tokens.length == 0) {
            return DEFAULT_DURATION_DAYS;
        }

        try {
            return Integer.parseInt(tokens[0]);
        } catch (NumberFormatException ex) {
            return DEFAULT_DURATION_DAYS;
        }
    }

    private Integer resolveDurationDays(SubscriptionPlanCreateDTO dto) {
        if (dto == null) {
            return DEFAULT_DURATION_DAYS;
        }
        if (dto.getDurationDays() != null) {
            return dto.getDurationDays();
        }
        return parseDurationDays(dto.getDuration());
    }

    private Integer resolveEntityDurationDays(SubscriptionPlan plan) {
        if (plan == null) {
            return DEFAULT_DURATION_DAYS;
        }

        if (plan.getDurationDays() != null && plan.getDurationDays() > 0) {
            return plan.getDurationDays();
        }

        return parseDurationDays(plan.getDuration());
    }

    private String formatDuration(Integer days) {
        int resolvedDays = (days != null) ? days : DEFAULT_DURATION_DAYS;
        return resolvedDays + " Days";
    }

    private String serializeFeatures(List<String> features) {
        if (features == null || features.isEmpty()) {
            return "";
        }

        return features.stream()
                .filter(feature -> feature != null && !feature.isBlank())
                .map(String::trim)
                .collect(Collectors.joining("||"));
    }

    private List<String> deserializeFeatures(String features) {
        if (features == null || features.isBlank()) {
            return Collections.emptyList();
        }

        if (features.contains("||")) {
            return Arrays.stream(features.split("\\|\\|"))
                    .map(String::trim)
                    .filter(feature -> !feature.isBlank())
                    .collect(Collectors.toList());
        }

        return Arrays.stream(features.split("[,\\r\\n]+"))
                .map(String::trim)
                .filter(feature -> !feature.isBlank())
                .collect(Collectors.toList());
    }
}
