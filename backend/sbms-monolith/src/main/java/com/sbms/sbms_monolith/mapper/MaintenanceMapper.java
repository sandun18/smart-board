package com.sbms.sbms_monolith.mapper;

import com.sbms.sbms_monolith.dto.maintenance.MaintenanceResponseDTO;
import com.sbms.sbms_monolith.model.Maintenance;

public class MaintenanceMapper {

    public static MaintenanceResponseDTO toDTO(Maintenance m) {

        if (m == null) {
            return null;
        }

        MaintenanceResponseDTO dto = new MaintenanceResponseDTO();

        dto.setId(m.getId());

        if (m.getBoarding() != null) {
            dto.setBoardingId(m.getBoarding().getId());
            dto.setBoardingTitle(m.getBoarding().getTitle());
        }

        if (m.getStudent() != null) {
            dto.setStudentId(m.getStudent().getId());
            dto.setStudentName(m.getStudent().getFullName());
        }

        dto.setTitle(m.getTitle());
        dto.setDescription(m.getDescription());
        dto.setImageUrls(m.getImageUrls());

        dto.setStatus(m.getStatus());
        dto.setStudentNote(m.getStudentNote());
        dto.setOwnerNote(m.getOwnerNote());
        dto.setMaintenanceUrgency(m.getMaintenanceUrgency());
        dto.setCreatedAt(m.getCreatedAt());
        dto.setUpdatedAt(m.getUpdatedAt());


        return dto;
    }
}
