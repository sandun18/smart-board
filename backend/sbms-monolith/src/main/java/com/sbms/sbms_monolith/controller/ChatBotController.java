package com.sbms.sbms_monolith.controller;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import com.sbms.sbms_monolith.dto.chatbot.ChatRequest;
import com.sbms.sbms_monolith.dto.chatbot.ChatResponse;
import com.sbms.sbms_monolith.service.ChatbotService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/chatbot")
@RequiredArgsConstructor
public class ChatBotController {

    private final ChatbotService chatbotService;

    @PostMapping("/chat")
    public ChatResponse chat(@RequestBody ChatRequest request) {

        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null || !authentication.isAuthenticated()) {
            throw new IllegalStateException("User not authenticated");
        }

        // This is what you used in JWT -> username = email
        String userEmail = authentication.getName();

        return chatbotService.chat(
                request.getMessage(),
                userEmail   // sessionId
        );
    }
}
