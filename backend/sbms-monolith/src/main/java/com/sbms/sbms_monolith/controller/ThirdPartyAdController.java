package com.sbms.sbms_monolith.controller;

import com.sbms.sbms_monolith.dto.ads.AdCreateDTO;
import com.sbms.sbms_monolith.dto.ads.AdResponseDTO;
import com.sbms.sbms_monolith.model.enums.AdStatus;
import com.sbms.sbms_monolith.service.ThirdPartyAdService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/ads")
public class ThirdPartyAdController {

    @Autowired
    private ThirdPartyAdService adService;

    @GetMapping("/submissions")
    @PreAuthorize("hasRole('ADMIN')")
    public List<AdResponseDTO> getAllSubmissions() {
        return adService.getAllSubmissions();
    }

    @PatchMapping("/{id}/approve")
    @PreAuthorize("hasRole('ADMIN')")
    public AdResponseDTO approveAd(@PathVariable Long id) {
        return adService.updateAdStatus(id, AdStatus.APPROVED);
    }

    @PatchMapping("/{id}/reject")
    @PreAuthorize("hasRole('ADMIN')")
    public AdResponseDTO rejectAd(@PathVariable Long id) {
        return adService.updateAdStatus(id, AdStatus.REJECTED);
    }

    @GetMapping("/campaigns")
    @PreAuthorize("hasRole('ADMIN')")
    public List<AdResponseDTO> getAllCampaigns() {
        // Matches the renamed service method
        return adService.getActiveCampaigns();
    }

    @PostMapping("/publish")
    @PreAuthorize("hasRole('ADMIN')")
    public AdResponseDTO publishAd(@RequestBody AdCreateDTO dto) {
        return adService.createActiveAd(dto);
    }

    @PatchMapping("/{id}/toggle-status")
    @PreAuthorize("hasRole('ADMIN')")
    public AdResponseDTO toggleCampaignStatus(@PathVariable Long id) {
        return adService.toggleAdStatus(id);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public AdResponseDTO updateCampaignDetails(@PathVariable Long id, @RequestBody AdCreateDTO dto) {
        return adService.updateAdDetails(id, dto);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public void deleteAd(@PathVariable Long id) {
        adService.deleteAd(id);
    }
}