package com.sbms.sbms_monolith.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.sbms.sbms_monolith.dto.admin.AdminBoardingResponseDTO;
import com.sbms.sbms_monolith.dto.admin.AdminDashboardDTO;
import com.sbms.sbms_monolith.dto.admin.AdminReportResponseDTO;
import com.sbms.sbms_monolith.dto.admin.AdminUserResponseDTO;
import com.sbms.sbms_monolith.dto.admin.ReportDecisionDTO;
import com.sbms.sbms_monolith.dto.admin.UserVerificationDTO;

import org.springframework.web.bind.annotation.*;

import com.sbms.sbms_monolith.model.enums.ReportStatus;
import com.sbms.sbms_monolith.service.AdminService;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')") 
public class AdminController {

    @Autowired
    private AdminService adminService;

    @GetMapping("/dashboard")
    public AdminDashboardDTO dashboard() {
        return adminService.getDashboardStats();
    }

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

    @GetMapping("/reports")
    public List<AdminReportResponseDTO> getReports(
            @RequestParam(required = false) ReportStatus status
    ) {
        return adminService.getReports(status);
    }

    @PutMapping("/reports/{reportId}/resolve")
    public void resolveReport(
            @PathVariable Long reportId,
            @RequestBody ReportDecisionDTO dto
    ) {
        adminService.resolveReport(reportId, dto);
    }

    // 🔹 Dismiss report
    @PutMapping("/reports/{reportId}/dismiss")
    public void dismissReport(
            @PathVariable Long reportId,
            @RequestBody ReportDecisionDTO dto
    ) {
        adminService.dismissReport(reportId, dto);
    }
}
