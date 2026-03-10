package com.sbms.sbms_monolith.dto.payment;

import org.springframework.web.multipart.MultipartFile;

public record BankSlipPaymentDTO(
        Long intentId,
        MultipartFile slipImage
) {}
