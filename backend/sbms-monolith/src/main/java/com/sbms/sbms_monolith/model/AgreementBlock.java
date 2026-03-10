package com.sbms.sbms_monolith.model;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.Data;

@Entity
@Data
public class AgreementBlock {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long registrationId;

    @Column(length = 64)
    private String agreementHash;

    @Column(length = 64)
    private String previousHash;

    @Column(length = 64)
    private String currentHash;

    private LocalDateTime createdAt;
}
