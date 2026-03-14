package com.sbms.sbms_monolith.service;

import com.sbms.sbms_monolith.dto.payment.CreatePaymentIntentDTO;
import com.sbms.sbms_monolith.dto.subscription.SubscriptionPlanResponseDTO;
import com.sbms.sbms_monolith.mapper.SubscriptionPlanMapper;
import com.sbms.sbms_monolith.model.PaymentIntent;
import com.sbms.sbms_monolith.model.SubscriptionPlan;
import com.sbms.sbms_monolith.model.User;
import com.sbms.sbms_monolith.model.enums.PaymentType;
import com.sbms.sbms_monolith.repository.SubscriptionPlanRepository;
import com.sbms.sbms_monolith.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;

@Service
@RequiredArgsConstructor
public class OwnerSubscriptionService {

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