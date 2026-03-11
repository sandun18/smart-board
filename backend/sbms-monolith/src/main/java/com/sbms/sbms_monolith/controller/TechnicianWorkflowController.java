package com.sbms.sbms_monolith.controller;

import com.sbms.sbms_monolith.dto.maintenance.MaintenanceResponseDTO;
import com.sbms.sbms_monolith.dto.technician.TechnicianCardDTO;
import com.sbms.sbms_monolith.dto.technician.TechnicianProfileResponseDTO;
import com.sbms.sbms_monolith.dto.technician.TechnicianReviewDTO;
import com.sbms.sbms_monolith.model.Maintenance;
import com.sbms.sbms_monolith.model.User;
import com.sbms.sbms_monolith.model.enums.MaintenanceIssueType;
import com.sbms.sbms_monolith.repository.UserRepository;
import com.sbms.sbms_monolith.service.TechnicianWorkflowService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/technician-workflow")
public class TechnicianWorkflowController {

    @Autowired
    private TechnicianWorkflowService workflowService;

    @Autowired
    private UserRepository userRepository;

    // STATIC ROUTES (Top Priority)

    @GetMapping("/profile")
    @PreAuthorize("hasAnyAuthority('ROLE_TECHNICIAN', 'TECHNICIAN')")
    public TechnicianProfileResponseDTO getMyProfile(Authentication auth) {
        User tech = userRepository.findByEmail(auth.getName()).orElseThrow();

        workflowService.updateTechnicianStats(tech);


        User updatedTech = userRepository.findById(tech.getId()).orElseThrow();

        TechnicianProfileResponseDTO dto = new TechnicianProfileResponseDTO();
        dto.setId(tech.getId());
        dto.setFullName(tech.getFullName());
        dto.setEmail(tech.getEmail());
        dto.setPhone(tech.getPhone());
        dto.setProfileImageUrl(tech.getProfileImageUrl());
        dto.setNicNumber(tech.getNicNumber());
        dto.setDob(tech.getDob());
        dto.setGender(tech.getGender());
        dto.setAddress(tech.getAddress());
        dto.setCity(tech.getCity());
        dto.setProvince(tech.getProvince());
        dto.setBasePrice(tech.getBasePrice());
        dto.setSkills(tech.getSkills());

        dto.setAverageRating(updatedTech.getTechnicianAverageRating());
        dto.setTotalJobsCompleted(updatedTech.getTechnicianTotalJobs());
        return dto;
    }

    @GetMapping("/my-jobs")
    @PreAuthorize("hasAnyAuthority('ROLE_TECHNICIAN', 'TECHNICIAN')")
    public List<MaintenanceResponseDTO> getMyJobs(Authentication auth) {
        User tech = userRepository.findByEmail(auth.getName()).orElseThrow();
        return workflowService.getAssignedJobs(tech.getId());
    }

    @GetMapping("/search")
    @PreAuthorize("hasRole('OWNER')")
    public List<TechnicianCardDTO> findTechnicians(@RequestParam MaintenanceIssueType skill, @RequestParam(required = false) String city) {
        return workflowService.findTechniciansForIssue(skill, city).stream()
                .map(user -> {
                    TechnicianCardDTO dto = new TechnicianCardDTO();
                    dto.setId(user.getId());
                    dto.setFullName(user.getFullName());
                    dto.setProfileImageUrl(user.getProfileImageUrl());
                    dto.setCity(user.getCity());
                    dto.setBasePrice(user.getBasePrice());
                    dto.setSkills(user.getSkills());

                    if (user.getTechnicianAverageRating() != null) {
                        dto.setAverageRating(user.getTechnicianAverageRating().doubleValue());
                    } else {
                        dto.setAverageRating(0.0);
                    }

                    dto.setTotalJobs(user.getTechnicianTotalJobs());
                    return dto;
                })
                .collect(Collectors.toList());
    }

    @GetMapping("/reviews")
    @PreAuthorize("hasAnyAuthority('ROLE_TECHNICIAN', 'TECHNICIAN')")
    public List<TechnicianReviewDTO> getMyReviews(Authentication auth) {
        User tech = userRepository.findByEmail(auth.getName()).orElseThrow();

        return workflowService.getReviewsForTechnician(tech);
    }

    // DYNAMIC ROUTES (Lower Priority)

    @PutMapping("/{maintenanceId}/assign/{technicianId}")
    @PreAuthorize("hasRole('OWNER')")
    public String assignTechnician(@PathVariable Long maintenanceId, @PathVariable Long technicianId, Authentication auth) {
        User owner = userRepository.findByEmail(auth.getName()).orElseThrow();
        workflowService.assignTechnician(maintenanceId, technicianId, owner.getId());
        return "Assigned successfully.";
    }

    @PostMapping("/{maintenanceId}/review")
    @PreAuthorize("hasRole('OWNER')")
    public ResponseEntity<MaintenanceResponseDTO> reviewTechnician(@PathVariable Long maintenanceId, @RequestParam int rating, @RequestParam String comment) {
        return ResponseEntity.ok(workflowService.reviewTechnician(maintenanceId, rating, comment));
    }

    @PutMapping("/{maintenanceId}/decision")
    @PreAuthorize("hasAnyAuthority('ROLE_TECHNICIAN', 'TECHNICIAN')")
    public String technicianDecision(@PathVariable Long maintenanceId, @RequestParam boolean accept, @RequestParam(required = false) String reason, Authentication auth) {
        User tech = userRepository.findByEmail(auth.getName()).orElseThrow();
        if (!accept && (reason == null || reason.trim().isEmpty())) throw new RuntimeException("Rejection reason is required.");
        workflowService.technicianDecision(maintenanceId, tech.getId(), accept, reason);
        return accept ? "Accepted" : "Rejected";
    }

    @PutMapping("/{maintenanceId}/complete")
    @PreAuthorize("hasAnyAuthority('ROLE_TECHNICIAN', 'TECHNICIAN')")
    public String markWorkDone(@PathVariable Long maintenanceId, @RequestParam BigDecimal amount, Authentication auth) {
        User tech = userRepository.findByEmail(auth.getName()).orElseThrow();
        workflowService.markWorkDone(maintenanceId, tech.getId(), amount);
        return "Marked as done. Final bill set to: " + amount;
    }
}