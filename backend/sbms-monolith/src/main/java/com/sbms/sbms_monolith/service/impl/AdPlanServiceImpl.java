package com.sbms.sbms_monolith.service.impl;

import com.sbms.sbms_monolith.dto.ads.PlanDTO;
import com.sbms.sbms_monolith.model.AdPlan;
import com.sbms.sbms_monolith.repository.AdPlanRepository;
import com.sbms.sbms_monolith.service.AdPlanService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class AdPlanServiceImpl implements AdPlanService {

    private final AdPlanRepository planRepository;

    public AdPlanServiceImpl(AdPlanRepository planRepository) {
        this.planRepository = planRepository;
    }

    private PlanDTO toDto(AdPlan p) {
        PlanDTO dto = new PlanDTO();
        dto.setId(p.getId());
        dto.setName(p.getName());
        dto.setPrice(p.getPrice());
        dto.setDurationDays(p.getDurationDays());
        dto.setDescription(p.getDescription());
        dto.setActive(p.isActive());
        dto.setFeatures(p.getFeatures());
        return dto;
    }

    private AdPlan fromDto(PlanDTO dto) {
        AdPlan p = new AdPlan();
        p.setName(dto.getName());
        p.setPrice(dto.getPrice());
        p.setDurationDays(dto.getDurationDays());
        p.setDescription(dto.getDescription());
        p.setActive(dto.isActive());
        if (dto.getFeatures() != null) p.setFeatures(dto.getFeatures());
        return p;
    }

    @Override
    public List<PlanDTO> getAllPlans() {
        return planRepository.findAll().stream().map(this::toDto).collect(Collectors.toList());
    }

    @Override
    public List<PlanDTO> getActivePlans() {
        return planRepository.findByActiveTrue().stream().map(this::toDto).collect(Collectors.toList());
    }

    @Override
    public PlanDTO createPlan(PlanDTO dto) {
        AdPlan p = fromDto(dto);
        AdPlan saved = planRepository.save(p);
        return toDto(saved);
    }

    @Override
    public PlanDTO updatePlan(Long id, PlanDTO dto) {
        AdPlan existing = planRepository.findById(id).orElseThrow(() -> new RuntimeException("Plan not found"));
        existing.setName(dto.getName());
        existing.setPrice(dto.getPrice());
        existing.setDurationDays(dto.getDurationDays());
        existing.setDescription(dto.getDescription());
        existing.setActive(dto.isActive());
        AdPlan saved = planRepository.save(existing);
        return toDto(saved);
    }

    @Override
    public void deletePlan(Long id) {
        planRepository.deleteById(id);
    }
}
