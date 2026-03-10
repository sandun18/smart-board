package com.sbms.sbms_monolith.dto.profile;


import com.sbms.sbms_monolith.model.User;
import com.sbms.sbms_monolith.model.enums.Gender;
import com.sbms.sbms_monolith.model.enums.UserRole;
import lombok.Data;

@Data
public class ProfileResponseDTO {

    private Long id;
    private String fullName;
    private String email;
    private String password;
    private String phone;
    private String address;
    private String profileImageUrl;
    private UserRole role;
    private String nicNumber;

    private String accNo;
    private String studentUniversity;
    private boolean verifiedOwner;

    private Gender gender;
    private String dob;
    private String emergencyContact;
    private String studentId;

    public static ProfileResponseDTO from(User user) {
        ProfileResponseDTO dto = new ProfileResponseDTO();
        dto.setId(user.getId());
        dto.setFullName(user.getFullName());
        dto.setEmail(user.getEmail());
        
        dto.setPhone(user.getPhone());
        dto.setProfileImageUrl(user.getProfileImageUrl());
        dto.setRole(user.getRole());
        dto.setAccNo(user.getAccNo());
        dto.setStudentUniversity(user.getStudentUniversity());
        dto.setAddress(user.getAddress());
        dto.setNicNumber(user.getNicNumber());

        dto.setGender(user.getGender());
        dto.setDob(user.getDob());
        dto.setEmergencyContact(user.getEmergencyContact());
        dto.setStudentId(user.getStudentIdNumber());

        return dto;
    }
}
