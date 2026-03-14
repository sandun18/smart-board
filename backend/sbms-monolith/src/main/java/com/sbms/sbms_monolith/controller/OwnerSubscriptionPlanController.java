package com.sbms.sbms_monolith.controller;

import com.sbms.sbms_monolith.dto.subscription.SubscriptionPlanCreateDTO;
import com.sbms.sbms_monolith.dto.subscription.SubscriptionPlanResponseDTO;
import com.sbms.sbms_monolith.service.SubscriptionPlanService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

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
        return ResponseEntity.ok(subscriptionPlanService.createPlan(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<SubscriptionPlanResponseDTO> updatePlan(
            @PathVariable Long id,
            @Valid @RequestBody SubscriptionPlanCreateDTO dto) {
        return ResponseEntity.ok(subscriptionPlanService.updatePlan(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePlan(@PathVariable Long id) {
        subscriptionPlanService.deletePlan(id);
        return ResponseEntity.noContent().build();
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