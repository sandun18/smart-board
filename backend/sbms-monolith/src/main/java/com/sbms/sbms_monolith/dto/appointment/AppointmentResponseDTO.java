package com.sbms.sbms_monolith.dto.appointment;

import com.sbms.sbms_monolith.model.enums.AppointmentStatus;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class AppointmentResponseDTO {

    private Long id;

    private Long boardingId;
    private String boardingTitle;
    private String boardingAddress;
    private String distance;

    private String boardingImage;

    private BigDecimal keyMoney;

    private Long studentId;
    private String studentName;
    private String studentEmail;

    private Long ownerId;
    private String ownerName;
    private String ownerContact;

    private int numberOfStudents;

    private LocalDateTime requestedStartTime;
    private LocalDateTime requestedEndTime;

    private LocalDateTime ownerStartTime;
    private LocalDateTime ownerEndTime;

    private AppointmentStatus status;

    private String studentNote;
    private String ownerNote;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
