package com.sbms.sbms_monolith.mapper;

import com.sbms.sbms_monolith.dto.appointment.AppointmentResponseDTO;
import com.sbms.sbms_monolith.model.Appointment;
import com.sbms.sbms_monolith.model.Boarding;
import com.sbms.sbms_monolith.model.User;

public class AppointmentMapper {

    public static AppointmentResponseDTO toDto(Appointment a) {
        AppointmentResponseDTO dto = new AppointmentResponseDTO();
        Boarding b = a.getBoarding();
        User s = a.getStudent();

        dto.setId(a.getId());

        dto.setBoardingId(b.getId());
        dto.setBoardingTitle(b.getTitle());
        dto.setBoardingAddress(b.getAddress());

        dto.setKeyMoney(b.getKeyMoney());

        if (b.getImageUrls() != null && !b.getImageUrls().isEmpty()) {
            dto.setBoardingImage(b.getImageUrls().getFirst());
        }

        dto.setStudentId(s.getId());
        dto.setStudentName(s.getFullName());
        dto.setStudentEmail(s.getEmail());

        if (b.getOwner() != null) {
            dto.setOwnerId(b.getOwner().getId());
            dto.setOwnerName(b.getOwner().getFullName());
            dto.setOwnerContact(b.getOwner().getPhone());
        }


        dto.setNumberOfStudents(a.getNumberOfStudents());

        dto.setRequestedStartTime(a.getRequestedStartTime());
        dto.setRequestedEndTime(a.getRequestedEndTime());

        dto.setOwnerStartTime(a.getOwnerStartTime());
        dto.setOwnerEndTime(a.getOwnerEndTime());

        dto.setStatus(a.getStatus());

        dto.setStudentNote(a.getStudentNote());
        dto.setOwnerNote(a.getOwnerNote());

        return dto;
    }
}