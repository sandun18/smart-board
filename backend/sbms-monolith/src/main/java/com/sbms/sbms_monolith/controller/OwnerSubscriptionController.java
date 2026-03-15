package com.sbms.sbms_monolith.controller;

import com.sbms.sbms_monolith.dto.subscription.OwnerSubscriptionRequestDTO;
import com.sbms.sbms_monolith.dto.subscription.OwnerSubscriptionResponseDTO;
import com.sbms.sbms_monolith.dto.subscription.SubscriptionPlanResponseDTO;
import com.sbms.sbms_monolith.service.OwnerSubscriptionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/owner")
@PreAuthorize("hasRole('OWNER')")
@RequiredArgsConstructor
public class OwnerSubscriptionController {

    private final OwnerSubscriptionService ownerSubscriptionService;

    @PostMapping("/subscriptions")
    public OwnerSubscriptionResponseDTO subscribe(
            @RequestBody OwnerSubscriptionRequestDTO request,
            Authentication authentication
    ) {
        return ownerSubscriptionService.subscribeOwner(authentication.getName(), request);
    }

    @GetMapping("/subscriptions/current")
    public OwnerSubscriptionResponseDTO current(Authentication authentication) {
        return ownerSubscriptionService.getCurrentSubscription(authentication.getName());
    }

    @GetMapping("/subscriptions/history")
    public List<OwnerSubscriptionResponseDTO> history(Authentication authentication) {
        return ownerSubscriptionService.getSubscriptionHistory(authentication.getName());
    }

    @GetMapping("/subscription-plans/current")
    public ResponseEntity<?> getCurrentPlan(Authentication authentication) {
        String email = authentication.getName();
        SubscriptionPlanResponseDTO currentPlan = ownerSubscriptionService.getCurrentPlan(email);
        if (currentPlan == null) {
            return ResponseEntity.ok(Map.of("hasSubscription", false));
        }
        return ResponseEntity.ok(currentPlan);
    }
}

