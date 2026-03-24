package com.sbms.sbms_monolith.common;

import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

/**
 * Thrown when an owner attempts to access a subscription-gated feature
 * without an active subscription.
 */
public class SubscriptionRequiredException extends ResponseStatusException {

    public SubscriptionRequiredException(String reason) {
        super(HttpStatus.FORBIDDEN, reason);
    }
}

