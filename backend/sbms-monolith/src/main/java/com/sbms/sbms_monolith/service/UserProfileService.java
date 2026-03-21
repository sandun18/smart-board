package com.sbms.sbms_monolith.service;

import com.sbms.sbms_monolith.dto.boarding.BoardingSummaryDTO;
import com.sbms.sbms_monolith.dto.report.ReportResponseDTO;
import com.sbms.sbms_monolith.dto.user.UserProfileViewDTO;
import com.sbms.sbms_monolith.mapper.ReportMapper;
import com.sbms.sbms_monolith.mapper.UserProfileMapper;
import com.sbms.sbms_monolith.model.Boarding;
import com.sbms.sbms_monolith.model.Report;
import com.sbms.sbms_monolith.model.User;
import com.sbms.sbms_monolith.model.enums.UserRole;
import com.sbms.sbms_monolith.repository.BoardingRepository;
import com.sbms.sbms_monolith.repository.ReportRepository;
import com.sbms.sbms_monolith.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class UserProfileService {

    private final UserRepository userRepo;
    private final ReportRepository reportRepo;
    private final BoardingRepository boardingRepo;
    private final TechnicianWorkflowService technicianWorkflowService;

    public UserProfileViewDTO getPublicProfile(Long userId) {

        // 1. Fetch User
        User user = userRepo.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // 2. If technician, refresh their stats before building DTO
        if (user.getRole() == UserRole.TECHNICIAN) {
            technicianWorkflowService.updateTechnicianStats(user);
            // Re-fetch after update so DTO gets fresh values
            user = userRepo.findById(userId).orElseThrow();
        }

        // 3. Fetch History
        List<Report> reports = reportRepo.findByReportedUser_Id(userId);
        List<ReportResponseDTO> reportDTO = reports.stream()
                .map(ReportMapper::toDTO).toList();

        // 4. Fetch Boardings (if Owner)
        List<BoardingSummaryDTO> listingDTOs = new ArrayList<>();
        if (user.getRole() == UserRole.OWNER) {
            List<Boarding> boardings = boardingRepo.findByOwner_Id(userId);
            listingDTOs = boardings.stream()
                    .map(UserProfileMapper::toBoardingSummary)
                    .toList();
        }

        // 5. Build Profile DTO
        UserProfileViewDTO dto = UserProfileMapper.toProfileDTO(user, listingDTOs);

        // 6. Attach History & Status
        dto.setIncidentHistory(reportDTO);
        dto.setTotalReportsAgainst(reportDTO.size());

        boolean suspended = reports.stream().anyMatch(r ->
                r.getActionTaken() != null && r.getActionTaken().toUpperCase().contains("SUSPENDED")
        );
        dto.setSuspended(suspended);

        return dto;
    }

}
