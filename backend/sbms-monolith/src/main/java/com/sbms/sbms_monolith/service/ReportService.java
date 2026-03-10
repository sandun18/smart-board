package com.sbms.sbms_monolith.service;

import com.sbms.sbms_monolith.dto.report.ReportCreateDTO;
import com.sbms.sbms_monolith.dto.report.ReportResponseDTO;
import com.sbms.sbms_monolith.mapper.ReportMapper;
import com.sbms.sbms_monolith.model.Report;
import com.sbms.sbms_monolith.model.User;
import com.sbms.sbms_monolith.model.enums.ReportStatus;
import com.sbms.sbms_monolith.model.enums.UserRole;
import com.sbms.sbms_monolith.repository.MaintenanceRepository;
import com.sbms.sbms_monolith.repository.ReportRepository;
import com.sbms.sbms_monolith.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class ReportService {

    @Autowired
    private ReportRepository reportRepo;

    @Autowired
    private UserRepository userRepo;

    @Autowired
    private S3Service s3Service;

    @Autowired
    private MaintenanceRepository maintenanceRepo;

    // 1. Create Report (Unified)
    public ReportResponseDTO create(ReportCreateDTO dto, List<MultipartFile> files) throws IOException {
        User sender = userRepo.findById(dto.getSenderId())
                .orElseThrow(() -> new RuntimeException("Sender not found"));

        User reportedTarget = null;
        if (dto.getReportedUserId() != null) {
            reportedTarget = userRepo.findById(dto.getReportedUserId())
                    .orElseThrow(() -> new RuntimeException("Reported user not found"));
        }

        // -----------------------------------------------------------------
        // VALIDATE TECHNICIAN <-> OWNER CONNECTION
        // -----------------------------------------------------------------
        if (reportedTarget != null) {
            boolean isTechReportingOwner = (sender.getRole() == UserRole.TECHNICIAN && reportedTarget.getRole() == UserRole.OWNER);
            boolean isOwnerReportingTech = (sender.getRole() == UserRole.OWNER && reportedTarget.getRole() == UserRole.TECHNICIAN);

            if (isTechReportingOwner || isOwnerReportingTech) {
                // Check database for any job linking them
                boolean hasConnection = maintenanceRepo.existsByConnection(sender.getId(), reportedTarget.getId());

                if (!hasConnection) {
                    throw new RuntimeException("Access Denied: You cannot report this user because you have no history of working together.");
                }
            }
        }

        // Pass both users to Mapper
        Report report = ReportMapper.toEntity(dto, sender, reportedTarget);

        // Upload
        List<String> fileUrls = new ArrayList<>();
        if (files != null) {
            for (MultipartFile file : files) {
                if(!file.isEmpty()) {
                    fileUrls.add(s3Service.uploadFile(file, "reports"));
                }
            }
        }
        report.setEvidence(fileUrls);

        return ReportMapper.toDTO(reportRepo.save(report));
    }

    // 2. Get Sent Reports (Dashboard)
    public List<ReportResponseDTO> getSentReports(Long userId) {
        return reportRepo.findBySender_Id(userId).stream()
                .map(ReportMapper::toDTO)
                .toList();
    }

    // 3. Get History (Profile)
    public List<ReportResponseDTO> getUserHistory(Long userId) {
        // Only show valid resolved reports for history
        return reportRepo.findByReportedUser_Id(userId).stream()
                .filter(r -> r.getStatus() == ReportStatus.RESOLVED)
                .map(ReportMapper::toDTO)
                .toList();
    }

    // 4. Admin: Resolve
    public ReportResponseDTO resolveReport(Long id, String solution, String action, String duration) {
        Report report = reportRepo.findById(id).orElseThrow(() -> new RuntimeException("Not found"));

        report.setStatus(ReportStatus.RESOLVED);
        report.setResolutionDetails(solution);
        report.setActionTaken(action);
        report.setActionDuration(duration);
        report.setResolvedAt(LocalDateTime.now());

        return ReportMapper.toDTO(reportRepo.save(report));
    }

    // 5. Admin: Get All
    public List<ReportResponseDTO> getAllReports() {
        return reportRepo.findAllByOrderBySubmissionDateDesc().stream()
                .map(ReportMapper::toDTO).toList();
    }

    // 6. Admin: Investigate
    public ReportResponseDTO startInvestigation(Long id) {
        Report report = reportRepo.findById(id).orElseThrow(() -> new RuntimeException("Not found"));
        report.setStatus(ReportStatus.INVESTIGATING);
        return ReportMapper.toDTO(reportRepo.save(report));
    }

    // 7. Admin: Dismiss
    public ReportResponseDTO dismissReport(Long id, String reason) {
        Report report = reportRepo.findById(id).orElseThrow(() -> new RuntimeException("Not found"));
        report.setStatus(ReportStatus.DISMISSED);
        report.setDismissalReason(reason);
        report.setResolvedAt(LocalDateTime.now());
        return ReportMapper.toDTO(reportRepo.save(report));
    }

}
