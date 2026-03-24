package com.sbms.sbms_monolith.service;


import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.sbms.sbms_monolith.events.EventMessage;

import java.time.Instant;
import java.util.Map;

@Service
public class NotificationPublisher {

    private static final Logger log = LoggerFactory.getLogger(NotificationPublisher.class);

    private final RabbitTemplate rabbitTemplate;

    @Value("${sbms.rabbitmq.exchange:sbms.events}")
    private String exchangeName;

    @Autowired
    public NotificationPublisher(@Autowired(required = false) RabbitTemplate rabbitTemplate) {
        this.rabbitTemplate = rabbitTemplate;
    }

    public void publish(String eventType,
                        Long targetUserId,
                        String aggregateId,
                        Map<String, Object> data) {

        if (rabbitTemplate == null) {
            log.warn("RabbitMQ is not available — event '{}' not published", eventType);
            return;
        }

        try {
            EventMessage event = EventMessage.builder()
                    .eventType(eventType)
                    .sourceService("sbms-backend")
                    .aggregateId(aggregateId)
                    .userId(targetUserId != null ? String.valueOf(targetUserId) : null)
                    .data(data)
                    .occurredAt(Instant.now())
                    .build();

            rabbitTemplate.convertAndSend(exchangeName, eventType, event);

        } catch (Exception e) {
            throw new RuntimeException("Failed to publish event", e);
        }
    }
}
