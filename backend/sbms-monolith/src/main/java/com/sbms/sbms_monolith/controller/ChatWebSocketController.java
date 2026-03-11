package com.sbms.sbms_monolith.controller;

import com.sbms.sbms_monolith.dto.chat.ChatMessageResponse;
import com.sbms.sbms_monolith.dto.chat.SendMessageRequest;
import com.sbms.sbms_monolith.mapper.ChatMapper;
import com.sbms.sbms_monolith.model.ChatMessage;
import com.sbms.sbms_monolith.model.User;
import com.sbms.sbms_monolith.repository.UserRepository;
import com.sbms.sbms_monolith.service.ChatService;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import java.security.Principal;
import java.util.Optional;

@Controller
@RequiredArgsConstructor
public class ChatWebSocketController {

    private final ChatService chatService;
    private final ChatMapper chatMapper;
    private final SimpMessagingTemplate messagingTemplate;
    private final UserRepository userRepository;

    @MessageMapping("/chat.send")
    public void sendMessage(
            SendMessageRequest request,
            Principal principal
    ) {
        if (principal == null) {
            throw new IllegalStateException("Unauthenticated WebSocket message");
        }

        String principalName = principal.getName();
        User sender;

        // 🔥 CASE 1: principalName is EMAIL (mobile app)
        Optional<User> byEmail = userRepository.findByEmail(principalName);

        if (byEmail.isPresent()) {
            sender = byEmail.get();
        } else {
            // 🔥 CASE 2: principalName is USER ID (web app)
            try {
                Long userId = Long.valueOf(principalName);
                sender = userRepository.findById(userId)
                        .orElseThrow(() ->
                                new IllegalStateException("WS user not found by id: " + userId)
                        );
            } catch (NumberFormatException e) {
                throw new IllegalStateException("Invalid WS principal: " + principalName);
            }
        }

        ChatMessage saved =
                chatService.sendMessage(request, sender);

        ChatMessageResponse response =
                chatMapper.toMessageResponse(saved);

        messagingTemplate.convertAndSend(
                "/topic/chat/" + response.getChatRoomId(),
                response
        );
    }
}
