package com.sbms.sbms_monolith.controller;

import com.sbms.sbms_monolith.dto.subscription.OwnerSubscriptionResponseDTO;
import com.sbms.sbms_monolith.dto.subscription.SubscriptionSubscribeRequestDTO;
import com.sbms.sbms_monolith.dto.subscription.SubscriptionCreateDTO;
import com.sbms.sbms_monolith.dto.subscription.SubscriptionResponseDTO;
import com.sbms.sbms_monolith.service.OwnerSubscriptionService;
import com.sbms.sbms_monolith.service.SubscriptionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/subscriptions")
@RequiredArgsConstructor
public class SubscriptionController {

    private final SubscriptionService subscriptionService;
    private final OwnerSubscriptionService ownerSubscriptionService;

    @PostMapping("/subscribe")
    @PreAuthorize("hasRole('OWNER')")
    public ResponseEntity<OwnerSubscriptionResponseDTO> subscribe(
            @Valid @RequestBody SubscriptionSubscribeRequestDTO request,
            Authentication authentication) {
        return ResponseEntity.ok(
                ownerSubscriptionService.subscribeOwnerAfterPayment(authentication.getName(), request));
    }

    @GetMapping("/my")
    @PreAuthorize("hasRole('OWNER')")
    public ResponseEntity<OwnerSubscriptionResponseDTO> mySubscription(Authentication authentication) {
        return ResponseEntity.ok(ownerSubscriptionService.getCurrentSubscription(authentication.getName()));
    }

    @PostMapping
    @PreAuthorize("hasRole('OWNER')")
    public ResponseEntity<SubscriptionResponseDTO> createSubscription(
            @Valid @RequestBody SubscriptionCreateDTO dto) {
        return ResponseEntity.ok(subscriptionService.createSubscription(dto));
    }

    @GetMapping("/owner/{ownerId}")
    @PreAuthorize("hasRole('OWNER') or hasRole('ADMIN')")
    public ResponseEntity<List<SubscriptionResponseDTO>> getOwnerSubscriptions(
            @PathVariable Long ownerId) {
        return ResponseEntity.ok(subscriptionService.getOwnerSubscriptions(ownerId));
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<SubscriptionResponseDTO>> getAllActiveSubscriptions() {
        return ResponseEntity.ok(subscriptionService.getActiveSubscriptions());
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('OWNER') or hasRole('ADMIN')")
    public ResponseEntity<SubscriptionResponseDTO> getSubscriptionById(@PathVariable Long id) {
        return ResponseEntity.ok(subscriptionService.getSubscriptionById(id));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('OWNER') or hasRole('ADMIN')")
    public ResponseEntity<Void> cancelSubscription(@PathVariable Long id) {
        subscriptionService.cancelSubscription(id);
        return ResponseEntity.noContent().build();
    }
}