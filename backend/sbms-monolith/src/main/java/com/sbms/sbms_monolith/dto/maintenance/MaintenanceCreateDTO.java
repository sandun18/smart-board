package com.sbms.sbms_monolith.dto.maintenance;


import java.util.List;

import com.sbms.sbms_monolith.model.enums.MaintenanceIssueType;
import com.sbms.sbms_monolith.model.enums.MaintenanceUrgency;

import lombok.Data;

@Data
public class MaintenanceCreateDTO {

    private Long boardingId;
    private String title;
    private String description;
    private MaintenanceIssueType issueType;
    private MaintenanceUrgency maintenanceUrgency;
    
    private List<String> imageUrls;
}
