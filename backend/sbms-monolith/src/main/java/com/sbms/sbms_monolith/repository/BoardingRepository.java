package com.sbms.sbms_monolith.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.sbms.sbms_monolith.model.Boarding;

import java.util.List;

public interface BoardingRepository extends JpaRepository<Boarding, Long> {

    // Finds all boardings belonging to a specific Owner
    List<Boarding> findByOwner_Id(Long ownerId);

    long countByOwner_Id(Long ownerId);

    long deleteByOwner_Id(Long ownerId);
}
