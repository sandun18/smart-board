package com.sbms.sbms_monolith.dto.chat;


import lombok.Builder;
import lombok.Data;

import java.time.Instant;

@Data
@Builder
public class ChatListItemResponse {

    private Long chatRoomId;

    private Long boardingId;
    private String boardingTitle;

    private Long otherUserId;
    private String otherUserName;
    private String otherUserRole;

    private String lastMessage;
    private Instant lastMessageAt;

    private long unreadCount;
}
