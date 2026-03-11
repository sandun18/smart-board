package com.sbms.sbms_monolith.dto.ads;

import com.sbms.sbms_monolith.model.enums.AdPanelType;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class AdCreateDTO {
    private String title;
    private String companyName;
    private String redirectUrl;
    private String bannerImageUrl;
    private LocalDateTime expiryDate;
    private String planName;
    private Double planPrice;
    private List<AdPanelType> targetPanels; // Changed to Enum List
}