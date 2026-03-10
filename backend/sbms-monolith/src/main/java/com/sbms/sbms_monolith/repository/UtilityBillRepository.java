package com.sbms.sbms_monolith.repository;


import org.springframework.data.jpa.repository.JpaRepository;

import com.sbms.sbms_monolith.model.UtilityBill;

import java.util.List;
import java.util.Optional;

public interface UtilityBillRepository extends JpaRepository<UtilityBill, Long> {

    Optional<UtilityBill> findByBoarding_IdAndMonth(Long boardingId, String month);

    List<UtilityBill> findByBoarding_Owner_Id(Long ownerId);

    List<UtilityBill> findByBoarding_Id(Long boardingId);
    List<UtilityBill> findByMonth(String month);

}
