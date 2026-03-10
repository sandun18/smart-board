
package com.sbms.sbms_monolith.controller;

import com.sbms.sbms_monolith.dto.dashboard.StudentBoardingDashboardDTO;
import com.sbms.sbms_monolith.dto.registration.*;
import com.sbms.sbms_monolith.model.Registration;
import com.sbms.sbms_monolith.model.User;
import com.sbms.sbms_monolith.model.enums.RegistrationStatus;
import com.sbms.sbms_monolith.repository.RegistrationRepository;
import com.sbms.sbms_monolith.repository.UserRepository;
import com.sbms.sbms_monolith.service.PaymentReceiptPdfService;
import com.sbms.sbms_monolith.service.RegistrationService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/registrations")
public class RegistrationController {

    @Autowired
    private RegistrationService registrationService;
    
    @Autowired
    private UserRepository userRepository;

    // ================= STUDENT =================

    @PostMapping("/student/{studentId}")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<RegistrationResponseDTO> register(
            @PathVariable Long studentId,
            @RequestBody RegistrationRequestDTO dto
    ) {
        RegistrationResponseDTO response = registrationService.register(studentId, dto);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/student/{studentId}")
    @PreAuthorize("hasRole('STUDENT')")
    public List<RegistrationResponseDTO> studentRegistrations(
            @PathVariable Long studentId
    ) {
        return registrationService.getStudentRegistrations(studentId);
    }

    @PutMapping("/student/{studentId}/{regId}/cancel")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<RegistrationResponseDTO> cancel(
            @PathVariable Long studentId,
            @PathVariable Long regId
    ) {
        RegistrationResponseDTO response = registrationService.cancel(studentId, regId);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/student/{studentId}/leave/{regId}")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<String> requestLeave(@PathVariable Long studentId, @PathVariable Long regId) {
        registrationService.requestLeave(studentId, regId);
        return ResponseEntity.ok("Leave request sent.");
    }

    @PostMapping("/owner/{ownerId}/approve-leave/{regId}")
    @PreAuthorize("hasRole('OWNER')")
    public ResponseEntity<String> approveLeave(@PathVariable Long ownerId, @PathVariable Long regId) {
        registrationService.approveLeave(ownerId, regId);
        return ResponseEntity.ok("Leave approved.");
    }

    @GetMapping("/{regId}/dashboard")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<StudentBoardingDashboardDTO> dashboard(
            @PathVariable Long regId,
            Authentication authentication
    ) {
        String email = authentication.getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        StudentBoardingDashboardDTO dto = registrationService.getDashboard(regId, user.getId());
        return ResponseEntity.ok(dto);
    }

    // ================= OWNER =================

    @GetMapping("/owner/{ownerId}")
    @PreAuthorize("hasRole('OWNER')")
    public ResponseEntity<List<RegistrationResponseDTO>> ownerRegistrations(
            @PathVariable Long ownerId,
            @RequestParam(required = false) RegistrationStatus status
    ) {
        List<RegistrationResponseDTO> list = registrationService.getOwnerRegistrations(ownerId, status);
        return ResponseEntity.ok(list);
    }

    @PutMapping("/owner/{ownerId}/{regId}")
    @PreAuthorize("hasRole('OWNER')")
    public ResponseEntity<RegistrationResponseDTO> decide(
            @PathVariable Long ownerId,
            @PathVariable Long regId,
            @RequestBody RegistrationDecisionDTO dto
    ) {
        RegistrationResponseDTO response = registrationService.decide(ownerId, regId, dto);
        return ResponseEntity.ok(response);
    }
    
    


   
    
    
   
}