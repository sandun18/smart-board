package com.sbms.sbms_monolith.model;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class EmergencyTriggeredEvent {

    private Long studentId;
    private Long ownerId;
    private Long boardingId;

    private String studentName;
    private String boardingName;
    
  
    private String reason; // optional (button, message, etc)
    private LocalDateTime triggeredAt;
    
    private Double latitude;
    private Double longitude;


}
