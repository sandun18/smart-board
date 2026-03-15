package com.sbms.sbms_monolith.dto.dashboard;

import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import com.sbms.sbms_monolith.model.enums.RegistrationStatus;

@Data
public class StudentBoardingDashboardDTO {

    private Long registrationId;
    private RegistrationStatus status;
    private LocalDateTime registeredAt;

    private Long boardingId;
    private String boardingTitle;
    private String boardingAddress;
    private String boardingImage;
    private String boardingCreatedDate;

    private String ownerName;
    private Long ownerId;
    private String ownerProfileImage;
    private String ownerEmail;
    private String ownerPhone;

    private BigDecimal keyMoney;
    private BigDecimal monthlyPrice;
    private BigDecimal currentMonthDue;
    private int dueInDays;
    private String paymentStatus;
    private LocalDate lastPaymentDate;

    private int openIssues;
    private int resolvedIssues;
    private LocalDate lastIssueDate;

    private Double averageRating;
    private int reviewCount;
    private boolean yourReviewSubmitted;
    private String agreementPdfPath;

    private List<MemberDTO> members;

    @Data
    public static class MemberDTO {
        private Long id;
        private String name;
        private String phone; // Added phone per your request
        private String joinedDate;
        private String avatar;
    }
}
