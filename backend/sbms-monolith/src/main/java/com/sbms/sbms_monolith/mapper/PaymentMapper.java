package com.sbms.sbms_monolith.mapper;

import com.sbms.sbms_monolith.dto.payment.PaymentHistoryDTO;
import com.sbms.sbms_monolith.model.PaymentTransaction;

public class PaymentMapper {

    public static PaymentHistoryDTO toDTO(PaymentTransaction tx) {

        PaymentHistoryDTO dto = new PaymentHistoryDTO();

        dto.setId(tx.getId());
        dto.setTransactionRef(tx.getTransactionRef());
        dto.setAmount(tx.getAmount());
        dto.setMethod(tx.getMethod());
        dto.setStatus(tx.getStatus());
        dto.setFailureReason(tx.getFailureReason());
        
        dto.setPlatformFee(tx.getPlatformFee());
        dto.setGatewayFee(tx.getGatewayFee());
        dto.setNetAmount(tx.getNetAmount());


        // Use paidAt (webhook-confirmed time)
        dto.setPaidAt(tx.getPaidAt());

        //  Use receiptPath (S3 URL)
        dto.setReceiptUrl(tx.getReceiptPath());

        return dto;
    }
}
