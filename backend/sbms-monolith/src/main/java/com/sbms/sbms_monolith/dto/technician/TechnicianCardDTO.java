package com.sbms.sbms_monolith.dto.technician;

import com.sbms.sbms_monolith.model.enums.MaintenanceIssueType;
import lombok.Data;

import java.util.List;

@Data
public class TechnicianCardDTO {
    private Long id;
    private String fullName;
    private String profileImageUrl;
    private String city;
    private Double basePrice;
    private List<MaintenanceIssueType> skills;

    // Rating Stats
    private Double averageRating;
    private Integer totalJobs;
}
