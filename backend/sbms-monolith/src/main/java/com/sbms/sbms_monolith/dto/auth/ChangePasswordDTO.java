package com.sbms.sbms_monolith.dto.auth;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

@Data
@Schema(description = "Payload for changing the password")
public class ChangePasswordDTO {

    @Schema(example = "oldPassword123", description = "Current password for verification")
    private String currentPassword;

    @Schema(example = "newPassword456", description = "New password to set")
    private String newPassword;
}