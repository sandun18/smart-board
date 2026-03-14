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
public class StudentSubscriptionService {

    private final UserRepository userRepository;
    private final SubscriptionPlanRepository subscriptionPlanRepository;
    private final SubscriptionPlanMapper subscriptionPlanMapper;
    private final PaymentIntentService paymentIntentService;

    @Transactional
    public PaymentIntent createBuyPlanIntent(String studentEmail, Long planId) {
        User student = userRepository.findByEmail(studentEmail)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Student not found"));

        SubscriptionPlan plan = subscriptionPlanRepository.findById(planId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Subscription plan not found"));

        if (!plan.isActive()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Selected plan is inactive");
        }

        CreatePaymentIntentDTO dto = new CreatePaymentIntentDTO();
        dto.setStudentId(student.getId());
        dto.setType(PaymentType.SUBSCRIPTION);
        dto.setAmount(BigDecimal.valueOf(plan.getPrice()));
        dto.setDescription("Subscription Plan Purchase - " + plan.getName());
        dto.setSubscriptionPlanId(plan.getId());

        return paymentIntentService.create(dto);
    }

    @Transactional
    public SubscriptionPlanResponseDTO buyPlan(String studentEmail, Long planId) {
        User student = userRepository.findByEmail(studentEmail)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Student not found"));

        SubscriptionPlan plan = subscriptionPlanRepository.findById(planId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Subscription plan not found"));

        if (!plan.isActive()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Selected plan is inactive");
        }

        student.setSubscription_id(plan.getId().intValue());
        userRepository.save(student);

        return subscriptionPlanMapper.toResponseDto(plan);
    }

    @Transactional(readOnly = true)
    public SubscriptionPlanResponseDTO getCurrentPlan(String studentEmail) {
        User student = userRepository.findByEmail(studentEmail)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Student not found"));

        if (student.getSubscription_id() <= 0) {
            return null;
        }

        SubscriptionPlan plan = subscriptionPlanRepository.findById((long) student.getSubscription_id())
                .orElse(null);

        return subscriptionPlanMapper.toResponseDto(plan);
    }
}
