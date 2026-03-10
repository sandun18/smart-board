package com.sbms.sbms_monolith.dto.profile;


import lombok.Data;

@Data
public class OwnerProfileUpdateDTO {

    private String fullName;
    private String phone;
    private String address;
    private String profileImageUrl;
    

    private String accNo;
}
