package com.sbms.sbms_monolith.mapper;

import com.sbms.sbms_monolith.dto.ads.AdCreateDTO;
import com.sbms.sbms_monolith.dto.ads.AdResponseDTO;
import com.sbms.sbms_monolith.model.ThirdPartyAd;
import com.sbms.sbms_monolith.model.enums.AdStatus;

public class AdMapper {

    public static ThirdPartyAd toEntity(AdCreateDTO dto) {
        ThirdPartyAd ad = new ThirdPartyAd();
        ad.setTitle(dto.getTitle());
        ad.setCompanyName(dto.getCompanyName());
        ad.setRedirectUrl(dto.getRedirectUrl());
        ad.setBannerImageUrl(dto.getBannerImageUrl());
        ad.setExpiryDate(dto.getExpiryDate());
        ad.setTargetPanels(dto.getTargetPanels());
        ad.setPlanName(dto.getPlanName());
        ad.setPlanPrice(dto.getPlanPrice());
        ad.setStatus(AdStatus.PENDING); // Uses AdStatus
        return ad;
    }

    public static AdResponseDTO toResponse(ThirdPartyAd ad) {
        AdResponseDTO dto = new AdResponseDTO();
        dto.setId(ad.getId());
        dto.setTitle(ad.getTitle());
        dto.setCompanyName(ad.getCompanyName());
        dto.setRedirectUrl(ad.getRedirectUrl());
        dto.setBannerImageUrl(ad.getBannerImageUrl());
        dto.setExpiryDate(ad.getExpiryDate());
        dto.setStatus(ad.getStatus()); // Returns AdStatus
        dto.setTargetPanels(ad.getTargetPanels());
        dto.setPlanName(ad.getPlanName());
        dto.setPlanPrice(ad.getPlanPrice());
        dto.setCreatedAt(ad.getCreatedAt());
        return dto;
    }
}