package com.sbms.sbms_monolith.mapper;

import org.springframework.stereotype.Component;

import com.sbms.sbms_monolith.dto.chat.ChatMessageResponse;
import com.sbms.sbms_monolith.model.ChatMessage;

@Component
public class ChatMapper {

    public ChatMessageResponse toMessageResponse(ChatMessage message) {
        return ChatMessageResponse.builder()
                .id(message.getId())
                .chatRoomId(message.getChatRoom().getId())
                .senderId(message.getSender().getId())
                .senderRole(message.getSenderRole().name())
                .content(message.getContent())
                .read(message.isRead())
                .createdAt(message.getCreatedAt())
                .build();
    }
}
