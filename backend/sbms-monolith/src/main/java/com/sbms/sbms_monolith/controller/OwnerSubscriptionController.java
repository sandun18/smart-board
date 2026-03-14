package com.sbms.sbms_monolith.controller;

import com.sbms.sbms_monolith.dto.subscription.OwnerSubscriptionRequestDTO;
import com.sbms.sbms_monolith.dto.subscription.OwnerSubscriptionResponseDTO;
import com.sbms.sbms_monolith.service.OwnerSubscriptionService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/owner/subscriptions")
@PreAuthorize("hasRole('OWNER')")
@RequiredArgsConstructor
public class OwnerSubscriptionController {

    private final OwnerSubscriptionService ownerSubscriptionService;

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

