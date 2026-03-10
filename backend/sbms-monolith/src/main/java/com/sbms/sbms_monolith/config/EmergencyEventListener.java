package com.sbms.sbms_monolith.config;

import org.springframework.amqp.core.Binding;
import org.springframework.amqp.core.BindingBuilder;
import org.springframework.amqp.core.Queue;
import org.springframework.amqp.core.TopicExchange;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.context.annotation.Bean;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Component;

import com.sbms.sbms_monolith.model.EmergencyTriggeredEvent;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class EmergencyEventListener {

    private final SimpMessagingTemplate messagingTemplate;

    @RabbitListener(queues = "emergency.queue")
    public void handleEmergency(EmergencyTriggeredEvent event) {

        messagingTemplate.convertAndSendToUser(
            event.getOwnerId().toString(),
            "/queue/emergency",
            event
        );
    }
    
   
    
}
