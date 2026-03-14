package com.sbms.sbms_monolith.service;

<<<<<<< HEAD
import com.sbms.sbms_monolith.dto.subscription.OwnerSubscriptionRequestDTO;
import com.sbms.sbms_monolith.dto.subscription.OwnerSubscriptionResponseDTO;
import com.sbms.sbms_monolith.dto.subscription.SubscriptionCreateRequestDTO;
import com.sbms.sbms_monolith.mapper.OwnerSubscriptionMapper;
import com.sbms.sbms_monolith.model.OwnerSubscription;
import com.sbms.sbms_monolith.model.SubscriptionPlan;
import com.sbms.sbms_monolith.model.User;
import com.sbms.sbms_monolith.model.enums.OwnerSubscriptionStatus;
import com.sbms.sbms_monolith.repository.OwnerSubscriptionRepository;
=======
import com.sbms.sbms_monolith.dto.payment.CreatePaymentIntentDTO;
import com.sbms.sbms_monolith.dto.subscription.SubscriptionPlanResponseDTO;
import com.sbms.sbms_monolith.mapper.SubscriptionPlanMapper;
import com.sbms.sbms_monolith.model.PaymentIntent;
import com.sbms.sbms_monolith.model.SubscriptionPlan;
import com.sbms.sbms_monolith.model.User;
import com.sbms.sbms_monolith.model.enums.PaymentType;
>>>>>>> 3621e99b3aa3481d97ecd01ac84d36ff24145c02
import com.sbms.sbms_monolith.repository.SubscriptionPlanRepository;
import com.sbms.sbms_monolith.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

<<<<<<< HEAD
import java.time.OffsetDateTime;
import java.time.LocalDateTime;
import java.time.format.DateTimeParseException;
import java.util.List;
import java.util.stream.Collectors;
=======
import java.math.BigDecimal;
>>>>>>> 3621e99b3aa3481d97ecd01ac84d36ff24145c02

@Service
@RequiredArgsConstructor
public class OwnerSubscriptionService {

<<<<<<< HEAD
    private final OwnerSubscriptionRepository ownerSubscriptionRepository;
    private final SubscriptionPlanRepository subscriptionPlanRepository;
    private final UserRepository userRepository;
    private final OwnerSubscriptionMapper ownerSubscriptionMapper;

    /**
     * Activate a new subscription for the authenticated owner.
     * If there is already an ACTIVE subscription, this will currently reject the request.
     */
    @Transactional
    public OwnerSubscriptionResponseDTO subscribeOwner(String ownerEmail, OwnerSubscriptionRequestDTO requestDTO) {
        User owner = userRepository.findByEmail(ownerEmail)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Owner not found"));

        if (requestDTO == null || requestDTO.getSubscriptionPlanId() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "subscriptionPlanId is required");
        }

        SubscriptionPlan plan = subscriptionPlanRepository.findById(requestDTO.getSubscriptionPlanId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Subscription plan not found"));

        boolean hasActive = ownerSubscriptionRepository.existsByOwnerIdAndStatus(
                owner.getId(), OwnerSubscriptionStatus.ACTIVE);
        if (hasActive) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Owner already has an active subscription");
        }

        int durationDays = extractDurationDays(plan.getDuration());
        LocalDateTime start = LocalDateTime.now();
        LocalDateTime end = start.plusDays(durationDays);

        OwnerSubscription entity = new OwnerSubscription();
        entity.setOwner(owner);
        entity.setPlan(plan);
        entity.setStartDate(start);
        entity.setEndDate(end);
        entity.setStatus(OwnerSubscriptionStatus.ACTIVE);

        OwnerSubscription saved = ownerSubscriptionRepository.save(entity);

        // Keep simple link in User for quick checks (matches ER subscription_id)
        owner.setSubscription_id(plan.getId().intValue());
        userRepository.save(owner);

        return ownerSubscriptionMapper.toResponseDto(saved);
    }

    /**
     * Create owner subscription using explicit payload from frontend.
     */
    @Transactional
    public OwnerSubscriptionResponseDTO createSubscription(String ownerEmail, SubscriptionCreateRequestDTO requestDTO) {
        User owner = userRepository.findByEmail(ownerEmail)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Owner not found"));

        if (requestDTO == null || requestDTO.getPlanId() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "planId is required");
        }

        if (requestDTO.getOwnerId() != null && !requestDTO.getOwnerId().equals(owner.getId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "ownerId does not match authenticated owner");
        }

        SubscriptionPlan plan = subscriptionPlanRepository.findById(requestDTO.getPlanId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Subscription plan not found"));

        boolean hasActive = ownerSubscriptionRepository.existsByOwnerIdAndStatus(
                owner.getId(), OwnerSubscriptionStatus.ACTIVE);
        if (hasActive) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Owner already has an active subscription");
        }

        int durationDays = extractDurationDays(plan.getDuration());
        LocalDateTime start = parseDateTime(requestDTO.getStartDate(), LocalDateTime.now());
        LocalDateTime end = parseDateTime(requestDTO.getEndDate(), start.plusDays(durationDays));

        OwnerSubscriptionStatus status = OwnerSubscriptionStatus.ACTIVE;
        if (requestDTO.getStatus() != null && !requestDTO.getStatus().isBlank()) {
            try {
                status = OwnerSubscriptionStatus.valueOf(requestDTO.getStatus().trim().toUpperCase());
            } catch (IllegalArgumentException ignored) {
                status = OwnerSubscriptionStatus.ACTIVE;
            }
        }

        OwnerSubscription entity = new OwnerSubscription();
        entity.setOwner(owner);
        entity.setPlan(plan);
        entity.setStartDate(start);
        entity.setEndDate(end);
        entity.setStatus(status);

        OwnerSubscription saved = ownerSubscriptionRepository.save(entity);

        owner.setSubscription_id(plan.getId().intValue());
        userRepository.save(owner);

        return ownerSubscriptionMapper.toResponseDto(saved);
    }

    /**
     * Get the currently active subscription for the authenticated owner.
     */
    @Transactional(readOnly = true)
    public OwnerSubscriptionResponseDTO getCurrentSubscription(String ownerEmail) {
        User owner = userRepository.findByEmail(ownerEmail)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Owner not found"));

        OwnerSubscription subscription = ownerSubscriptionRepository
                .findByOwnerIdAndStatus(owner.getId(), OwnerSubscriptionStatus.ACTIVE)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "No active subscription found for this owner"));

        return ownerSubscriptionMapper.toResponseDto(subscription);
    }

    /**
     * Get subscription history for the authenticated owner.
     */
    @Transactional(readOnly = true)
    public List<OwnerSubscriptionResponseDTO> getSubscriptionHistory(String ownerEmail) {
        User owner = userRepository.findByEmail(ownerEmail)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Owner not found"));

        return ownerSubscriptionRepository.findByOwnerIdOrderByCreatedAtDesc(owner.getId())
                .stream()
                .map(ownerSubscriptionMapper::toResponseDto)
                .collect(Collectors.toList());
    }

    private int extractDurationDays(String duration) {
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

    private LocalDateTime parseDateTime(String value, LocalDateTime fallback) {
        if (value == null || value.isBlank()) {
            return fallback;
        }

        try {
            return OffsetDateTime.parse(value).toLocalDateTime();
        } catch (DateTimeParseException ex) {
            try {
                return LocalDateTime.parse(value);
            } catch (DateTimeParseException ignored) {
                return fallback;
            }
        }
    }
}

=======
    private final UserRepository userRepository;
    private final SubscriptionPlanRepository subscriptionPlanRepository;
    private final SubscriptionPlanMapper subscriptionPlanMapper;
    private final PaymentIntentService paymentIntentService;

    @Transactional
    public PaymentIntent createBuyPlanIntent(String ownerEmail, Long planId) {
        User owner = userRepository.findByEmail(ownerEmail)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Owner not found"));

        SubscriptionPlan plan = subscriptionPlanRepository.findById(planId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Subscription plan not found"));

        if (!plan.isActive()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Selected plan is inactive");
        }

        CreatePaymentIntentDTO dto = new CreatePaymentIntentDTO();
        // PaymentIntent currently tracks payer via studentId; set both IDs for compatibility.
        dto.setStudentId(owner.getId());
        dto.setOwnerId(owner.getId());
        dto.setType(PaymentType.SUBSCRIPTION);
        dto.setAmount(BigDecimal.valueOf(plan.getPrice()));
        dto.setDescription("Owner Subscription Purchase - " + plan.getName());
        dto.setSubscriptionPlanId(plan.getId());

        return paymentIntentService.create(dto);
    }

    @Transactional
    public SubscriptionPlanResponseDTO buyPlan(String ownerEmail, Long planId) {
        User owner = userRepository.findByEmail(ownerEmail)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Owner not found"));

        SubscriptionPlan plan = subscriptionPlanRepository.findById(planId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Subscription plan not found"));

        if (!plan.isActive()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Selected plan is inactive");
        }

        owner.setSubscription_id(plan.getId().intValue());
        userRepository.save(owner);

        return subscriptionPlanMapper.toResponseDto(plan);
    }

    @Transactional(readOnly = true)
    public SubscriptionPlanResponseDTO getCurrentPlan(String ownerEmail) {
        User owner = userRepository.findByEmail(ownerEmail)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Owner not found"));

        if (owner.getSubscription_id() <= 0) {
            return null;
        }

        SubscriptionPlan plan = subscriptionPlanRepository.findById((long) owner.getSubscription_id())
                .orElse(null);

        return subscriptionPlanMapper.toResponseDto(plan);
    }
}
>>>>>>> 3621e99b3aa3481d97ecd01ac84d36ff24145c02
