package com.sbms.sbms_monolith.dto.chatbot;

import java.util.List;


import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ChatResponse {
    private String intent;
    private String reply;
    private double confidence;
    private String explanation;
    private List<String> suggestions;
}
