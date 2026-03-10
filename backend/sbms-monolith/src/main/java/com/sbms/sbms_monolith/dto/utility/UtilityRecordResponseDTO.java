package com.sbms.sbms_monolith.dto.utility;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import lombok.Data;

@Data
public class UtilityRecordResponseDTO {
    
    private Long id;
    private Long boardingId;
    private String boardingName; 
    private String period;       
    private BigDecimal electricityCost;
    private BigDecimal waterCost;
    private BigDecimal totalCost;
    private String proofImageUrl;
    private LocalDateTime lastUpdated;
}
