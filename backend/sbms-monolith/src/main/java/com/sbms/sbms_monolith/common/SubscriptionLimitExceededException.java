package com.sbms.sbms_monolith.common;

import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

/**
 * Thrown when an owner has reached a usage limit for their subscription plan,
 * for example the maximum number of ads.
 */
public class SubscriptionLimitExceededException extends ResponseStatusException {

    public SubscriptionLimitExceededException(String reason) {
        super(HttpStatus.BAD_REQUEST, reason);
    }
}

