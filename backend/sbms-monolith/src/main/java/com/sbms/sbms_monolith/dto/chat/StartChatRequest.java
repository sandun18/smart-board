package com.sbms.sbms_monolith.dto.chat;


import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class StartChatRequest {

    @NotNull
    private Long boardingId;
}
