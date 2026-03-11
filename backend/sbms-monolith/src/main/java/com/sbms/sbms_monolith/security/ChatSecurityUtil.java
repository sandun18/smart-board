package com.sbms.sbms_monolith.security;

import com.sbms.sbms_monolith.model.User;
import com.sbms.sbms_monolith.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class ChatSecurityUtil {

    private final UserRepository userRepository;

    public User getCurrentUser() {

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        if (auth == null || !auth.isAuthenticated() || "anonymousUser".equals(auth.getPrincipal())) {
            throw new IllegalStateException("Unauthenticated access");
        }

        Object principal = auth.getPrincipal();

        // CASE 1: The principal is already your custom User entity
        if (principal instanceof User) {
            return (User) principal;
        }

        // CASE 2: The principal is a Spring Security UserDetails object
        if (principal instanceof UserDetails userDetails) {
            return userRepository.findByEmail(userDetails.getUsername())
                    .orElseThrow(() -> new IllegalStateException("User not found: " + userDetails.getUsername()));
        }

        // CASE 3: The principal is just the email/username (String)
        if (principal instanceof String email) {
            return userRepository.findByEmail(email)
                    .orElseThrow(() -> new IllegalStateException("User not found: " + email));
        }

        // Debugging info if it still fails
        throw new IllegalStateException("Invalid principal type: " + principal.getClass().getName());
    }

    public boolean isStudent(User user) {
        return user.getRole().name().equals("STUDENT");
    }

    public boolean isOwner(User user) {
        return user.getRole().name().equals("OWNER");
    }
}