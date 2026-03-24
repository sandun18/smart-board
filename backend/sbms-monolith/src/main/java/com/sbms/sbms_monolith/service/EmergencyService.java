package com.sbms.sbms_monolith.service;

import java.time.LocalDateTime;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.sbms.sbms_monolith.model.Boarding;
import com.sbms.sbms_monolith.model.EmergencyTriggeredEvent;
import com.sbms.sbms_monolith.repository.BoardingRepository;
import com.sbms.sbms_monolith.repository.UserRepository;
import com.sbms.sbms_monolith.model.User;

import lombok.RequiredArgsConstructor;

@Service
public class EmergencyService {

    private static final Logger log = LoggerFactory.getLogger(EmergencyService.class);

    private final RabbitTemplate rabbitTemplate;
    private final BoardingRepository boardingRepo;
    private final UserRepository userRepo;

    @Value("${sbms.rabbitmq.exchange:emergency}")
    private String exchange;

    @Autowired
    public EmergencyService(
            @Autowired(required = false) RabbitTemplate rabbitTemplate,
            BoardingRepository boardingRepo,
            UserRepository userRepo) {
        this.rabbitTemplate = rabbitTemplate;
        this.boardingRepo = boardingRepo;
        this.userRepo = userRepo;
    }

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
        
        if (rabbitTemplate == null) {
            log.warn("RabbitMQ is not available — emergency event not published");
            return;
        }

        rabbitTemplate.convertAndSend(
            exchange,
            "emergency.triggered",
            event
        );
        log.info("Emergency event published for student {}", studentId);
    }
}
