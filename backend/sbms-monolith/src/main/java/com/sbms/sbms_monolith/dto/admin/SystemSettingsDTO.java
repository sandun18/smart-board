package com.sbms.sbms_monolith.dto.admin;

import lombok.Data;

@Data
public class SystemSettingsDTO {
    private String platformName;
    private String supportEmail;
    private String supportPhone;
    private String address;
    private Boolean maintenanceMode;
}
