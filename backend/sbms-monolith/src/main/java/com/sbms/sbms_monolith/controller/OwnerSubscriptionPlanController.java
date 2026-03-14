package com.sbms.sbms_monolith.controller;

import com.sbms.sbms_monolith.dto.subscription.SubscriptionPlanCreateDTO;
import com.sbms.sbms_monolith.dto.subscription.SubscriptionPlanResponseDTO;
import com.sbms.sbms_monolith.service.SubscriptionPlanService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

/**
 * Owner-only endpoints for managing subscription plans.
 */
@RestController
@RequestMapping("/api/owner/subscription-plans")
@PreAuthorize("hasRole('OWNER')")
@RequiredArgsConstructor
public class OwnerSubscriptionPlanController {

    private final SubscriptionPlanService subscriptionPlanService;

    @PostMapping
    public ResponseEntity<SubscriptionPlanResponseDTO> createPlan(@Valid @RequestBody SubscriptionPlanCreateDTO dto) {
        throw new ResponseStatusException(
                HttpStatus.FORBIDDEN,
                "Subscription plan creation is admin-only. Use /api/admin/subscription-plans"
        );
    }

    @PutMapping("/{id}")
    public ResponseEntity<SubscriptionPlanResponseDTO> updatePlan(
            @PathVariable Long id,
            @Valid @RequestBody SubscriptionPlanCreateDTO dto) {
        throw new ResponseStatusException(
            HttpStatus.FORBIDDEN,
            "Subscription plan update is admin-only. Use /api/admin/subscription-plans/{id}"
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePlan(@PathVariable Long id) {
        throw new ResponseStatusException(
            HttpStatus.FORBIDDEN,
            "Subscription plan deletion is admin-only. Use /api/admin/subscription-plans/{id}"
        );
    }

    @GetMapping
    public ResponseEntity<List<SubscriptionPlanResponseDTO>> getAllPlans() {
        return ResponseEntity.ok(subscriptionPlanService.getAllPlans());
    }

    @GetMapping("/{id}")
    public ResponseEntity<SubscriptionPlanResponseDTO> getPlanById(@PathVariable Long id) {
        return ResponseEntity.ok(subscriptionPlanService.getPlanById(id));
    }
}