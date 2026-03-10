package com.sbms.sbms_monolith.service;

import com.sbms.sbms_monolith.model.Boarding;
import com.sbms.sbms_monolith.model.ChatRoom;
import com.sbms.sbms_monolith.model.User;
import com.sbms.sbms_monolith.repository.BoardingRepository;
import com.sbms.sbms_monolith.repository.ChatRoomRepository;
import com.sbms.sbms_monolith.security.ChatSecurityUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class ChatRoomService {

    private final ChatRoomRepository chatRoomRepository;
    private final BoardingRepository boardingRepository;
    private final ChatSecurityUtil securityUtil;

    /**
     * STUDENT → find or create chat room
     * OWNER   → must already have a chat room
     */
    public ChatRoom getOrCreateRoom(Long boardingId) {

        User currentUser = securityUtil.getCurrentUser();

        Boarding boarding = boardingRepository.findById(boardingId)
                .orElseThrow(() -> new IllegalArgumentException("Boarding not found"));

        // 🚫 Admins are not allowed
        if (!securityUtil.isStudent(currentUser) && !securityUtil.isOwner(currentUser)) {
            throw new IllegalStateException("Admins are not allowed to chat");
        }

        // ✅ STUDENT starts chat
        if (securityUtil.isStudent(currentUser)) {

            User student = currentUser;
            User owner = boarding.getOwner();

            return chatRoomRepository
                    .findByStudentAndOwnerAndBoarding_Id(student, owner, boardingId)
                    .orElseGet(() -> chatRoomRepository.save(
                            ChatRoom.builder()
                                    .student(student)
                                    .owner(owner)
                                    .boarding(boarding)
                                    .build()
                    ));
        }

        // ❌ OWNER cannot create chat rooms
        throw new IllegalStateException(
                "Owner cannot start a chat. Chat must be initiated by a student."
        );
    }

    /**
     * Validate user is part of the chat room
     */
    public void validateParticipant(ChatRoom room, User user) {

        if (!room.getStudent().getId().equals(user.getId())
                && !room.getOwner().getId().equals(user.getId())) {
            throw new SecurityException("You are not part of this chat room");
        }
    }
}
