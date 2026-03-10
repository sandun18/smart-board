package com.sbms.sbms_monolith.model;


import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ChatResponse {
    private String intent;
    private double confidence;
    private String reply;
}
