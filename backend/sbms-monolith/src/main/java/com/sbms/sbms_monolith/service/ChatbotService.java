package com.sbms.sbms_monolith.service;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.sbms.sbms_monolith.chatbot.rule.IntentOverrideMatrix;
import com.sbms.sbms_monolith.dto.chatbot.ChatResponse;
import com.sbms.sbms_monolith.dto.chatbot.IntentResponse;
import com.sbms.sbms_monolith.service.ContextManager.ChatContext;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ChatbotService {

    private final IntentClient intentClient;
    private final ResponseGenerator responseGenerator;
    private final ContextManager contextManager;
    private final UnknownIntentLogger unknownIntentLogger;
    private final IntentOverrideMatrix overrideMatrix;

    public ChatResponse chat(String message, String sessionId) {

        ChatContext previousContext = contextManager.getContext(sessionId);

        IntentResponse intentResponse = intentClient.predictIntent(message);

        String intent = intentResponse.getIntent();
        double confidence = intentResponse.getConfidence();
        String explanation;

        // -----------------------------
        // APPLY HYBRID OVERRIDE MATRIX
        // -----------------------------
        if (previousContext != null && confidence < 0.75) {

            Optional<String> override =
                    overrideMatrix.resolveOverride(
                            previousContext.lastIntent(),
                            message
                    );

            if (override.isPresent()) {
                intent = override.get();
                explanation = "Based on your previous question, this seems related.";
            } else {
                explanation = confidence >= 0.5
                        ? "I think you are asking about this."
                        : "I’m not fully sure. Please try rephrasing.";
            }
        }
        else {
            explanation = confidence >= 0.75
                    ? "I’m confident about this answer."
                    : "I think you are asking about this.";
        }

        // -----------------------------
        // LOG UNKNOWN INTENTS
        // -----------------------------
        if ("UNKNOWN".equals(intent)) {
            unknownIntentLogger.log(sessionId, message, confidence);
        }

        String reply = responseGenerator.generateReply(intent);
        List<String> suggestions = responseGenerator.generateSuggestions(intent);

        contextManager.updateContext(sessionId, intent);

        return new ChatResponse(
                intent,
                reply,
                confidence,
                explanation,
                suggestions
        );
    }
}

