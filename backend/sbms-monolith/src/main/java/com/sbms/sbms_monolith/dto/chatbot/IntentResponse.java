package com.sbms.sbms_monolith.dto.chatbot;

import lombok.Data;

@Data
public class IntentResponse {
    private String intent;
    private double confidence;
    private boolean fallback;
}
