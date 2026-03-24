package com.sbms.sbms_monolith.dto.admin;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class SystemBackupDTO {
    private Long id;
    private String name;
    private String type;
    private Long sizeBytes;
    private String size;
    private LocalDateTime createdAt;
}
