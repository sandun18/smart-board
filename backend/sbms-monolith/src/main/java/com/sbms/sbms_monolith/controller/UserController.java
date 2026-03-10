package com.sbms.sbms_monolith.controller;

import com.sbms.sbms_monolith.dto.user.*;
import com.sbms.sbms_monolith.model.User;
import com.sbms.sbms_monolith.repository.UserRepository;
import com.sbms.sbms_monolith.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication; // Import Added
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private UserRepository userRepository;

    // --- STATIC ROUTES (MUST BE TOP) ---

    @PostMapping("/register")
    public UserResponseDTO register(@RequestBody UserRegisterDTO dto) {
        return userService.register(dto);
    }

    @PostMapping("/login")
    public UserResponseDTO login(@RequestBody UserLoginDTO dto) {
        return userService.login(dto);
    }

    @GetMapping("/all")
    public List<AdminUserDTO> getAllUsers() {
        return userService.getAllUsers();
    }

    @GetMapping("/owners")
    public List<AdminUserDTO> getAllOwners() {
        return userService.getAllOwners();
    }

    @GetMapping("/owner/{ownerId}")
    public OwnerProfileDTO getOwnerProfile(@PathVariable Long ownerId) {
        return userService.getOwnerProfile(ownerId);
    }

    //  FIX: Explicitly handle Profile Update (Static Route)
    @PutMapping("/profile")
    public UserResponseDTO updateMyProfile(@RequestBody UserRegisterDTO dto, Authentication auth) {
        User currentUser = userRepository.findByEmail(auth.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Pass the ID of the logged-in user
        return userService.updateUser(currentUser.getId(), dto);
    }

    // --- DYNAMIC ROUTES (MUST BE BOTTOM) ---

    @GetMapping("/{id}")
    public UserResponseDTO getUser(@PathVariable Long id) {
        return userService.getUser(id);
    }

    // This catches everything else, so it must be last
    @PutMapping("/{id}")
    public UserResponseDTO updateUser(@PathVariable Long id, @RequestBody UserRegisterDTO dto) {
        return userService.updateUser(id, dto);
    }
}