package com.sbms.sbms_monolith.dto.admin;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class AdminActivityLogDTO {
    private String eventId;
    private String user;
    private String action;
    private String status;
    private String icon;
    private LocalDateTime createdAt;
}
