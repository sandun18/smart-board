package com.sbms.sbms_monolith.controller;

import java.security.Principal;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.sbms.sbms_monolith.service.EmergencyService;
import com.sbms.sbms_monolith.dto.emergency.EmergencyLocationDTO;
// --- STEP 1: CHANGE THIS IMPORT ---
// Remove: import com.sun.security.auth.UserPrincipal;
// Import YOUR existing User class (usually in .entity, .model, or .domain package)
// Example below (adjust the package name if your User class is elsewhere):
import com.sbms.sbms_monolith.model.User; 
// ----------------------------------
import com.sbms.sbms_monolith.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/emergency")
@RequiredArgsConstructor
public class EmergencyController {

    private final EmergencyService emergencyService;
    private final UserRepository userRepository;

    @PostMapping("/trigger")
    public ResponseEntity<Void> triggerEmergency(
            Principal principal,
            @RequestParam Long boardingId,
            @RequestBody(required = false) EmergencyLocationDTO location
    ) {
        if (principal == null) {
            throw new IllegalStateException("Unauthenticated request");
        }

        // JWT username = email (same as chat)
        String email = principal.getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new IllegalStateException("User not found: " + email)
                );

        emergencyService.trigger(
                user.getId(),
                boardingId,
                location != null ? location.getLatitude() : null,
                location != null ? location.getLongitude() : null
        );

        return ResponseEntity.ok().build();
    }
}
