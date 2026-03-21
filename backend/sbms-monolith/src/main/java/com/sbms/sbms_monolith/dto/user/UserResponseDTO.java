package com.sbms.sbms_monolith.dto.user;

import com.sbms.sbms_monolith.model.enums.Gender;
import com.sbms.sbms_monolith.model.enums.UserRole;
import lombok.Data;

import io.swagger.v3.oas.annotations.media.Schema;

@Data
@Schema(description = "User response object returned after authentication")
public class UserResponseDTO {

    @Schema(example = "12")
    private Long id;

    private java.time.LocalDateTime createdAt;

    @Schema(example = "Kamal Perera")
    private String fullName;

    @Schema(example = "kamal@gmail.com")
    private String email;

    @Schema(example = "0771234567")
    private String phone;

    @Schema(
        description = "Profile image URL stored in S3",
        example = "https://s3.amazonaws.com/sbms/profile.jpg"
    )
    private String profileImageUrl;

    @Schema(example = "Colombo, Sri Lanka")
    private String address;

    @Schema(example = "MALE")
    private Gender gender;

    @Schema(example = "STUDENT")
    private UserRole role;

    // -------- OWNER ONLY --------

    @Schema(
        description = "True if owner account is verified by admin",
        example = "true"
    )
    private boolean verifiedOwner;

    @Schema(
        description = "Active subscription ID (owners only)",
        example = "2"
    )
    private Integer subscription_id;

    @Schema(
        description = "Owner bank account number",
        example = "1234567890"
    )
    private String accNo;

    // -------- STUDENT ONLY --------

    private String dob;
    private String emergencyContact;
    private String studentIdNumber;

    @Schema(
        description = "Student university name",
        example = "University of Moratuwa"
    )
    private String studentUniversity;


    // -------- TECHNICIAN ONLY --------

    @Schema(description = "Average rating from 0.0 to 5.0", example = "4.8")
    private Double technicianAverageRating;

    @Schema(description = "Total number of completed jobs", example = "15")
    private Integer technicianTotalJobs;
}

