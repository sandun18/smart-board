package com.sbms.sbms_monolith.controller;

import java.util.List;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.sbms.sbms_monolith.dto.admin.AdminBoardingResponseDTO;
import com.sbms.sbms_monolith.dto.admin.AdminDashboardDTO;
import com.sbms.sbms_monolith.dto.admin.AdminReportResponseDTO;
import com.sbms.sbms_monolith.dto.admin.AdminUserResponseDTO;
import com.sbms.sbms_monolith.dto.admin.AnalyticsResponseDTO;
import com.sbms.sbms_monolith.dto.admin.ReportDecisionDTO;
import com.sbms.sbms_monolith.dto.admin.UserVerificationDTO;

import com.sbms.sbms_monolith.model.enums.ReportStatus;
import com.sbms.sbms_monolith.service.AdminService;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')") 
public class AdminController {

    private final AdminService adminService;

    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    // Dashboard summary used by admin home widgets.
    @GetMapping("/dashboard")
    public AdminDashboardDTO dashboard() {
        return adminService.getDashboardStats();
    }

    // User management endpoints.
    @GetMapping("/users")
    public List<AdminUserResponseDTO> getAllUsers() {
        return adminService.getAllUsers();
    }

    @PutMapping("/users/{userId}/verify-owner")
    public void verifyOwner(
            @PathVariable Long userId,
            @RequestBody UserVerificationDTO dto
    ) {
        adminService.verifyOwner(userId, dto);
    }

    @PutMapping("/users/{userId}/promote-to-admin")
    public AdminUserResponseDTO promoteToAdmin(@PathVariable Long userId) {
        return adminService.promoteUserToAdmin(userId);
    }

    @DeleteMapping("/users/{userId}")
    public void deleteUser(@PathVariable Long userId) {
        adminService.deleteUser(userId);
    }

    // Boarding moderation endpoints.
    @GetMapping("/boardings")
    public List<AdminBoardingResponseDTO> getAllBoardings() {
        return adminService.getAllBoardings();
    }

    @PutMapping("/boardings/{boardingId}/approve")
    public void approveBoarding(@PathVariable Long boardingId) {
        adminService.approveBoarding(boardingId);
    }

    @PutMapping("/boardings/{boardingId}/reject")
    public void rejectBoarding(
            @PathVariable Long boardingId,
            @RequestParam(required = false) String reason
    ) {
        adminService.rejectBoarding(boardingId, reason);
    }

    // Report workflow endpoints.
    @GetMapping("/reports")
    public List<AdminReportResponseDTO> getReports(
            @RequestParam(required = false) ReportStatus status
    ) {
        return adminService.getReports(status);
    }

    @GetMapping("/analytics")
    public AnalyticsResponseDTO getAnalytics(@RequestParam(required = false) String range) {
        return adminService.getAnalytics(range);
    }

    @PutMapping("/reports/{reportId}/resolve")
    public void resolveReport(
            @PathVariable Long reportId,
            @RequestBody ReportDecisionDTO dto
    ) {
        adminService.resolveReport(reportId, dto);
    }

    @PutMapping("/reports/{reportId}/dismiss")
    public void dismissReport(
            @PathVariable Long reportId,
            @RequestBody ReportDecisionDTO dto
    ) {
        adminService.dismissReport(reportId, dto);
    }
}
