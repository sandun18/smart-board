package com.sbms.sbms_monolith.controller;

import com.sbms.sbms_monolith.dto.auth.ChangePasswordDTO;
import com.sbms.sbms_monolith.dto.profile.CommonProfileUpdateDTO;
import com.sbms.sbms_monolith.dto.profile.ProfileResponseDTO;
import com.sbms.sbms_monolith.model.User;
import com.sbms.sbms_monolith.model.enums.UserRole;
import com.sbms.sbms_monolith.repository.UserRepository;
import com.sbms.sbms_monolith.service.ProfileService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin/profile")
@PreAuthorize("hasRole('ADMIN')")
public class AdminProfileController {

    private final ProfileService profileService;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public AdminProfileController(
            ProfileService profileService,
            UserRepository userRepository,
            PasswordEncoder passwordEncoder
    ) {
        this.profileService = profileService;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @GetMapping
    public ProfileResponseDTO get(Authentication auth) {
        return profileService.getProfile(auth.getName());
    }

    @PutMapping
    public ProfileResponseDTO update(
            @RequestBody CommonProfileUpdateDTO dto,
            Authentication auth
    ) {
        return profileService.updateAdminProfile(auth.getName(), dto);
    }

    @PostMapping("/change-password")
    public String changePassword(
            @RequestBody ChangePasswordDTO dto,
            Authentication auth
    ) {
        User user = findAdminByEmail(auth.getName());

        if (!passwordEncoder.matches(dto.getCurrentPassword(), user.getPassword())) {
            throw new RuntimeException("Current password is incorrect");
        }

        user.setPassword(passwordEncoder.encode(dto.getNewPassword()));
        userRepository.save(user);

        return "Password changed successfully";
    }

    private User findAdminByEmail(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (user.getRole() != UserRole.ADMIN) {
            throw new RuntimeException("Unauthorized");
        }

        return user;
    }
}
