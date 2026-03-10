package com.sbms.sbms_monolith.service;


import com.sbms.sbms_monolith.dto.profile.*;
import com.sbms.sbms_monolith.model.User;
import com.sbms.sbms_monolith.model.enums.UserRole;
import com.sbms.sbms_monolith.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class ProfileServiceImpl implements ProfileService {

    private final UserRepository userRepository;

    public ProfileServiceImpl(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    private User getUser(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    @Override
    public ProfileResponseDTO getProfile(String email) {
        return ProfileResponseDTO.from(getUser(email));
    }

    @Override
    public ProfileResponseDTO updateStudentProfile(String email, StudentProfileUpdateDTO dto) {

        User user = getUser(email);

        if (user.getRole() != UserRole.STUDENT) {
            throw new RuntimeException("Unauthorized");
        }

        user.setFullName(dto.getFullName());
        user.setPhone(dto.getPhone());
        user.setProfileImageUrl(dto.getProfileImageUrl());
        user.setStudentUniversity(dto.getStudentUniversity());

        user.setAddress(dto.getAddress());
        user.setGender(dto.getGender());
        user.setDob(dto.getDob());
        user.setEmergencyContact(dto.getEmergencyContact());
        user.setStudentIdNumber(dto.getStudentId());

        return ProfileResponseDTO.from(user);
    }

    @Override
    public ProfileResponseDTO updateOwnerProfile(String email, OwnerProfileUpdateDTO dto) {

        User user = getUser(email);

        if (user.getRole() != UserRole.OWNER) {
            throw new RuntimeException("Unauthorized");
        }

        user.setFullName(dto.getFullName());
        user.setPhone(dto.getPhone());
        user.setAddress(dto.getAddress());
        user.setProfileImageUrl(dto.getProfileImageUrl());
        user.setAccNo(dto.getAccNo());
        

        return ProfileResponseDTO.from(user);
    }

    @Override
    public ProfileResponseDTO updateAdminProfile(String email, CommonProfileUpdateDTO dto) {

        User user = getUser(email);

        if (user.getRole() != UserRole.ADMIN) {
            throw new RuntimeException("Unauthorized");
        }

        user.setFullName(dto.getFullName());
        user.setPhone(dto.getPhone());
        user.setProfileImageUrl(dto.getProfileImageUrl());

        return ProfileResponseDTO.from(user);
    }
}
