package com.sbms.sbms_monolith.dto.user;

import com.sbms.sbms_monolith.dto.boarding.BoardingSummaryDTO;
import com.sbms.sbms_monolith.dto.report.ReportResponseDTO;
import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

@Data
public class UserProfileViewDTO {

    // Common Details
    private Long id;
    private String fullName;
    private String email;
    private String phone;
    private String avatar;
    private String role;
    private String gender;
    private String joinedDate;

    // --- Student Specific
    private String university;

    // ---- Owner Specific
    private String address;
    private boolean verifiedOwner;
    private String businessName;

    // --- Technician Specific ✅
    private List<String> skills;
    private BigDecimal averageRating;
    private Integer totalJobsCompleted;

    // --- History
    private List<ReportResponseDTO> incidentHistory;
    private int totalReportsAgainst;
    private boolean isSuspended;

    // --- Active Listing for Owners
    private List<BoardingSummaryDTO> activeListings;
}
