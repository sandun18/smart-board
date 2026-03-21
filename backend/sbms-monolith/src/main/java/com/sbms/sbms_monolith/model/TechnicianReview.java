package com.sbms.sbms_monolith.model;

import com.sbms.sbms_monolith.common.BaseEntity;
import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "technician_reviews")
public class TechnicianReview extends BaseEntity {

    @ManyToOne
    @JoinColumn(name = "owner_id", nullable = false)
    private User owner;

    @ManyToOne
    @JoinColumn(name = "technician_id", nullable = false)
    private User technician;

    @OneToOne
    @JoinColumn(name = "maintenance_id", nullable = false)
    private Maintenance maintenance;

    private int rating; // 1-5
    private String comment;
}
