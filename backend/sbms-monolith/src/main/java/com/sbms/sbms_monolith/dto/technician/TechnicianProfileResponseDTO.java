package com.sbms.sbms_monolith.dto.technician;

import com.sbms.sbms_monolith.model.enums.Gender;
import com.sbms.sbms_monolith.model.enums.MaintenanceIssueType;
import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

@Data
public class TechnicianProfileResponseDTO {
    private Long id;
    private String fullName;
    private String email;
    private String phone;
    private String profileImageUrl;
    private String nicNumber;
    private String dob;
    private Gender gender;
    private String address;
    private String city;
    private String province;
    private Double basePrice;
    private List<MaintenanceIssueType> skills;
    private BigDecimal averageRating;
    private Integer totalJobsCompleted;
}
