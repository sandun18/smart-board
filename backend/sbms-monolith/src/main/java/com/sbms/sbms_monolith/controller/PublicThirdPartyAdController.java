package com.sbms.sbms_monolith.controller;

import com.sbms.sbms_monolith.dto.ads.AdCreateDTO;
import com.sbms.sbms_monolith.dto.ads.AdResponseDTO;
import com.sbms.sbms_monolith.dto.ads.PlanDTO;
import com.sbms.sbms_monolith.service.ThirdPartyAdService;
import com.sbms.sbms_monolith.service.AdPlanService;
import com.sbms.sbms_monolith.service.S3Service;
import com.sbms.sbms_monolith.model.AdPlan;
import com.sbms.sbms_monolith.repository.AdPlanRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/third-party-ads")
public class PublicThirdPartyAdController {

    @Autowired
    private ThirdPartyAdService adService;

    @Autowired
    private S3Service s3Service;

    @Autowired
    private AdPlanRepository adPlanRepository;

    @Autowired
    private AdPlanService adPlanService;

    // Get active pricing plans for ad submission form
    @GetMapping("/plans")
    public List<PlanDTO> getActivePlans() {
        return adPlanService.getActivePlans();
    }

    // Public ads endpoint used by home page sidebar
    @GetMapping("/public-ads")
    public List<AdResponseDTO> getPublicActiveAds() {
        return adService.getPublicActiveAds();
    }

    // Public submission endpoint used by the Home page (multipart/form-data)
    @PostMapping("/submit")
    public AdResponseDTO submitAd(
            @RequestParam String companyName,
            @RequestParam String email,
            @RequestParam String phone,
            @RequestParam(name = "adTitle") String title,
            @RequestParam(name = "adDescription", required = false) String description,
            @RequestParam(name = "website", required = false) String website,
            @RequestParam(name = "planId", required = false) Long planId,
            @RequestParam(name = "image", required = false) MultipartFile image
    ) {
        AdCreateDTO dto = new AdCreateDTO();
        dto.setTitle(title);
        dto.setCompanyName(companyName);
        dto.setRedirectUrl(website);
        // Ensure contact and description fields from the public form are stored
        dto.setDescription(description);
        dto.setEmail(email);
        dto.setPhone(phone);

        if (image != null && !image.isEmpty()) {
            String url = s3Service.uploadFile(image, "third-party-ads/");
            dto.setBannerImageUrl(url);
        } else {
            dto.setBannerImageUrl(null);
        }

        // Fetch plan details if planId is provided
        if (planId != null) {
            AdPlan plan = adPlanRepository.findById(planId).orElse(null);
            if (plan != null) {
                dto.setPlanName(plan.getName());
                dto.setPlanPrice(plan.getPrice());
                // Set expiry based on plan duration
                if (plan.getDurationDays() != null) {
                    dto.setExpiryDate(LocalDateTime.now().plusDays(plan.getDurationDays()));
                } else {
                    dto.setExpiryDate(LocalDateTime.now().plusMonths(1));
                }
            } else {
                dto.setExpiryDate(LocalDateTime.now().plusMonths(1));
                dto.setPlanName(null);
                dto.setPlanPrice(null);
            }
        } else {
            dto.setExpiryDate(LocalDateTime.now().plusMonths(1));
            dto.setPlanName(null);
            dto.setPlanPrice(null);
        }

        return adService.submitAd(dto);
    }

}
