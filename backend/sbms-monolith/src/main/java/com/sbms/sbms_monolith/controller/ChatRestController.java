package com.sbms.sbms_monolith.controller;

import com.sbms.sbms_monolith.dto.chat.ChatListItemResponse;
import com.sbms.sbms_monolith.dto.chat.ChatMessageResponse;
import com.sbms.sbms_monolith.dto.chat.StartChatRequest;
import com.sbms.sbms_monolith.dto.chat.StartChatResponse;
import com.sbms.sbms_monolith.mapper.ChatMapper;
import com.sbms.sbms_monolith.model.ChatMessage;
import com.sbms.sbms_monolith.model.ChatRoom;
import com.sbms.sbms_monolith.model.User;
import com.sbms.sbms_monolith.repository.ChatMessageRepository;
import com.sbms.sbms_monolith.repository.ChatRoomRepository;
import com.sbms.sbms_monolith.security.ChatSecurityUtil;
import com.sbms.sbms_monolith.service.ChatRoomService;
import com.sbms.sbms_monolith.service.ChatService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Comparator;
import java.util.List;

@RestController
@RequestMapping("/api/chats")
@RequiredArgsConstructor
@PreAuthorize("hasAnyRole('STUDENT','OWNER')")
public class ChatRestController {

    private final ChatRoomRepository chatRoomRepository;
    private final ChatMessageRepository chatMessageRepository;
    private final ChatRoomService chatRoomService;
    private final ChatService chatService;
    private final ChatSecurityUtil securityUtil;
    private final ChatMapper chatMapper;

  
    @GetMapping
    public ResponseEntity<List<ChatListItemResponse>> getChatList() {

        User currentUser = securityUtil.getCurrentUser();

        List<ChatRoom> rooms =
                chatRoomRepository.findUserChatRooms(currentUser);

        List<ChatListItemResponse> response =
                rooms.stream()
                        .map(room -> {

                            User otherUser =
                                    room.getStudent().getId().equals(currentUser.getId())
                                            ? room.getOwner()
                                            : room.getStudent();

                            long unreadCount =
                                    chatMessageRepository.countUnreadMessages(room, currentUser);

                            ChatMessage lastMessage =
                                    chatMessageRepository
                                            .findTopByChatRoomOrderByCreatedAtDesc(room);

                            return ChatListItemResponse.builder()
                                    .chatRoomId(room.getId())
                                    .boardingId(room.getBoarding().getId())
                                    .boardingTitle(room.getBoarding().getTitle())
                                    .otherUserId(otherUser.getId())
                                    .otherUserName(otherUser.getFullName())
                                    .otherUserRole(otherUser.getRole().name())
                                    .lastMessage(
                                            lastMessage != null
                                                    ? lastMessage.getContent()
                                                    : null
                                    )
                                    .lastMessageAt(room.getLastMessageAt())
                                    .unreadCount(unreadCount)
                                    .build();
                        })
                        .sorted(
                                Comparator.comparing(
                                        ChatListItemResponse::getLastMessageAt,
                                        Comparator.nullsLast(Comparator.reverseOrder())
                                )
                        )
                        .toList();

        return ResponseEntity.ok(response);
    }

 @GetMapping("/{roomId}/messages")
    public ResponseEntity<Page<ChatMessageResponse>> getMessages(
            @PathVariable Long roomId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size
    ) {

        User user = securityUtil.getCurrentUser();

        ChatRoom room = chatRoomRepository.findById(roomId)
                .orElseThrow(() -> new IllegalArgumentException("Chat room not found"));

        chatRoomService.validateParticipant(room, user);

        Pageable pageable = PageRequest.of(page, size);

        Page<ChatMessageResponse> response =
                chatService.loadMessages(room, pageable)
                        .map(chatMapper::toMessageResponse);

        return ResponseEntity.ok(response);
    }

    /**
     * 3️⃣ Mark Messages as Read
     * - Marks ONLY messages sent by the other user
     */
    @PatchMapping("/{roomId}/read")
    public ResponseEntity<Void> markAsRead(@PathVariable Long roomId) {

        User user = securityUtil.getCurrentUser();

        ChatRoom room = chatRoomRepository.findById(roomId)
                .orElseThrow(() -> new IllegalArgumentException("Chat room not found"));

        chatRoomService.validateParticipant(room, user);

        chatService.markAsRead(room);

        return ResponseEntity.noContent().build();
    }

    /**
     * 4️⃣ Start Chat
     * - Only STUDENT can initiate
     * - OWNER attempts are rejected inside ChatRoomService
     */
    @PostMapping
    public ResponseEntity<StartChatResponse> startChat(
            @RequestBody @Valid StartChatRequest request
    ) {

        ChatRoom room =
                chatRoomService.getOrCreateRoom(request.getBoardingId());

        return ResponseEntity.ok(
                new StartChatResponse(room.getId())
        );
    }
}
