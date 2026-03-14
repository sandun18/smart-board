package com.sbms.sbms_monolith.controller;

<<<<<<< HEAD
import com.sbms.sbms_monolith.dto.subscription.OwnerSubscriptionRequestDTO;
import com.sbms.sbms_monolith.dto.subscription.OwnerSubscriptionResponseDTO;
import com.sbms.sbms_monolith.service.OwnerSubscriptionService;
import lombok.RequiredArgsConstructor;
=======
import com.sbms.sbms_monolith.dto.subscription.SubscriptionPlanResponseDTO;
import com.sbms.sbms_monolith.model.PaymentIntent;
import com.sbms.sbms_monolith.service.OwnerSubscriptionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
>>>>>>> 3621e99b3aa3481d97ecd01ac84d36ff24145c02
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

<<<<<<< HEAD
import java.util.List;

@RestController
@RequestMapping("/api/owner/subscriptions")
=======
import java.util.Map;

@RestController
@RequestMapping("/api/owner/subscription-plans")
>>>>>>> 3621e99b3aa3481d97ecd01ac84d36ff24145c02
@PreAuthorize("hasRole('OWNER')")
@RequiredArgsConstructor
public class OwnerSubscriptionController {

    private final OwnerSubscriptionService ownerSubscriptionService;

<<<<<<< HEAD
    @PostMapping
    public OwnerSubscriptionResponseDTO subscribe(
            @RequestBody OwnerSubscriptionRequestDTO request,
            Authentication authentication
    ) {
        return ownerSubscriptionService.subscribeOwner(authentication.getName(), request);
    }

    @GetMapping("/current")
    public OwnerSubscriptionResponseDTO current(Authentication authentication) {
        return ownerSubscriptionService.getCurrentSubscription(authentication.getName());
    }

    @GetMapping("/history")
    public List<OwnerSubscriptionResponseDTO> history(Authentication authentication) {
        return ownerSubscriptionService.getSubscriptionHistory(authentication.getName());
    }
}

=======
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
>>>>>>> 3621e99b3aa3481d97ecd01ac84d36ff24145c02
