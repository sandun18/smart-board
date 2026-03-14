package com.sbms.sbms_monolith.controller;

import com.sbms.sbms_monolith.dto.subscription.SubscriptionPlanResponseDTO;
import com.sbms.sbms_monolith.model.PaymentIntent;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.Map;

@RestController
@RequestMapping("/api/student/subscription-plans")
@PreAuthorize("hasRole('STUDENT')")
@RequiredArgsConstructor
public class StudentSubscriptionController {

    @PostMapping("/{planId}/buy-intent")
    public ResponseEntity<PaymentIntent> createBuyIntent(
            @PathVariable Long planId,
            Authentication authentication
    ) {
        throw new ResponseStatusException(
            HttpStatus.FORBIDDEN,
            "Student subscription purchase has moved to owner endpoint: /api/owner/subscription-plans/{planId}/buy-intent"
        );
    }

    @PostMapping("/{planId}/buy")
    public ResponseEntity<SubscriptionPlanResponseDTO> buyPlan(
            @PathVariable Long planId,
            Authentication authentication
    ) {
        throw new ResponseStatusException(
            HttpStatus.FORBIDDEN,
            "Student subscription purchase has moved to owner endpoint: /api/owner/subscription-plans/{planId}/buy"
        );
    }

    @GetMapping("/current")
    public ResponseEntity<?> getCurrentPlan(Authentication authentication) {
        return ResponseEntity.ok(Map.of(
                "hasSubscription", false,
                "message", "Student subscription tracking is disabled; subscriptions are owner-managed"
        ));
    }
}
