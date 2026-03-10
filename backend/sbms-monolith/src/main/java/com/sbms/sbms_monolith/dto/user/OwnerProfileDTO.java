package com.sbms.sbms_monolith.dto.user;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

@Data
@Schema(description = "Owner profile details")
public class OwnerProfileDTO {

    @Schema(example = "8")
    private Long id;

    @Schema(example = "Saman Jayasinghe")
    private String fullName;

    @Schema(example = "saman@gmail.com")
    private String email;

    

    @Schema(example = "0761234567")
    private String phone;

    @Schema(example = "Kandy, Sri Lanka")
    private String address;

    @Schema(
        description = "Profile image URL",
        example = "https://s3.amazonaws.com/sbms/owner.jpg"
    )
    private String profileImageUrl;

    @Schema(example = "199912345678")
    private String nicNumber;

    @Schema(example = "true")
    private boolean verifiedOwner;

    @Schema(example = "3")
    private Integer subscription_id;

    @Schema(
        description = "Owner bank account number",
        example = "9988776655"
    )
    private String accNo;

    @Schema(
        description = "Total number of boardings created by owner",
        example = "5"
    )
    private int totalBoardings;
}
