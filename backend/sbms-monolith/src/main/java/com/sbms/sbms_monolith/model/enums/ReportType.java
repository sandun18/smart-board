package com.sbms.sbms_monolith.model.enums;

public enum ReportType {
    // --- STUDENT REPORTS ---
    BOARDING,
    OWNER,
    STUDENT,
    SAFETY,
    FRAUD,

    // --- OWNER REPORTS (New) ---
    PAYMENT_ISSUE,
    PROPERTY_DAMAGE,
    RULE_VIOLATION,
    MISCONDUCT,

    //  NEW: OWNER REPORTING TECHNICIAN
    TECHNICIAN_NO_SHOW,     // Tech accepted but didn't come
    POOR_WORK_QUALITY,      // Bad repairs

    //  NEW: TECHNICIAN REPORTING OWNER
    NON_PAYMENT,            // Owner didn't pay
    UNSAFE_ENVIRONMENT,     // House was dangerous

    // --- COMMON ---
    OTHER
}
