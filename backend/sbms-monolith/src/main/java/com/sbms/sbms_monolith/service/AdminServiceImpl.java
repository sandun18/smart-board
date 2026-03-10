package com.sbms.sbms_monolith.service;

import com.sbms.sbms_monolith.dto.admin.*;
import com.sbms.sbms_monolith.model.*;
import com.sbms.sbms_monolith.repository.*;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;

import com.sbms.sbms_monolith.model.enums.*;
import java.time.LocalDateTime;




@Service
@Transactional
public class AdminServiceImpl implements AdminService {

    private final UserRepository userRepository;
    private final BoardingRepository boardingRepository;
    private final ReportRepository reportRepository;

    public AdminServiceImpl(
            UserRepository userRepository,
            BoardingRepository boardingRepository,
            ReportRepository reportRepository
    ) {
        this.userRepository = userRepository;
        this.boardingRepository = boardingRepository;
        this.reportRepository = reportRepository;
    }

    // =========================================================
    // DASHBOARD
    // =========================================================
    @Override
    public AdminDashboardDTO getDashboardStats() {

        long totalUsers = userRepository.count();
        long students = userRepository.countByRole(UserRole.STUDENT);
        long owners = userRepository.countByRole(UserRole.OWNER);

        long totalBoardings = boardingRepository.count();
        long pendingReports = reportRepository.countByStatus(ReportStatus.PENDING);

        return new AdminDashboardDTO(
                totalUsers,
                students,
                owners,
                totalBoardings,
                pendingReports
        );
    }

    // =========================================================
    // USERS
    // =========================================================
    @Override
    public List<AdminUserResponseDTO> getAllUsers() {

        return userRepository.findAll()
                .stream()
                .map(AdminUserResponseDTO::fromEntity)
                .toList();
    }

    @Override
    public void verifyOwner(Long userId, UserVerificationDTO dto) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (user.getRole() != UserRole.OWNER) {
            throw new RuntimeException("User is not an owner");
        }

        user.setVerifiedOwner(dto.isApproved());
        userRepository.save(user);
    }

    // =========================================================
    // BOARDINGS
    // =========================================================
    @Override
    public List<AdminBoardingResponseDTO> getAllBoardings() {

        return boardingRepository.findAll()
                .stream()
                .map(AdminBoardingResponseDTO::fromEntity)
                .toList();
    }

    @Override
    public void approveBoarding(Long boardingId) {

        Boarding boarding = boardingRepository.findById(boardingId)
                .orElseThrow(() -> new RuntimeException("Boarding not found"));

        boarding.setStatus(Status.APPROVED);
        boardingRepository.save(boarding);
    }

    @Override
    public void rejectBoarding(Long boardingId, String reason) {

        Boarding boarding = boardingRepository.findById(boardingId)
                .orElseThrow(() -> new RuntimeException("Boarding not found"));

        boarding.setStatus(Status.REJECTED);

        // Optional: log admin reason later
        boardingRepository.save(boarding);
    }

    // =========================================================
    // REPORTS
    // =========================================================
    @Override
    public List<AdminReportResponseDTO> getReports(ReportStatus status) {

        List<Report> reports =
                (status == null)
                        ? reportRepository.findAll()
                        : reportRepository.findByStatus(status);

        return reports.stream()
                .map(AdminReportResponseDTO::fromEntity)
                .toList();
    }

    @Override
    public void resolveReport(Long reportId, ReportDecisionDTO dto) {

        Report report = reportRepository.findById(reportId)
                .orElseThrow(() -> new RuntimeException("Report not found"));

        report.setStatus(ReportStatus.RESOLVED);
        report.setResolutionDetails(dto.getResolutionDetails());
        report.setActionTaken(dto.getActionTaken());
        report.setActionDuration(dto.getActionDuration());
        report.setResolvedAt(LocalDateTime.now());

        reportRepository.save(report);
    }

    @Override
    public void dismissReport(Long reportId, ReportDecisionDTO dto) {

        Report report = reportRepository.findById(reportId)
                .orElseThrow(() -> new RuntimeException("Report not found"));

        report.setStatus(ReportStatus.DISMISSED);
        report.setDismissalReason(dto.getDismissalReason());
        report.setResolvedAt(LocalDateTime.now());

        reportRepository.save(report);
    }
}

