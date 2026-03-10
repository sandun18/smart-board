package com.sbms.sbms_monolith.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.sbms.sbms_monolith.model.MonthlyBill;
import com.sbms.sbms_monolith.model.enums.MonthlyBillStatus;

import java.util.List;
import java.util.Optional;

public interface MonthlyBillRepository extends JpaRepository<MonthlyBill, Long> {

    Optional<MonthlyBill> findByStudent_IdAndBoarding_IdAndMonth(
            Long studentId,
            Long boardingId,
            String month
    );

    List<MonthlyBill> findByStudent_Id(Long studentId);

    List<MonthlyBill> findByBoarding_Owner_Id(Long ownerId);
    
    Optional<MonthlyBill> findById(Long id);
    
    Optional<MonthlyBill> findByStudentIdAndBoardingIdAndStatus(
            Long studentId,
            Long boardingId,
            MonthlyBillStatus status
    );
}
