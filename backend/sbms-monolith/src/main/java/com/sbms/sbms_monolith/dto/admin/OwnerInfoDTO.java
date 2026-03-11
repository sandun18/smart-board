package com.sbms.sbms_monolith.dto.admin;

import com.sbms.sbms_monolith.model.User;
import lombok.Data;

@Data
public class OwnerInfoDTO {
    private Long id;
    private String name;
    private String email;
    private String phone;
    private String avatar;
    private Double rating;

    public static OwnerInfoDTO fromEntity(User user) {
        if (user == null) {
            return null;
        }

        OwnerInfoDTO dto = new OwnerInfoDTO();
        dto.setId(user.getId());
        dto.setName(user.getFullName());
        dto.setEmail(user.getEmail());
        dto.setPhone(user.getPhone());
        dto.setAvatar(user.getProfileImageUrl());
        dto.setRating(0.0);

        return dto;
    }
}
