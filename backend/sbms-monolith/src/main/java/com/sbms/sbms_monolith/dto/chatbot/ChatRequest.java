package com.sbms.sbms_monolith.dto.chatbot;


import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class ChatRequest {
    @NotBlank
    private String message;
    private String sessionId;
}
