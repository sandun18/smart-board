package com.sbms.sbms_monolith.service;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import org.springframework.stereotype.Service;

import com.sbms.sbms_monolith.model.OwnerWallet;
import com.sbms.sbms_monolith.model.OwnerWalletTransaction;
import com.sbms.sbms_monolith.repository.OwnerWalletRepository;
import com.sbms.sbms_monolith.repository.OwnerWalletTransactionRepository;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class OwnerWalletService {

    private final OwnerWalletRepository walletRepo;
    private final OwnerWalletTransactionRepository txRepo;

    @Transactional
    public void credit(Long ownerId, BigDecimal amount, String reference) {

        OwnerWallet wallet = walletRepo.findByOwnerId(ownerId)
                .orElseGet(() -> {
                    OwnerWallet w = new OwnerWallet();
                    w.setOwnerId(ownerId);
                    w.setBalance(BigDecimal.ZERO);
                    w.setLastUpdated(LocalDateTime.now());
                    return walletRepo.save(w);
                });

        wallet.setBalance(wallet.getBalance().add(amount));
        wallet.setLastUpdated(LocalDateTime.now());
        walletRepo.save(wallet);

        OwnerWalletTransaction tx = new OwnerWalletTransaction();
        tx.setOwnerId(ownerId);
        tx.setAmount(amount);
        tx.setReference(reference);
        tx.setType("CREDIT");
        txRepo.save(tx);
    }
}
