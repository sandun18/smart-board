package com.sbms.sbms_monolith.service;

import com.sbms.sbms_monolith.dto.ads.AdCreateDTO;
import com.sbms.sbms_monolith.dto.ads.AdResponseDTO;
import com.sbms.sbms_monolith.model.enums.AdStatus;
import java.util.List;

public interface ThirdPartyAdService {
    List<AdResponseDTO> getAllSubmissions();
    AdResponseDTO updateAdStatus(Long id, AdStatus status);
    List<AdResponseDTO> getActiveCampaigns();
    AdResponseDTO createActiveAd(AdCreateDTO dto);
    AdResponseDTO toggleAdStatus(Long id);
    AdResponseDTO updateAdDetails(Long id, AdCreateDTO dto);
    void deleteAd(Long id);
}
