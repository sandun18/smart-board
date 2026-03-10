package com.sbms.sbms_monolith.service;

import com.sbms.sbms_monolith.dto.chat.SendMessageRequest;
import com.sbms.sbms_monolith.model.ChatMessage;
import com.sbms.sbms_monolith.model.ChatRoom;
import com.sbms.sbms_monolith.model.User;
import com.sbms.sbms_monolith.model.enums.UserRole;
import com.sbms.sbms_monolith.repository.ChatMessageRepository;
import com.sbms.sbms_monolith.repository.ChatRoomRepository;
import com.sbms.sbms_monolith.security.ChatSecurityUtil;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.Instant;

@Service
@RequiredArgsConstructor
@Transactional
public class ChatService {

    private final ChatRoomRepository chatRoomRepository;
    private final ChatMessageRepository chatMessageRepository;
    private final ChatSecurityUtil securityUtil;
    private final ChatRoomService chatRoomService;

    /* =========================================================
       1️⃣ SEND MESSAGE (WebSocket)
       ========================================================= */
    @Transactional
    public ChatMessage sendMessage(SendMessageRequest request, User sender) {

        ChatRoom room = chatRoomRepository.findById(request.getChatRoomId())
                .orElseThrow(() -> new IllegalArgumentException("Chat room not found"));

        chatRoomService.validateParticipant(room, sender);

        ChatMessage message = ChatMessage.builder()
                .chatRoom(room)
                .sender(sender)
                .senderRole(
                        sender.getRole() == UserRole.STUDENT
                                ? ChatMessage.SenderRole.STUDENT
                                : ChatMessage.SenderRole.OWNER
                )
                .content(request.getContent())
                .read(false)
                .build();

        ChatMessage saved = chatMessageRepository.save(message);

        room.setLastMessageAt(saved.getCreatedAt());
        chatRoomRepository.save(room);

        return saved;
    }


    /* =========================================================
       2️⃣ LOAD MESSAGES (REST)
       ========================================================= */
    public Page<ChatMessage> loadMessages(
            ChatRoom room,
            Pageable pageable
    ) {
        return chatMessageRepository
                .findByChatRoomOrderByCreatedAtDesc(room, pageable);
    }

    /* =========================================================
       3️⃣ MARK AS READ (REST)
       ========================================================= */
    public void markAsRead(ChatRoom room) {

        User currentUser = securityUtil.getCurrentUser();

        chatMessageRepository.markMessagesAsRead(
                room,
                currentUser
        );
    }
}
