package com.sbms.sbms_monolith.model;


import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;

@Entity
@Table(
    name = "chat_rooms",
    uniqueConstraints = {
        @UniqueConstraint(
            columnNames = {"student_id", "owner_id", "boarding_id"}
        )
    },
    indexes = {
        @Index(name = "idx_chat_room_student", columnList = "student_id"),
        @Index(name = "idx_chat_room_owner", columnList = "owner_id"),
        @Index(name = "idx_chat_room_boarding", columnList = "boarding_id"),
        @Index(name = "idx_chat_room_last_message", columnList = "last_message_at")
    }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ChatRoom {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // STUDENT
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "student_id", nullable = false)
    private User student;

    // OWNER
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "owner_id", nullable = false)
    private User owner;

    // BOARDING CONTEXT
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "boarding_id", nullable = false)
    private Boarding boarding;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @Column(name = "last_message_at")
    private Instant lastMessageAt;

    @PrePersist
    public void onCreate() {
        this.createdAt = Instant.now();
    }
}
