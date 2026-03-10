package com.sbms.sbms_monolith.model.enums;


public enum PaymentIntentStatus {

	CREATED,                  // intent created
    IN_PROGRESS,              // card redirect / upload started

    AWAITING_MANUAL_APPROVAL, // cash or bank slip submitted

    SUCCESS,  
    
    PROCESSING,
    // payment confirmed (card webhook OR owner approval)

    FAILED,
    EXPIRED,
    CANCELLED
    // User cancelled manually
}
