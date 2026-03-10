package com.sbms.sbms_monolith.dto.chat;


import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ChatRoomResponse {

    private Long chatRoomId;

    private Long boardingId;

    private Long studentId;
    private Long ownerId;
}
