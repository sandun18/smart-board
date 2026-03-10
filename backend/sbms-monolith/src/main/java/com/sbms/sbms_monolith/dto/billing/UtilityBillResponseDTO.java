package com.sbms.sbms_monolith.dto.billing;

import java.math.BigDecimal;

import lombok.Data;

@Data
public class UtilityBillResponseDTO {

	private Long id;
    private Long boardingId;
    private String boardingName;

    private String month;
    private BigDecimal electricityAmount;
    private BigDecimal waterAmount;
    private BigDecimal perStudentUtility;
}
