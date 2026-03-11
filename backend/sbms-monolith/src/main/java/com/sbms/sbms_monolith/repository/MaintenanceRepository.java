package com.sbms.sbms_monolith.repository;


import org.springframework.data.jpa.repository.JpaRepository;

import com.sbms.sbms_monolith.model.Maintenance;
import com.sbms.sbms_monolith.model.User;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface MaintenanceRepository extends JpaRepository<Maintenance, Long> {

    List<Maintenance> findByStudent(User student);

    List<Maintenance> findByBoarding_Owner(User owner);
    
    int countByRegistration_IdAndStatus(Long regId, String status);

    Maintenance findTopByRegistration_IdOrderByCreatedAtDesc(Long regId);

    List<Maintenance> findByAssignedTechnician_Id(Long technicianId);

    @Query("SELECT COUNT(m) > 0 FROM Maintenance m " +
            "WHERE (m.boarding.owner.id = :userId1 AND m.assignedTechnician.id = :userId2) " +
            "OR (m.boarding.owner.id = :userId2 AND m.assignedTechnician.id = :userId1) " +
            "AND m.status IN ('ASSIGNED', 'IN_PROGRESS', 'WORK_DONE', 'PAYMENT_PENDING', 'PAID', 'COMPLETED')")
    boolean existsByConnection(@Param("userId1") Long userId1, @Param("userId2") Long userId2);
}
