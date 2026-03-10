package com.sbms.sbms_monolith.dto.ads;

import com.sbms.sbms_monolith.model.enums.AdPanelType;
import com.sbms.sbms_monolith.model.enums.AdStatus;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class AdResponseDTO {
    private Long id;
    private String title;
    private String companyName;
    private String redirectUrl;
    private String bannerImageUrl;
    private LocalDateTime expiryDate;
    private AdStatus status; // Changed to AdStatus
    private String planName;
    private Double planPrice;
    private List<AdPanelType> targetPanels; // Changed to Enum List
    private LocalDateTime createdAt;
}