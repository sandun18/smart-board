package com.sbms.sbms_monolith.model;


import java.math.BigDecimal;
import java.time.LocalDateTime;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
@Table(name = "owner_wallet_transactions")
public class OwnerWalletTransaction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long ownerId;

    @Column(precision = 14, scale = 2, nullable = false)
    private BigDecimal amount;

    private String reference; // payment transactionRef

    private String type; // CREDIT / DEBIT

    private LocalDateTime createdAt = LocalDateTime.now();
}
