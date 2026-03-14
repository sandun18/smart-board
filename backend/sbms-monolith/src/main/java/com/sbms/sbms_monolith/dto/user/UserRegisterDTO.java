package com.sbms.sbms_monolith.dto.user;

import com.sbms.sbms_monolith.model.enums.Gender;
import com.sbms.sbms_monolith.model.enums.MaintenanceIssueType;
import com.sbms.sbms_monolith.model.enums.UserRole;
import lombok.Data;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

import java.time.LocalDate;
import java.util.List;

@Data
@Schema(description = "User registration request payload")
public class UserRegisterDTO {

    @Schema(example = "Kamal Perera", requiredMode = Schema.RequiredMode.REQUIRED)
    private String fullName;

    @Schema(example = "kamal@gmail.com", requiredMode = Schema.RequiredMode.REQUIRED)
    private String email;

    @Schema(
        description = "Account password",
        example = "Password@123",
        requiredMode = Schema.RequiredMode.REQUIRED
    )
    private String password;

    @Schema(example = "0771234567")
    private String phone;

    @Schema(example = "Colombo, Sri Lanka")
    private String address;

    @Schema(
        description = "Gender of the user",
        example = "MALE"
    )
    private Gender gender;

    @Schema(
        description = "User role (STUDENT or OWNER)",
        example = "STUDENT",
        requiredMode = Schema.RequiredMode.REQUIRED
    )
    private UserRole role;

    @Schema(example = "https://example.com/image.jpg")
    private String profileImageUrl;

    @Schema(description = "Base64 encoded image string for profile picture update")
    private String profileImageBase64;

    // -------- OWNER FIELDS --------

    @Schema(
        description = "NIC number (required if role = OWNER)",
        example = "200012345678"
    )
    private String nicNumber;

    @Schema(
        description = "Bank account number (required if role = OWNER)",
        example = "1234567890"
    )
    private String accNo;

    // -------- STUDENT FIELDS --------

    private String dob;
    private String emergencyContact;
    private String studentIdNumber;

    @Schema(
        description = "University name (required if role = STUDENT)",
        example = "University of Colombo"
    )
    private String studentUniversity;

    // -------- Technician FIELDS --------

    private String province;
    private String city;
    private Double basePrice;
    private List<MaintenanceIssueType> skills;
}


