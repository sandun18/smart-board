package com.sbms.sbms_monolith.service.impl;

import com.sbms.sbms_monolith.dto.ads.AdCreateDTO;
import com.sbms.sbms_monolith.dto.ads.AdResponseDTO;
import com.sbms.sbms_monolith.model.ThirdPartyAd;
import com.sbms.sbms_monolith.model.enums.AdStatus;
import com.sbms.sbms_monolith.repository.ThirdPartyAdRepository;
import com.sbms.sbms_monolith.service.ThirdPartyAdService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
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
        return adRepository.findByStatus(AdStatus.PENDING)
                .stream()
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
        return adRepository.findByStatus(AdStatus.ACTIVE)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public AdResponseDTO createActiveAd(AdCreateDTO dto) {
        ThirdPartyAd ad = new ThirdPartyAd();
        ad.setTitle(dto.getTitle());
        ad.setCompanyName(dto.getCompanyName());
        ad.setRedirectUrl(dto.getRedirectUrl());
        ad.setBannerImageUrl(dto.getBannerImageUrl());
        ad.setExpiryDate(dto.getExpiryDate());
        ad.setPlanName(dto.getPlanName());
        ad.setPlanPrice(dto.getPlanPrice());
        ad.setTargetPanels(dto.getTargetPanels());
        ad.setStatus(AdStatus.ACTIVE);
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
        dto.setRedirectUrl(ad.getRedirectUrl());
        dto.setBannerImageUrl(ad.getBannerImageUrl());
        dto.setExpiryDate(ad.getExpiryDate());
        dto.setPlanName(ad.getPlanName());
        dto.setPlanPrice(ad.getPlanPrice());
        dto.setTargetPanels(ad.getTargetPanels());
        dto.setStatus(ad.getStatus());
        dto.setCreatedAt(ad.getCreatedAt());
        return dto;
    }
}
