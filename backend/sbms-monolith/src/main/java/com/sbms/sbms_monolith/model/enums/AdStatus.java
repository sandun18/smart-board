package com.sbms.sbms_monolith.model.enums;

public enum AdStatus {
    PENDING,    // Just submitted by user
    APPROVED,   // Admin accepted, but might not be "Live" yet
    ACTIVE,     // Currently displaying on panels
    PAUSED,     // Temporarily hidden by Admin
    REJECTED,   // Admin declined the submission
    EXPIRED     // Reached the expiry date
}