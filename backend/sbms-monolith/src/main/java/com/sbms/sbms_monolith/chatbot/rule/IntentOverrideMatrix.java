package com.sbms.sbms_monolith.chatbot.rule;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Component;


@Component
public class IntentOverrideMatrix {

    private final List<IntentOverrideRule> rules = List.of(

        new IntentOverrideRule(
            "PAYMENT_HELP",
            List.of("late", "delay", "penalty", "overdue", "after due"),
            "LATE_PAYMENT_RULES"
        ),

        // PAYMENT → HISTORY
        new IntentOverrideRule(
            "PAYMENT_HELP",
            List.of("history", "receipt", "past", "previous", "old"),
            "PAYMENT_HISTORY"
        ),

        // PAYMENT → FAILED
        new IntentOverrideRule(
            "PAYMENT_HELP",
            List.of("failed", "error", "not completed", "unsuccessful"),
            "PAYMENT_FAILED"
        ),

        // PAYMENT FAILED → HISTORY
        new IntentOverrideRule(
            "PAYMENT_FAILED",
            List.of("receipt", "status", "proof"),
            "PAYMENT_HISTORY"
        ),

        // PAYMENT FAILED → LATE RULES
        new IntentOverrideRule(
            "PAYMENT_FAILED",
            List.of("late", "penalty"),
            "LATE_PAYMENT_RULES"
        ),

        // =====================================================
        // BILL & UTILITIES
        // =====================================================

        // BILL → UTILITIES
        new IntentOverrideRule(
            "BILL_CALCULATION",
            List.of("electricity", "current", "units", "power"),
            "UTILITIES_HELP"
        ),

        new IntentOverrideRule(
            "BILL_CALCULATION",
            List.of("water", "usage", "liters"),
            "UTILITIES_HELP"
        ),

        // UTILITIES → BILL
        new IntentOverrideRule(
            "UTILITIES_HELP",
            List.of("total", "final", "combined"),
            "BILL_CALCULATION"
        ),

        // =====================================================
        // REGISTRATION FLOW
        // =====================================================

        // REGISTRATION PROCESS → STATUS
        new IntentOverrideRule(
            "REGISTRATION_PROCESS",
            List.of("status", "approved", "pending", "accepted"),
            "REGISTRATION_STATUS"
        ),

        // REGISTRATION STATUS → REJECTION
        new IntentOverrideRule(
            "REGISTRATION_STATUS",
            List.of("rejected", "reject", "denied", "declined"),
            "REGISTRATION_REJECTION"
        ),

        // REGISTRATION REJECTION → PROCESS (REAPPLY)
        new IntentOverrideRule(
            "REGISTRATION_REJECTION",
            List.of("reapply", "again", "new request"),
            "REGISTRATION_PROCESS"
        ),

        new IntentOverrideRule(
            "MAINTENANCE",
            List.of("status", "progress", "approved"),
            "MAINTENANCE"
        ),

        new IntentOverrideRule(
            "MAINTENANCE",
            List.of("delay", "late", "not fixed", "still pending", "long time"),
            "MAINTENANCE"
        ),

        // MAINTENANCE DELAY → REPORT
        new IntentOverrideRule(
            "MAINTENANCE",
            List.of("complaint", "report", "owner not responding"),
            "REPORT_ISSUES_HELP"
        ),

        // =====================================================
        // APPOINTMENT FLOW
        // =====================================================

        // APPOINTMENT → STATUS
        new IntentOverrideRule(
            "APPOINTMENT_HELP",
            List.of("status", "approved", "pending"),
            "APPOINTMENT_HELP"
        ),

        // APPOINTMENT → RESCHEDULE
        new IntentOverrideRule(
            "APPOINTMENT_HELP",
            List.of("change time", "reschedule", "postpone"),
            "APPOINTMENT_HELP"
        ),

        // =====================================================
        // REPORTING & SAFETY
        // =====================================================

        // REPORT → STATUS
        new IntentOverrideRule(
            "REPORT_ISSUES_HELP",
            List.of("status", "progress", "admin response"),
            "REPORT_ISSUES_HELP"
        ),

        // REPORT → SAFETY ESCALATION
        new IntentOverrideRule(
            "REPORT_ISSUES_HELP",
            List.of("unsafe", "threat", "danger", "emergency"),
            "REPORT_ISSUES_HELP"
        )
    );

    public Optional<String> resolveOverride(String lastIntent, String message) {

        if (lastIntent == null || message == null) {
            return Optional.empty();
        }

        return rules.stream()
                .filter(rule -> rule.matches(lastIntent, message))
                .map(IntentOverrideRule::overrideIntent)
                .findFirst();
    }
}
