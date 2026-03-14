package com.sbms.sbms_monolith.controller;

import com.sbms.sbms_monolith.dto.subscription.SubscriptionPlanResponseDTO;
import com.sbms.sbms_monolith.model.PaymentIntent;
import com.sbms.sbms_monolith.service.OwnerSubscriptionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/owner/subscription-plans")
@PreAuthorize("hasRole('OWNER')")
@RequiredArgsConstructor
public class OwnerSubscriptionController {

    private final OwnerSubscriptionService ownerSubscriptionService;

    @PostMapping("/{planId}/buy-intent")
    public ResponseEntity<PaymentIntent> createBuyIntent(
            @PathVariable Long planId,
            Authentication authentication
    ) {
        String email = authentication.getName();
        return ResponseEntity.ok(ownerSubscriptionService.createBuyPlanIntent(email, planId));
    }

    @PostMapping("/{planId}/buy")
    public ResponseEntity<SubscriptionPlanResponseDTO> buyPlan(
            @PathVariable Long planId,
            Authentication authentication
    ) {
        String email = authentication.getName();
        return ResponseEntity.ok(ownerSubscriptionService.buyPlan(email, planId));
    }

    @GetMapping("/current")
    public ResponseEntity<?> getCurrentPlan(Authentication authentication) {
        String email = authentication.getName();
        SubscriptionPlanResponseDTO currentPlan = ownerSubscriptionService.getCurrentPlan(email);
        if (currentPlan == null) {
            return ResponseEntity.ok(Map.of("hasSubscription", false));
        }
        return ResponseEntity.ok(currentPlan);
    }
}