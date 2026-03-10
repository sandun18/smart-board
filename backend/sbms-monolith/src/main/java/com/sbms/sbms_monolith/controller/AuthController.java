
package com.sbms.sbms_monolith.controller;

import com.sbms.sbms_monolith.dto.auth.*;
import com.sbms.sbms_monolith.dto.user.UserLoginDTO;
import com.sbms.sbms_monolith.dto.user.UserRegisterDTO;
import com.sbms.sbms_monolith.dto.user.UserResponseDTO;
import com.sbms.sbms_monolith.model.RefreshToken;
import com.sbms.sbms_monolith.model.User;
import com.sbms.sbms_monolith.security.JwtService;
import com.sbms.sbms_monolith.service.RefreshTokenService;
import com.sbms.sbms_monolith.service.UserService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;

import io.swagger.v3.oas.annotations.tags.Tag;

import org.springframework.beans.factory.annotation.Autowired;
import java.util.Map;
import org.springframework.security.authentication.*;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;


@Tag(
	    name = "Authentication",
	    description = "Login, registration, OTP verification, password reset and token refresh APIs"
	)
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private UserService userService;

    @Autowired
    private RefreshTokenService refreshTokenService;

    // ---------------------------------------------------------
    // LOGIN
    // ---------------------------------------------------------

    @PostMapping("/login")
    @Operation(
            summary = "User login",
            description = "Authenticate user using email and password and return JWT + refresh token"
        )
        @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Login successful"),
            @ApiResponse(responseCode = "401", description = "Invalid credentials"),
            @ApiResponse(responseCode = "404", description = "User not found")
        })
    public JwtAuthResponse login(@RequestBody UserLoginDTO dto) {

        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        dto.getEmail(),
                        dto.getPassword()
                )
        );

        User user = userService.getUserEntityByEmail(dto.getEmail());

        return generateAuthResponse(user);
    }

    @GetMapping("/admin-check")
    @Operation(
        summary = "Check if admin exists",
        description = "Check whether any admin account exists in the system"
    )
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Check completed")
    })
    public Map<String, Boolean> checkAdminExists() {
        return Map.of("adminExists", userService.hasAdmins());
    }

    @PostMapping("/refresh")
    @Operation(
        summary = "Refresh access token",
        description = "Generate a new JWT using a valid refresh token"
    )
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Token refreshed successfully"),
        @ApiResponse(responseCode = "403", description = "Refresh token expired or invalid")
    })
    public JwtAuthResponse refresh(@RequestBody RefreshTokenRequest request) {

        RefreshToken refreshToken =
                refreshTokenService.findByToken(request.getRefreshToken());

        refreshTokenService.verifyExpiration(refreshToken);

        User user = refreshToken.getUser();

        String jwt = generateJwt(user);

        JwtAuthResponse response = new JwtAuthResponse();
        response.setToken(jwt);
        response.setRefreshToken(refreshToken.getToken());
        response.setUser(userService.getUser(user.getId()));

        return response;
    }

    @PostMapping("/register/request")
    @Operation(
        summary = "Request user registration",
        description = "Initiate registration and send OTP to user's email"
    )
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "OTP sent successfully"),
        @ApiResponse(responseCode = "409", description = "Email already registered")
    })
    public String registerRequest(@RequestBody UserRegisterDTO dto) {
        return userService.registerRequest(dto);
    }

    @PostMapping("/register/verify")
    @Operation(
        summary = "Verify registration OTP",
        description = "Verify OTP and complete user registration. Returns JWT on success"
    )
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Registration completed"),
        @ApiResponse(responseCode = "400", description = "Invalid or expired OTP")
    })
    public JwtAuthResponse verifyOtp(@RequestBody OtpVerifyRequest req) {

        UserResponseDTO userDto =
                userService.verifyRegistration(req.getEmail(), req.getOtp());

        User user = userService.getUserEntityByEmail(req.getEmail());

        return generateAuthResponse(user);
    }


    
    @PostMapping("/forgot-password")
    @Operation(
        summary = "Forgot password",
        description = "Send OTP to user's email for password reset"
    )
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "OTP sent"),
        @ApiResponse(responseCode = "404", description = "User not found")
    })
    public String forgotPassword(@RequestBody ResetPasswordRequest req) {
        return userService.forgotPassword(req.getEmail());
    }

    @PostMapping("/reset-password")
    @Operation(
            summary = "Reset password",
            description = "Reset password using OTP"
        )
        @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Password reset successful"),
            @ApiResponse(responseCode = "400", description = "Invalid OTP or expired")
        })
    public String resetPassword(@RequestBody ResetPasswordRequest req) {
        return userService.resetPassword(
                req.getEmail(),
                req.getOtp(),
                req.getNewPassword()
        );
    }

    
    
    
    
    
    private JwtAuthResponse generateAuthResponse(User user) {

        String jwt = generateJwt(user);
        RefreshToken refreshToken = refreshTokenService.createRefreshToken(user);

        JwtAuthResponse response = new JwtAuthResponse();
        response.setToken(jwt);
        response.setRefreshToken(refreshToken.getToken());
        response.setUser(userService.getUser(user.getId()));

        return response;
    }

    private String generateJwt(User user) {

        UserDetails userDetails =
                org.springframework.security.core.userdetails.User
                        .withUsername(user.getEmail())
                        .password(user.getPassword())
                        .authorities("ROLE_" + user.getRole().name())
                        .build();

       // return jwtService.generateToken(userDetails);
        
        String token = jwtService.generateToken(
                userDetails,
                user.getId(),
                user.getRole().name()
        );

        return token;
    }
}



