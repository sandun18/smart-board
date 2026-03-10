package com.sbms.sbms_monolith.dto.billing;

import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

import com.sbms.sbms_monolith.model.enums.BillDueStatus;
import com.sbms.sbms_monolith.model.enums.MonthlyBillStatus;

@Data
public class MonthlyBillResponseDTO {

    private Long id;

    private Long studentId;
    private String studentName;
    
    private LocalDate dueDate;
    private int dueInDays;
    private BillDueStatus dueStatus;
    
    private long ownerId;


    private Long boardingId;
    private String boardingTitle;

    private String month;

    private BigDecimal boardingFee;
    private BigDecimal electricityFee;
    private BigDecimal waterFee;
    private BigDecimal totalAmount;

    private MonthlyBillStatus status;
}
