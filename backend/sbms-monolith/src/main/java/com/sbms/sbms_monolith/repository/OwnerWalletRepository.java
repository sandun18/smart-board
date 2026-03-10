package com.sbms.sbms_monolith.repository;


import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.sbms.sbms_monolith.model.OwnerWallet;

public interface OwnerWalletRepository
        extends JpaRepository<OwnerWallet, Long> {

    Optional<OwnerWallet> findByOwnerId(Long ownerId);
}
