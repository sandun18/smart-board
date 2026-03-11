package com.sbms.sbms_monolith.model;

import com.sbms.sbms_monolith.common.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Data;

@Data
@Entity
@Table(name = "admin_activity_logs")
public class AdminActivityLog extends BaseEntity {

    @Column(nullable = false, length = 40, unique = true)
    private String eventId;

    @Column(nullable = false, length = 150)
    private String actor;

    @Column(name = "action_description", nullable = false, columnDefinition = "TEXT")
    private String actionDescription;

    @Column(nullable = false, length = 20)
    private String status;

    @Column(nullable = false, length = 50)
    private String icon;
}
