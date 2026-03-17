package com.sbms.sbms_monolith.service;

import com.sbms.sbms_monolith.dto.payment.CreatePaymentIntentDTO;
import com.sbms.sbms_monolith.dto.subscription.OwnerSubscriptionRequestDTO;
import com.sbms.sbms_monolith.dto.subscription.OwnerSubscriptionResponseDTO;
import com.sbms.sbms_monolith.dto.subscription.SubscriptionSubscribeRequestDTO;
import com.sbms.sbms_monolith.dto.subscription.SubscriptionCreateRequestDTO;
import com.sbms.sbms_monolith.dto.subscription.SubscriptionPlanResponseDTO;
import com.sbms.sbms_monolith.mapper.OwnerSubscriptionMapper;
import com.sbms.sbms_monolith.mapper.SubscriptionPlanMapper;
import com.sbms.sbms_monolith.model.OwnerSubscription;
import com.sbms.sbms_monolith.model.PaymentIntent;
import com.sbms.sbms_monolith.model.SubscriptionPlan;
import com.sbms.sbms_monolith.model.User;
import com.sbms.sbms_monolith.model.enums.OwnerSubscriptionStatus;
import com.sbms.sbms_monolith.model.enums.PaymentType;
import com.sbms.sbms_monolith.repository.BoardingRepository;
import com.sbms.sbms_monolith.repository.OwnerSubscriptionRepository;
import com.sbms.sbms_monolith.repository.SubscriptionPlanRepository;
import com.sbms.sbms_monolith.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.OffsetDateTime;
import java.time.format.DateTimeParseException;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OwnerSubscriptionService {

    private final OwnerSubscriptionRepository ownerSubscriptionRepository;
    private final SubscriptionPlanRepository subscriptionPlanRepository;
    private final UserRepository userRepository;
    private final OwnerSubscriptionMapper ownerSubscriptionMapper;
    private final SubscriptionPlanMapper subscriptionPlanMapper;
    private final PaymentIntentService paymentIntentService;
    private final BoardingRepository boardingRepository;

    @Transactional
    public OwnerSubscriptionResponseDTO subscribeOwnerAfterPayment(String ownerEmail, SubscriptionSubscribeRequestDTO requestDTO) {
        User owner = userRepository.findByEmail(ownerEmail)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Owner not found"));

        if (requestDTO == null || requestDTO.getSubscriptionPlanId() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "subscriptionPlanId is required");
        }

        if (!Boolean.TRUE.equals(requestDTO.getPaymentSuccessful())) {
            throw new ResponseStatusException(HttpStatus.PAYMENT_REQUIRED, "Payment must be successful before activating a subscription");
        }

        expireSubscriptionsForOwner(owner.getId());

        SubscriptionPlan plan = subscriptionPlanRepository.findById(requestDTO.getSubscriptionPlanId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Subscription plan not found"));

        if (!Boolean.TRUE.equals(plan.getActive())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Selected plan is inactive");
        }

        boolean hasActive = ownerSubscriptionRepository.existsByOwnerIdAndStatusAndEndDateAfter(
                owner.getId(), OwnerSubscriptionStatus.ACTIVE, LocalDateTime.now());
        if (hasActive) {
            OwnerSubscription current = getCurrentActiveSubscriptionEntity(owner.getId());
            String message = "You already have an active subscription.";
            if (current != null && current.getEndDate() != null) {
                message += " You can change plans after your current plan expires on " + current.getEndDate() + ".";
            }
            throw new ResponseStatusException(HttpStatus.CONFLICT, message);
        }

        OwnerSubscription saved = createActiveSubscription(owner, plan);
        OwnerSubscriptionResponseDTO responseDTO = ownerSubscriptionMapper.toResponseDto(saved);
        enrichSubscriptionUsage(responseDTO, owner.getId());
        return responseDTO;
    }

    @Transactional
    public OwnerSubscriptionResponseDTO subscribeOwner(String ownerEmail, OwnerSubscriptionRequestDTO requestDTO) {
        User owner = userRepository.findByEmail(ownerEmail)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Owner not found"));

        if (requestDTO == null || requestDTO.getSubscriptionPlanId() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "subscriptionPlanId is required");
        }

        SubscriptionPlan plan = subscriptionPlanRepository.findById(requestDTO.getSubscriptionPlanId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Subscription plan not found"));

        expireSubscriptionsForOwner(owner.getId());

        boolean hasActive = ownerSubscriptionRepository.existsByOwnerIdAndStatusAndEndDateAfter(
            owner.getId(), OwnerSubscriptionStatus.ACTIVE, LocalDateTime.now());
        if (hasActive) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Owner already has an active subscription");
        }

        OwnerSubscription saved = createActiveSubscription(owner, plan);
        OwnerSubscriptionResponseDTO responseDTO = ownerSubscriptionMapper.toResponseDto(saved);
        enrichSubscriptionUsage(responseDTO, owner.getId());
        return responseDTO;
    }

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

        expireSubscriptionsForOwner(owner.getId());

        boolean hasActive = ownerSubscriptionRepository.existsByOwnerIdAndStatusAndEndDateAfter(
            owner.getId(), OwnerSubscriptionStatus.ACTIVE, LocalDateTime.now());
        if (hasActive) {
            OwnerSubscription current = getCurrentActiveSubscriptionEntity(owner.getId());
            String message = "You already have an active subscription.";
            if (current != null && current.getEndDate() != null) {
                message += " You can change plans after your current plan expires on " + current.getEndDate() + ".";
            }
            throw new ResponseStatusException(HttpStatus.CONFLICT, message);
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

    @Transactional(readOnly = true)
    public OwnerSubscriptionResponseDTO getCurrentSubscription(String ownerEmail) {
        User owner = userRepository.findByEmail(ownerEmail)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Owner not found"));

        expireSubscriptionsForOwner(owner.getId());

        OwnerSubscription subscription = ownerSubscriptionRepository
            .findByOwnerIdAndStatusAndEndDateAfter(owner.getId(), OwnerSubscriptionStatus.ACTIVE, LocalDateTime.now())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "No active subscription found for this owner"));

        OwnerSubscriptionResponseDTO responseDTO = ownerSubscriptionMapper.toResponseDto(subscription);
        enrichSubscriptionUsage(responseDTO, owner.getId());
        return responseDTO;
    }

    @Transactional(readOnly = true)
    public List<OwnerSubscriptionResponseDTO> getSubscriptionHistory(String ownerEmail) {
        User owner = userRepository.findByEmail(ownerEmail)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Owner not found"));

        return ownerSubscriptionRepository.findByOwnerIdOrderByCreatedAtDesc(owner.getId())
                .stream()
            .map(ownerSubscriptionMapper::toResponseDto)
            .peek(dto -> enrichSubscriptionUsage(dto, owner.getId()))
                .collect(Collectors.toList());
    }

    @Transactional
    public PaymentIntent createBuyPlanIntent(String ownerEmail, Long planId) {
        User owner = userRepository.findByEmail(ownerEmail)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Owner not found"));

        SubscriptionPlan plan = subscriptionPlanRepository.findById(planId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Subscription plan not found"));

        if (!Boolean.TRUE.equals(plan.getActive())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Selected plan is inactive");
        }

        CreatePaymentIntentDTO dto = new CreatePaymentIntentDTO();
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

        expireSubscriptionsForOwner(owner.getId());

        SubscriptionPlan plan = subscriptionPlanRepository.findById(planId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Subscription plan not found"));

        if (!Boolean.TRUE.equals(plan.getActive())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Selected plan is inactive");
        }

        boolean hasActive = ownerSubscriptionRepository.existsByOwnerIdAndStatusAndEndDateAfter(
            owner.getId(), OwnerSubscriptionStatus.ACTIVE, LocalDateTime.now());
        if (hasActive) {
            OwnerSubscription current = getCurrentActiveSubscriptionEntity(owner.getId());
            String message = "You already have an active subscription.";
            if (current != null && current.getEndDate() != null) {
                message += " You can change plans after your current plan expires on " + current.getEndDate() + ".";
            }
            throw new ResponseStatusException(HttpStatus.CONFLICT, message);
        }

        createActiveSubscription(owner, plan);

        return subscriptionPlanMapper.toResponseDto(plan);
    }

    @Transactional(readOnly = true)
    public SubscriptionPlanResponseDTO getCurrentPlan(String ownerEmail) {
        User owner = userRepository.findByEmail(ownerEmail)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Owner not found"));

        expireSubscriptionsForOwner(owner.getId());

        if (owner.getSubscription_id() == null || owner.getSubscription_id() <= 0) {
            return null;
        }

        SubscriptionPlan plan = subscriptionPlanRepository.findById((long) owner.getSubscription_id())
                .orElse(null);

        return subscriptionPlanMapper.toResponseDto(plan);
    }

    @Transactional
    public int expireSubscriptionsIfDue() {
        List<OwnerSubscription> expiredSubscriptions = ownerSubscriptionRepository
                .findByStatusAndEndDateBefore(OwnerSubscriptionStatus.ACTIVE, LocalDateTime.now());

        for (OwnerSubscription subscription : expiredSubscriptions) {
            subscription.setStatus(OwnerSubscriptionStatus.EXPIRED);

            User owner = subscription.getOwner();
            if (owner != null && owner.getSubscription_id() != null
                    && owner.getSubscription_id().equals(subscription.getPlan().getId().intValue())) {
                owner.setSubscription_id(null);
            }
        }

        if (!expiredSubscriptions.isEmpty()) {
            ownerSubscriptionRepository.saveAll(expiredSubscriptions);
        }

        return expiredSubscriptions.size();
    }

    @Transactional(readOnly = true)
    public boolean hasActiveSubscriptionForOwner(Long ownerId) {
        return ownerSubscriptionRepository.existsByOwnerIdAndStatusAndEndDateAfter(
                ownerId,
                OwnerSubscriptionStatus.ACTIVE,
                LocalDateTime.now());
    }

    @Transactional(readOnly = true)
    public OwnerSubscription getCurrentActiveSubscriptionEntity(Long ownerId) {
        return ownerSubscriptionRepository
                .findByOwnerIdAndStatusAndEndDateAfter(ownerId, OwnerSubscriptionStatus.ACTIVE, LocalDateTime.now())
                .orElse(null);
    }

    private OwnerSubscription createActiveSubscription(User owner, SubscriptionPlan plan) {
        int durationDays = resolveDurationDays(plan);
        LocalDateTime start = LocalDateTime.now();
        LocalDateTime end = start.plusDays(durationDays);

        OwnerSubscription entity = new OwnerSubscription();
        entity.setOwner(owner);
        entity.setPlan(plan);
        entity.setStartDate(start);
        entity.setEndDate(end);
        entity.setStatus(OwnerSubscriptionStatus.ACTIVE);

        OwnerSubscription saved = ownerSubscriptionRepository.save(entity);

        owner.setSubscription_id(plan.getId().intValue());
        userRepository.save(owner);

        return saved;
    }

    private void enrichSubscriptionUsage(OwnerSubscriptionResponseDTO dto, Long ownerId) {
        if (dto == null || ownerId == null) {
            return;
        }

        long usedAds = boardingRepository.countByOwner_Id(ownerId);
        dto.setUsedAds(usedAds);

        long maxAds = dto.getMaxAds() != null ? dto.getMaxAds() : 0;
        long remaining = Math.max(0, maxAds - usedAds);
        dto.setRemainingAdsAllowed(remaining);
    }

    private void expireSubscriptionsForOwner(Long ownerId) {
        OwnerSubscription maybeActive = ownerSubscriptionRepository
                .findByOwnerIdAndStatus(ownerId, OwnerSubscriptionStatus.ACTIVE)
                .orElse(null);

        if (maybeActive != null && maybeActive.getEndDate() != null && maybeActive.getEndDate().isBefore(LocalDateTime.now())) {
            maybeActive.setStatus(OwnerSubscriptionStatus.EXPIRED);
            ownerSubscriptionRepository.save(maybeActive);

            User owner = maybeActive.getOwner();
            if (owner != null && owner.getSubscription_id() != null
                    && owner.getSubscription_id().equals(maybeActive.getPlan().getId().intValue())) {
                owner.setSubscription_id(null);
                userRepository.save(owner);
            }
        }
    }

    private int resolveDurationDays(SubscriptionPlan plan) {
        if (plan.getDurationDays() != null && plan.getDurationDays() > 0) {
            return plan.getDurationDays();
        }
        return extractDurationDays(plan.getDuration());
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
