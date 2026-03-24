package com.sbms.sbms_monolith.controller;

import com.sbms.sbms_monolith.dto.ads.AdCreateDTO;
import com.sbms.sbms_monolith.dto.ads.AdResponseDTO;
import com.sbms.sbms_monolith.dto.ads.PlanDTO;
import com.sbms.sbms_monolith.model.enums.AdStatus;
import com.sbms.sbms_monolith.service.AdPlanService;
import com.sbms.sbms_monolith.service.ThirdPartyAdService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/admin/third-party-ads")
public class ThirdPartyAdController {

    private final ThirdPartyAdService adService;
    private final AdPlanService planService;

    public ThirdPartyAdController(ThirdPartyAdService adService, AdPlanService planService) {
        this.adService = adService;
        this.planService = planService;
    }

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
        return adService.getActiveCampaigns();
    }

    @PostMapping("/publish")
    public AdResponseDTO publishAd(@RequestBody AdCreateDTO dto) {
        return adService.createActiveAd(dto);
    }

    @PatchMapping("/{id}/toggle-status")
    @PreAuthorize("hasRole('ADMIN')")
    public AdResponseDTO toggleCampaignStatus(@PathVariable Long id) {
        return adService.toggleAdStatus(id);
    }

    @PatchMapping("/{id}/replay")
    @PreAuthorize("hasRole('ADMIN')")
    public AdResponseDTO replayExpiredCampaign(@PathVariable Long id) {
        return adService.replayExpiredAd(id);
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

    // Plan CRUD endpoints.
    @GetMapping("/plans")
    @PreAuthorize("hasRole('ADMIN')")
    public List<PlanDTO> getPlans() {
        return planService.getAllPlans();
    }

    @GetMapping("/plans/active")
    @PreAuthorize("hasRole('ADMIN')")
    public List<PlanDTO> getActivePlans() {
        return planService.getActivePlans();
    }

    @PostMapping("/plans")
    @PreAuthorize("hasRole('ADMIN')")
    public PlanDTO createPlan(@RequestBody PlanDTO dto) {
        return planService.createPlan(dto);
    }

    @PutMapping("/plans/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public PlanDTO updatePlan(@PathVariable Long id, @RequestBody PlanDTO dto) {
        return planService.updatePlan(id, dto);
    }

    @DeleteMapping("/plans/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public void deletePlan(@PathVariable Long id) {
        planService.deletePlan(id);
    }

    // Public endpoint used by the home page ad sidebar.
    @GetMapping("/public-ads")
    public List<AdResponseDTO> getPublicActiveAds() {
        return adService.getPublicActiveAds();
    }
}
