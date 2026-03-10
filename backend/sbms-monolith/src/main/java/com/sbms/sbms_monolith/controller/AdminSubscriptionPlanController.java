package com.sbms.sbms_monolith.controller;

import com.sbms.sbms_monolith.dto.subscription.SubscriptionPlanCreateDTO;
import com.sbms.sbms_monolith.dto.subscription.SubscriptionPlanResponseDTO;
import com.sbms.sbms_monolith.service.SubscriptionPlanService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Admin-only endpoints for managing subscription plans.
 * Secured by both SecurityConfig ("/api/admin/**" -> hasRole('ADMIN'))
 * and method-level @PreAuthorize.
 */
@RestController
@RequestMapping("/api/admin/subscription-plans")
@PreAuthorize("hasRole('ADMIN')")
@RequiredArgsConstructor
public class AdminSubscriptionPlanController {

    private final SubscriptionPlanService subscriptionPlanService;

    @PostMapping
    public ResponseEntity<SubscriptionPlanResponseDTO> createPlan(@RequestBody SubscriptionPlanCreateDTO dto) {
        return ResponseEntity.ok(subscriptionPlanService.createPlan(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<SubscriptionPlanResponseDTO> updatePlan(
            @PathVariable Long id,
            @RequestBody SubscriptionPlanCreateDTO dto) {
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
