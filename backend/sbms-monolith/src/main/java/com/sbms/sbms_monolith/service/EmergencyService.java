package com.sbms.sbms_monolith.service;

import java.time.LocalDateTime;

import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.sbms.sbms_monolith.model.Boarding;
import com.sbms.sbms_monolith.model.EmergencyTriggeredEvent;
import com.sbms.sbms_monolith.repository.BoardingRepository;
import com.sbms.sbms_monolith.repository.UserRepository;
import com.sbms.sbms_monolith.model.User;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class EmergencyService {

    private final RabbitTemplate rabbitTemplate;
    private final BoardingRepository boardingRepo;
    private final UserRepository userRepo;

    @Value("${sbms.rabbitmq.exchange}")
    private String exchange;

    public void trigger(Long studentId, Long boardingId,
    		 Double latitude,
             Double longitude) {

        Boarding boarding = boardingRepo.findById(boardingId)
            .orElseThrow(() -> new RuntimeException("Boarding not found"));
        
        User student =   userRepo.findById(studentId)
        		.orElseThrow(() -> new RuntimeException("User not found"));

        EmergencyTriggeredEvent event =
            new EmergencyTriggeredEvent(
                studentId,
                boarding.getOwner().getId(),
                boardingId,
                student.getFullName(),
                boarding.getTitle(),
                "PANIC_BUTTON",
                LocalDateTime.now(),
                latitude,
                longitude
            );
        
        System.out.println("Notifiation event sent");

        rabbitTemplate.convertAndSend(
            exchange,
            "emergency.triggered",
            event
        );
    }
}
