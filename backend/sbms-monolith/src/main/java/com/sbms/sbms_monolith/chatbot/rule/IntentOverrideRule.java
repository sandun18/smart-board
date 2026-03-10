package com.sbms.sbms_monolith.chatbot.rule;

import java.util.List;

public record IntentOverrideRule(
        String previousIntent,
        List<String> keywords,
        String overrideIntent
) {
    public boolean matches(String lastIntent, String message) {

        if (!previousIntent.equals(lastIntent)) {
            return false;
        }

        String lowerMsg = message.toLowerCase();

        return keywords.stream()
                .anyMatch(lowerMsg::contains);
    }
}

