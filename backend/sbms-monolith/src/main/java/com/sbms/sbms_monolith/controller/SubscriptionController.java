package com.sbms.sbms_monolith.controller;

import com.sbms.sbms_monolith.dto.subscription.OwnerSubscriptionResponseDTO;
import com.sbms.sbms_monolith.dto.subscription.SubscriptionCreateRequestDTO;
import com.sbms.sbms_monolith.service.OwnerSubscriptionService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/subscriptions")
@PreAuthorize("hasRole('OWNER')")
@RequiredArgsConstructor
public class SubscriptionController {

    private final OwnerSubscriptionService ownerSubscriptionService;

    @PostMapping
    public OwnerSubscriptionResponseDTO createSubscription(
            @RequestBody SubscriptionCreateRequestDTO request,
            Authentication authentication
    ) {
        return ownerSubscriptionService.createSubscription(authentication.getName(), request);
    }
}
