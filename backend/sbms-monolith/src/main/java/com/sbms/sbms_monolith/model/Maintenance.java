package com.sbms.sbms_monolith.model;


import java.math.BigDecimal;
import java.util.List;

import com.sbms.sbms_monolith.common.BaseEntity;
import com.sbms.sbms_monolith.model.enums.MaintenanceIssueType;
import com.sbms.sbms_monolith.model.enums.MaintenanceStatus;
import com.sbms.sbms_monolith.model.enums.MaintenanceUrgency;

import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@Entity
@Table(name = "maintenance_requests")
@EqualsAndHashCode(callSuper = true)
public class Maintenance extends BaseEntity {
	
	@ManyToOne
    @JoinColumn(name = "registration_id", nullable = true)
    private Registration registration;

    @ManyToOne
    @JoinColumn(name = "boarding_id", nullable = false)
    private Boarding boarding;

    @ManyToOne
    @JoinColumn(name = "student_id", nullable = false)
    private User student;  

    @Column(nullable = false, length = 150)
    private String title; 

    @Column(nullable = false, length = 1000)
    private String description;

    private List<String> imageUrls; // optional (S3 later)

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private MaintenanceStatus status = MaintenanceStatus.PENDING;

    @Enumerated(EnumType.STRING)
    private MaintenanceIssueType issueType;

    private String studentNote;
    private String ownerNote;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "urgency", nullable = true)
    private MaintenanceUrgency maintenanceUrgency;

    //  NEW: Assigned Technician Link
    @ManyToOne
    @JoinColumn(name = "assigned_technician_id")
    private User assignedTechnician;

    @Column(nullable = false)
    private boolean rejectedByTechnician = false;

    @Column(length = 500)
    private String technicianRejectionReason;

    @Column(precision = 12, scale = 2)
    private BigDecimal technicianFee;


    @Column(columnDefinition = "integer default 0")
    private int ownerRating = 0;// 1-5 stars

    @Column(length = 500)
    private String ownerComment; //
}
