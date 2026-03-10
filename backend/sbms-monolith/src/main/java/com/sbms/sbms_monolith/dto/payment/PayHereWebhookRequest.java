package com.sbms.sbms_monolith.dto.payment;


import lombok.Data;

import java.math.BigDecimal;

@Data
public class PayHereWebhookRequest {

    private String merchant_id;
    private String order_id;        // transactionRef
    private String payment_id;
    private BigDecimal payhere_amount;
    private String payhere_currency;
    private String status_code;     // 2 = success, -2 = failed
    private String md5sig;          // signature
}
