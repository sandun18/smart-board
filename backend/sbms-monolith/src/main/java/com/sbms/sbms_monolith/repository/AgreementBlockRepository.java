package com.sbms.sbms_monolith.repository;


import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.sbms.sbms_monolith.model.AgreementBlock;

public interface AgreementBlockRepository
extends JpaRepository<AgreementBlock, Long> {

	Optional<AgreementBlock> findTopByOrderByIdDesc();

    Optional<AgreementBlock> findByRegistrationId(Long registrationId);

    List<AgreementBlock> findAllByOrderByIdAsc();

    Optional<AgreementBlock>
    findTopByIdLessThanOrderByIdDesc(Long id);
}
