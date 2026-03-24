package com.sbms.sbms_monolith.common;

import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

/**
 * Thrown when an owner tries to use a feature that their current
 * subscription plan does not allow (e.g. ad boosting).
 */
public class SubscriptionFeatureNotAllowedException extends ResponseStatusException {

    public SubscriptionFeatureNotAllowedException(String reason) {
        super(HttpStatus.FORBIDDEN, reason);
    }
}

