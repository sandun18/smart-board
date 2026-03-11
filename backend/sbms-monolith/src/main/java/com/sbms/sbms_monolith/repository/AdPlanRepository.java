package com.sbms.sbms_monolith.repository;

import com.sbms.sbms_monolith.model.AdPlan;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface AdPlanRepository extends JpaRepository<AdPlan, Long> {
    List<AdPlan> findByActiveTrue();
}
