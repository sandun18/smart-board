package com.sbms.sbms_monolith.service.impl;

import com.sbms.sbms_monolith.dto.ads.AdCreateDTO;
import com.sbms.sbms_monolith.dto.ads.AdResponseDTO;
import com.sbms.sbms_monolith.model.ThirdPartyAd;
import com.sbms.sbms_monolith.model.enums.AdStatus;
import com.sbms.sbms_monolith.model.enums.AdPanelType;
import com.sbms.sbms_monolith.repository.ThirdPartyAdRepository;
import com.sbms.sbms_monolith.service.ThirdPartyAdService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class ThirdPartyAdServiceImpl implements ThirdPartyAdService {

    private final ThirdPartyAdRepository adRepository;

    public ThirdPartyAdServiceImpl(ThirdPartyAdRepository adRepository) {
        this.adRepository = adRepository;
    }

    @Override
    public List<AdResponseDTO> getAllSubmissions() {
        // Return all submissions (PENDING, APPROVED, REJECTED) - not ACTIVE campaigns
        return adRepository.findAll()
                .stream()
                .filter(ad -> ad.getStatus() != AdStatus.ACTIVE && ad.getStatus() != AdStatus.PAUSED)
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public AdResponseDTO updateAdStatus(Long id, AdStatus status) {
        ThirdPartyAd ad = adRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Ad not found with id: " + id));
        ad.setStatus(status);
        ThirdPartyAd updated = adRepository.save(ad);
        return convertToDTO(updated);
    }

    @Override
    public List<AdResponseDTO> getActiveCampaigns() {
        // Include EXPIRED so admins can replay them from campaign management.
        java.util.List<com.sbms.sbms_monolith.model.enums.AdStatus> statuses = java.util.Arrays.asList(AdStatus.ACTIVE, AdStatus.PAUSED, AdStatus.EXPIRED);
        return adRepository.findByStatusIn(statuses)
            .stream()
            .map(this::convertToDTO)
            .collect(Collectors.toList());
    }

    @Override
    public List<AdResponseDTO> getPublicActiveAds() {
        // Return ACTIVE ads that target PUBLIC_DASHBOARD for home page display
        AdStatus active = AdStatus.ACTIVE;
        LocalDateTime now = LocalDateTime.now();
        return adRepository.findByStatus(active)
                .stream()
            .filter(ad -> ad.getExpiryDate() == null || ad.getExpiryDate().isAfter(now))
                .filter(ad -> ad.getTargetPanels() != null && ad.getTargetPanels().contains(AdPanelType.PUBLIC_DASHBOARD))
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public AdResponseDTO createActiveAd(AdCreateDTO dto) {
        ThirdPartyAd ad = new ThirdPartyAd();
        ad.setTitle(dto.getTitle());
        ad.setCompanyName(dto.getCompanyName());
        ad.setDescription(dto.getDescription());
        ad.setEmail(dto.getEmail());
        ad.setPhone(dto.getPhone());
        ad.setRedirectUrl(dto.getRedirectUrl());
        ad.setBannerImageUrl(dto.getBannerImageUrl());
        ad.setExpiryDate(dto.getExpiryDate());
        ad.setPlanName(dto.getPlanName());
        ad.setPlanPrice(dto.getPlanPrice());
        ad.setTargetPanels(dto.getTargetPanels());
        ad.setIsPublic(dto.getIsPublic());
        ad.setStatus(AdStatus.ACTIVE);
        ThirdPartyAd saved = adRepository.save(ad);
        return convertToDTO(saved);
    }

    @Override
    public AdResponseDTO submitAd(AdCreateDTO dto) {
        ThirdPartyAd ad = new ThirdPartyAd();
        ad.setTitle(dto.getTitle());
        ad.setCompanyName(dto.getCompanyName());
        ad.setDescription(dto.getDescription());
        ad.setEmail(dto.getEmail());
        ad.setPhone(dto.getPhone());
        ad.setRedirectUrl(dto.getRedirectUrl());
        ad.setBannerImageUrl(dto.getBannerImageUrl());
        ad.setExpiryDate(dto.getExpiryDate());
        ad.setPlanName(dto.getPlanName());
        ad.setPlanPrice(dto.getPlanPrice());
        ad.setTargetPanels(dto.getTargetPanels());
        ad.setIsPublic(dto.getIsPublic());
        ad.setStatus(AdStatus.PENDING);
        ThirdPartyAd saved = adRepository.save(ad);
        return convertToDTO(saved);
    }

    @Override
    public AdResponseDTO toggleAdStatus(Long id) {
        ThirdPartyAd ad = adRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Ad not found with id: " + id));
        
        AdStatus newStatus = ad.getStatus() == AdStatus.ACTIVE ? AdStatus.PAUSED : AdStatus.ACTIVE;
        ad.setStatus(newStatus);
        ThirdPartyAd updated = adRepository.save(ad);
        return convertToDTO(updated);
    }

    @Override
    public AdResponseDTO replayExpiredAd(Long id) {
        ThirdPartyAd ad = adRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Ad not found with id: " + id));

        // Replay should make campaign live again with a fresh default period.
        ad.setStatus(AdStatus.ACTIVE);
        ad.setExpiryDate(LocalDateTime.now().plusDays(30));

        ThirdPartyAd updated = adRepository.save(ad);
        return convertToDTO(updated);
    }

    @Override
    public AdResponseDTO updateAdDetails(Long id, AdCreateDTO dto) {
        ThirdPartyAd ad = adRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Ad not found with id: " + id));
        
        ad.setTitle(dto.getTitle());
        ad.setCompanyName(dto.getCompanyName());
        ad.setRedirectUrl(dto.getRedirectUrl());
        ad.setBannerImageUrl(dto.getBannerImageUrl());
        ad.setExpiryDate(dto.getExpiryDate());
        ad.setPlanName(dto.getPlanName());
        ad.setPlanPrice(dto.getPlanPrice());
        ad.setTargetPanels(dto.getTargetPanels());
        ad.setIsPublic(dto.getIsPublic());
        
        ThirdPartyAd updated = adRepository.save(ad);
        return convertToDTO(updated);
    }

    @Override
    public void deleteAd(Long id) {
        adRepository.deleteById(id);
    }

    private AdResponseDTO convertToDTO(ThirdPartyAd ad) {
        AdResponseDTO dto = new AdResponseDTO();
        dto.setId(ad.getId());
        dto.setTitle(ad.getTitle());
        dto.setCompanyName(ad.getCompanyName());
        dto.setDescription(ad.getDescription());
        dto.setEmail(ad.getEmail());
        dto.setPhone(ad.getPhone());
        dto.setRedirectUrl(ad.getRedirectUrl());
        dto.setBannerImageUrl(ad.getBannerImageUrl());
        dto.setExpiryDate(ad.getExpiryDate());
        dto.setPlanName(ad.getPlanName());
        dto.setPlanPrice(ad.getPlanPrice());
        dto.setTargetPanels(ad.getTargetPanels());
        dto.setStatus(ad.getStatus());
        dto.setIsPublic(ad.getIsPublic());
        dto.setCreatedAt(ad.getCreatedAt());
        return dto;
    }
}
