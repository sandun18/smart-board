package com.sbms.sbms_monolith.controller;

import com.sbms.sbms_monolith.dto.subscription.SubscriptionPlanResponseDTO;
import com.sbms.sbms_monolith.service.SubscriptionPlanService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Public-facing (authenticated) endpoint for viewing active subscription plans.
 * Accessible by any authenticated user (OWNER, STUDENT, ADMIN).
 * Secured by ".anyRequest().authenticated()" in SecurityConfig.
 */
@RestController
@RequestMapping({"/api/subscription-plans", "/api/plans"})
@RequiredArgsConstructor
public class SubscriptionPlanController {

    private final SubscriptionPlanService subscriptionPlanService;

    @GetMapping
    public ResponseEntity<List<SubscriptionPlanResponseDTO>> getActivePlans() {
        return ResponseEntity.ok(subscriptionPlanService.getActivePlans());
    }

    @GetMapping("/{id}")
    public ResponseEntity<SubscriptionPlanResponseDTO> getPlanById(@PathVariable Long id) {
        return ResponseEntity.ok(subscriptionPlanService.getPlanById(id));
    }
}
