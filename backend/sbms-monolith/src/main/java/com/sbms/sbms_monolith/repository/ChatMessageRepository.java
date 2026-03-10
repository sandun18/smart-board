package com.sbms.sbms_monolith.repository;

import com.sbms.sbms_monolith.model.ChatMessage;
import com.sbms.sbms_monolith.model.ChatRoom;
import com.sbms.sbms_monolith.model.User;
import org.springframework.data.domain.*;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;

public interface ChatMessageRepository extends JpaRepository<ChatMessage, Long> {

    /**
     * Load messages (paginated, newest first)
     */
    Page<ChatMessage> findByChatRoomOrderByCreatedAtDesc(
            ChatRoom chatRoom,
            Pageable pageable
    );

    /**
     * Get last message for chat inbox preview
     */
    ChatMessage findTopByChatRoomOrderByCreatedAtDesc(ChatRoom chatRoom);

    /**
     * Count unread messages for a user in a chat room
     * (messages NOT sent by the user)
     */
    @Query("""
        SELECT COUNT(m)
        FROM ChatMessage m
        WHERE m.chatRoom = :room
          AND m.read = false
          AND m.sender <> :user
    """)
    long countUnreadMessages(
            @Param("room") ChatRoom room,
            @Param("user") User user
    );

    /**
     * Mark messages as read for a user
     * (only messages sent by the other participant)
     */
    @Modifying
    @Query("""
        UPDATE ChatMessage m
        SET m.read = true
        WHERE m.chatRoom = :room
          AND m.sender <> :user
          AND m.read = false
    """)
    void markMessagesAsRead(
            @Param("room") ChatRoom room,
            @Param("user") User user
    );
}
