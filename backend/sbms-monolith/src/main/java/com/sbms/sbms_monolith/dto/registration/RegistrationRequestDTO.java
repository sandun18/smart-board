package com.sbms.sbms_monolith.dto.registration;

import lombok.Data;

import java.time.LocalDate;

@Data
public class RegistrationRequestDTO {

    private Long boardingId;
    private int numberOfStudents;

    private String studentNote;

    private LocalDate moveInDate;
    private String contractDuration;
    private String emergencyContact;
    private String emergencyPhone;
    private String specialRequirements;

    private String studentSignatureBase64;
}

