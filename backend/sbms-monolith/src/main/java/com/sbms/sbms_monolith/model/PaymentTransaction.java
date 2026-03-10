package com.sbms.sbms_monolith.model;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.sbms.sbms_monolith.model.enums.PaymentMethod;
import com.sbms.sbms_monolith.model.enums.PaymentStatus;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
public class PaymentTransaction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String transactionRef;

    @ManyToOne(optional = false)
    private PaymentIntent intent;

    @Enumerated(EnumType.STRING)
    private PaymentMethod method;

    @Enumerated(EnumType.STRING)
    private PaymentStatus status;

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal amount; // gross amount

    //  COMMISSION BREAKDOWN
    @Column(precision = 12, scale = 2)
    private BigDecimal platformFee;

    @Column(precision = 12, scale = 2)
    private BigDecimal gatewayFee;

    @Column(precision = 12, scale = 2)
    private BigDecimal netAmount; // owner receives

    private String gateway;
    private String failureReason;

    private LocalDateTime paidAt;
    private String receiptPath;
    
    
    
    @Column(length = 500)
    private String slipUrl; 
    
    private LocalDateTime verifiedAt;
    private Long verifiedByOwnerId;
}
