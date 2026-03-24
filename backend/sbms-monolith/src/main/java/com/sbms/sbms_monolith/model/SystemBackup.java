package com.sbms.sbms_monolith.model;

import com.sbms.sbms_monolith.common.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Lob;
import jakarta.persistence.Table;
import lombok.Data;

@Data
@Entity
@Table(name = "system_backups")
public class SystemBackup extends BaseEntity {

    @Column(nullable = false, length = 200)
    private String name;

    @Column(nullable = false, length = 40)
    private String type;

    @Column(nullable = false)
    private Long sizeBytes;

    @Column(name = "created_by", length = 150)
    private String createdBy;

    @Lob
    @Column(name = "file_content", nullable = false)
    private byte[] fileContent;
}
