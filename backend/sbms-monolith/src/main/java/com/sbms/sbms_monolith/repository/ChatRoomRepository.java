package com.sbms.sbms_monolith.repository;

import com.sbms.sbms_monolith.model.ChatRoom;
import com.sbms.sbms_monolith.model.User;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ChatRoomRepository extends JpaRepository<ChatRoom, Long> {

    // 1️ Find existing room (used before creating new one)
    Optional<ChatRoom> findByStudentAndOwnerAndBoarding_Id(
            User student,
            User owner,
            Long boardingId
    );

    // 2️ Load chat rooms where user is either student or owner
    @Query("""
        SELECT cr
        FROM ChatRoom cr
        WHERE cr.student = :user OR cr.owner = :user
        ORDER BY cr.lastMessageAt DESC NULLS LAST
    """)
    List<ChatRoom> findUserChatRooms(@Param("user") User user);
}
