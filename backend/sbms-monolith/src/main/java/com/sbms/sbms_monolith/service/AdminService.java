package com.sbms.sbms_monolith.service;


import com.sbms.sbms_monolith.dto.admin.*;
import com.sbms.sbms_monolith.model.enums.ReportStatus;

import java.util.List;

public interface AdminService {

    // Dashboard
    AdminDashboardDTO getDashboardStats();

    // Users
    List<AdminUserResponseDTO> getAllUsers();
    void verifyOwner(Long userId, UserVerificationDTO dto);
    AdminUserResponseDTO promoteUserToAdmin(Long userId);

    // Boardings
    List<AdminBoardingResponseDTO> getAllBoardings();
    void approveBoarding(Long boardingId);
    void rejectBoarding(Long boardingId, String reason);

    // Reports
    List<AdminReportResponseDTO> getReports(ReportStatus status);
    void resolveReport(Long reportId, ReportDecisionDTO dto);
    void dismissReport(Long reportId, ReportDecisionDTO dto);
}
