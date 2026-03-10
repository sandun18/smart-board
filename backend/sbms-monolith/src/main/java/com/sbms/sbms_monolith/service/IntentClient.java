package com.sbms.sbms_monolith.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.sbms.sbms_monolith.dto.chatbot.IntentRequest;
import com.sbms.sbms_monolith.dto.chatbot.IntentResponse;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class IntentClient {

    private final RestTemplate restTemplate;

    //@Value("${ml.intent.base-url}")
    private String mlBaseUrl = "http://localhost:8000";

    public IntentResponse predictIntent(String message) {
        IntentRequest request = new IntentRequest(message);

        return restTemplate.postForObject(
                mlBaseUrl + "/predict",
                request,
                IntentResponse.class
        );
    }
}
