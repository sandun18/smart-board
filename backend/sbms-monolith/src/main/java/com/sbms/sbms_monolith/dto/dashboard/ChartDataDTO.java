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

    public ChartDataDTO(Object label, Object value) {
        this.label = label == null ? null : String.valueOf(label);
        if (value == null) {
            this.value = BigDecimal.ZERO;
        } else if (value instanceof BigDecimal bd) {
            this.value = bd;
        } else if (value instanceof Number n) {
            this.value = BigDecimal.valueOf(n.doubleValue());
        } else {
            this.value = new BigDecimal(value.toString());
        }
    }
}
