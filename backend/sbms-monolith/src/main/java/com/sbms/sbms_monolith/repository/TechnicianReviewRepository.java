package com.sbms.sbms_monolith.repository;

import com.sbms.sbms_monolith.model.Maintenance;
import com.sbms.sbms_monolith.model.TechnicianReview;
import com.sbms.sbms_monolith.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface TechnicianReviewRepository extends JpaRepository<TechnicianReview,Long> {
    List<TechnicianReview> findByTechnician(User technician);

    Optional<TechnicianReview> findByMaintenance(Maintenance maintenance);
}
