package com.sbms.sbms_monolith.service;

import java.time.Instant;

import org.springframework.stereotype.Service;

import com.sbms.sbms_monolith.model.UnknownIntentLog;
import com.sbms.sbms_monolith.repository.UnknownIntentLogRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UnknownIntentLogger {

    private final UnknownIntentLogRepository repository;

    public void log(String sessionId, String message, double confidence) {

        UnknownIntentLog log = new UnknownIntentLog();
        log.setSessionId(sessionId);
        log.setMessage(message);
        log.setConfidence(confidence);
        log.setTimestamp(Instant.now());

        repository.save(log);
    }
}
