package com.sbms.sbms_monolith.dto.dashboard;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ChartDataDTO {
    private String label;  // e.g., "Jan", "Feb"
    private BigDecimal value; // e.g., 5000.00
}
