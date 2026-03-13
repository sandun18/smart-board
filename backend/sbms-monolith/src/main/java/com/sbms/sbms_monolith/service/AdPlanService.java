package com.sbms.sbms_monolith.service;

import com.sbms.sbms_monolith.dto.ads.PlanDTO;
import java.util.List;

public interface AdPlanService {
    List<PlanDTO> getAllPlans();
    List<PlanDTO> getActivePlans();
    PlanDTO createPlan(PlanDTO dto);
    PlanDTO updatePlan(Long id, PlanDTO dto);
    void deletePlan(Long id);
}
