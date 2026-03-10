package com.sbms.sbms_monolith.service;

import java.util.List;

import org.springframework.stereotype.Component;

@Component
public class ResponseGenerator {

    public String generateReply(String intent) {

        return switch (intent) {

            case "PAYMENT_HELP" ->
                "You can pay your boarding and utility bills from the Payments section.";

            case "PAYMENT_HISTORY" ->
                "You can view and download your past payment receipts from Payment History.";

            case "PAYMENT_FAILED" ->
                "If a payment failed or money was deducted, please check Payment History or contact support.";

            case "LATE_PAYMENT_RULES" ->
                "Late payments may result in penalties. Please check the due date shown in the app.";

            case "BILL_CALCULATION" ->
                "Your bill includes rent, electricity, and water charges calculated monthly.";

            case "REGISTRATION_PROCESS" ->
                "You can apply for a boarding by submitting a registration request.";

            case "REGISTRATION_STATUS" ->
                "You can check the status of your boarding registration in the app.";

            case "REGISTRATION_REJECTION" ->
                "If your registration was rejected, you may review the reason and apply again.";

            case "MAINTENANCE" ->
                "You can submit and track maintenance requests from the Maintenance section.";

            case "UTILITIES_HELP" ->
                "Utility charges depend on monthly electricity and water usage.";

            case "APPOINTMENT_HELP" ->
                "You can request and manage visit appointments from the Appointments section.";

            case "REPORT_ISSUES_HELP" ->
                "You can report issues related to owners or boarding rooms from the Reports section.";

            default ->
                "I’m not sure about that. Please try asking in a different way.";
        };
    }

    // -----------------------------
    // FOLLOW-UP SUGGESTIONS (NEW)
    // -----------------------------
    public List<String> generateSuggestions(String intent) {

        return switch (intent) {

            case "PAYMENT_HELP" -> List.of(
                    "What happens if I pay late?",
                    "Where can I see my payment history?"
            );

            case "PAYMENT_HISTORY" -> List.of(
                    "How can I download a receipt?",
                    "What if a payment is missing?"
            );

            case "PAYMENT_FAILED" -> List.of(
                    "Money was deducted, what should I do?",
                    "How long does refund take?"
            );

            case "REGISTRATION_PROCESS" -> List.of(
                    "How long does approval take?",
                    "How can I check my registration status?"
            );

            case "REGISTRATION_STATUS" -> List.of(
                    "Why is my registration pending?",
                    "What if my registration is rejected?"
            );

            case "MAINTENANCE" -> List.of(
                    "How can I check maintenance status?",
                    "What if the owner does not respond?"
            );

            case "LATE_PAYMENT_RULES" -> List.of(
                    "Is there a grace period?",
                    "Can penalties be removed?"
            );

            case "UTILITIES_HELP" -> List.of(
                    "Why is my electricity bill high?",
                    "How are water charges calculated?"
            );

            default -> List.of(); // No suggestions
        };
    }
}
