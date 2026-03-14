package com.sbms.sbms_monolith.mapper;

import com.sbms.sbms_monolith.dto.user.*;
import com.sbms.sbms_monolith.model.User;
import com.sbms.sbms_monolith.model.enums.UserRole;

public class UserMapper {

  
    public static User toEntity(UserRegisterDTO dto) {
        if (dto == null) return null;

        User user = new User();

        user.setFullName(dto.getFullName());
        user.setEmail(dto.getEmail());
        user.setPassword(dto.getPassword()); 
        user.setPhone(dto.getPhone());
        user.setAddress(dto.getAddress());
        user.setGender(dto.getGender());

        user.setRole(dto.getRole());

        user.setDob(dto.getDob());
        user.setEmergencyContact(dto.getEmergencyContact());
        user.setStudentIdNumber(dto.getStudentIdNumber());

        if (dto.getRole() == UserRole.OWNER) {
            user.setNicNumber(dto.getNicNumber());
            user.setAccNo(dto.getAccNo());

            user.setVerifiedOwner(false);
            user.setSubscription_id(0);
        }

        if (dto.getRole() == UserRole.STUDENT) {
            user.setStudentUniversity(dto.getStudentUniversity());
        }

        return user;
    }

  
    public static UserResponseDTO toUserResponse(User user) {
        if (user == null) return null;

        UserResponseDTO dto = new UserResponseDTO();

        dto.setId(user.getId());
        dto.setFullName(user.getFullName());
        dto.setEmail(user.getEmail());
        dto.setPhone(user.getPhone());
        dto.setProfileImageUrl(user.getProfileImageUrl());
        dto.setAddress(user.getAddress());
        dto.setGender(user.getGender());
        dto.setRole(user.getRole());

        dto.setDob(user.getDob());
        dto.setEmergencyContact(user.getEmergencyContact());
        dto.setStudentIdNumber(user.getStudentIdNumber());

        if (user.getRole() == UserRole.OWNER) {
            dto.setVerifiedOwner(user.isVerifiedOwner());
            dto.setSubscription_id(user.getSubscription_id());
            dto.setAccNo(user.getAccNo());
        }

        if (user.getRole() == UserRole.STUDENT) {
            dto.setStudentUniversity(user.getStudentUniversity());
        }

        if (user.getRole() == UserRole.TECHNICIAN) {
            if (user.getTechnicianAverageRating() != null) {
                dto.setTechnicianAverageRating(user.getTechnicianAverageRating().doubleValue());
            } else {
                dto.setTechnicianAverageRating(0.0);
            }
            dto.setTechnicianTotalJobs(user.getTechnicianTotalJobs());
        }

        dto.setCreatedAt(user.getCreatedAt());

        return dto;
    }

    public static OwnerProfileDTO toOwnerProfile(User user) {
        if (user == null) return null;

        OwnerProfileDTO dto = new OwnerProfileDTO();

        dto.setId(user.getId());
        dto.setFullName(user.getFullName());
        dto.setEmail(user.getEmail());
        dto.setPhone(user.getPhone());

        dto.setAddress(user.getAddress());
        dto.setProfileImageUrl(user.getProfileImageUrl());
        dto.setNicNumber(user.getNicNumber());
        dto.setVerifiedOwner(user.isVerifiedOwner());

        dto.setSubscription_id(user.getSubscription_id());
        dto.setAccNo(user.getAccNo());

        if (user.getBoardings() != null) {
            dto.setTotalBoardings(user.getBoardings().size());
        } else {
            dto.setTotalBoardings(0);
        }

        return dto;
    }

   
    public static AdminUserDTO toAdminUser(User user) {
        if (user == null) return null;

        AdminUserDTO dto = new AdminUserDTO();

        dto.setId(user.getId());
        dto.setFullName(user.getFullName());
        dto.setEmail(user.getEmail());
        dto.setPhone(user.getPhone());
        dto.setRole(user.getRole());

        dto.setVerifiedOwner(user.isVerifiedOwner());
        dto.setSubscription_id(user.getSubscription_id());

        return dto;
    }
}
