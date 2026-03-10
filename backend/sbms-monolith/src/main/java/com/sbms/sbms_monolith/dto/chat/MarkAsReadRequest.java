package com.sbms.sbms_monolith.dto.chat;


import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class MarkAsReadRequest {

    @NotNull
    private Long chatRoomId;
}
