package com.sbms.sbms_monolith.dto.admin;

import com.sbms.sbms_monolith.model.Report;
import com.sbms.sbms_monolith.model.enums.ReportSeverity;
import com.sbms.sbms_monolith.model.enums.ReportStatus;
import com.sbms.sbms_monolith.model.enums.ReportType;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class AdminReportResponseDTO {

    private Long id;
    private String title;
    private String description;

    private ReportType type;
    private ReportSeverity severity;
    private ReportStatus status;

    private LocalDateTime submissionDate;
    private LocalDate incidentDate;

    private String boardingName;

    private Long senderId;
    private String senderName;
    private LocalDateTime senderJoinedDate;

    private Long reportedUserId;
    private String reportedUserName;
    private LocalDateTime reportedUserJoinedDate;

    private boolean allowContact;

    private String resolutionDetails;
    private String dismissalReason;
    private String actionTaken;
    private String actionDuration;

    private LocalDateTime resolvedAt;

    private List<String> evidence;

    // Maps a report entity to the admin-facing API response shape.
    public static AdminReportResponseDTO fromEntity(Report r) {

        AdminReportResponseDTO dto = new AdminReportResponseDTO();

        dto.setId(r.getId());
        dto.setTitle(r.getTitle());
        dto.setDescription(r.getDescription());

        dto.setType(r.getType());
        dto.setSeverity(r.getSeverity());
        dto.setStatus(r.getStatus());

        dto.setSubmissionDate(r.getSubmissionDate());
        dto.setIncidentDate(r.getIncidentDate());
        dto.setBoardingName(r.getBoardingName());

        if (r.getSender() != null) {
            dto.setSenderId(r.getSender().getId());
            dto.setSenderName(r.getSender().getFullName());
            dto.setSenderJoinedDate(r.getSender().getCreatedAt());
        }

        if (r.getReportedUser() != null) {
            dto.setReportedUserId(r.getReportedUser().getId());
            dto.setReportedUserName(r.getReportedUser().getFullName());
            dto.setReportedUserJoinedDate(r.getReportedUser().getCreatedAt());
        }

        dto.setAllowContact(r.isAllowContact());
        dto.setResolutionDetails(r.getResolutionDetails());
        dto.setDismissalReason(r.getDismissalReason());
        dto.setActionTaken(r.getActionTaken());
        dto.setActionDuration(r.getActionDuration());
        dto.setResolvedAt(r.getResolvedAt());
        dto.setEvidence(r.getEvidence());

        return dto;
    }
}

