package com.sbms.sbms_monolith.service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.YearMonth;
import java.util.List;

import org.springframework.stereotype.Service;

import com.sbms.sbms_monolith.dto.dashboard.OwnerEarningTransactionDTO;
import com.sbms.sbms_monolith.dto.dashboard.OwnerEarningsSummaryDTO;
import com.sbms.sbms_monolith.model.OwnerWallet;
import com.sbms.sbms_monolith.model.OwnerWalletTransaction;
import com.sbms.sbms_monolith.repository.OwnerWalletRepository;
import com.sbms.sbms_monolith.repository.OwnerWalletTransactionRepository;
import com.sbms.sbms_monolith.repository.PaymentTransactionRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class OwnerEarningsService {

    private final OwnerWalletRepository walletRepo;
    private final OwnerWalletTransactionRepository walletTxRepo;
    private final PaymentTransactionRepository paymentTxRepo;

    public OwnerEarningsSummaryDTO getSummary(Long ownerId) {

        OwnerWallet wallet = walletRepo.findByOwnerId(ownerId)
                .orElseThrow(() -> new RuntimeException("Wallet not found"));

        LocalDateTime monthStart =
                YearMonth.now().atDay(1).atStartOfDay();

        OwnerEarningsSummaryDTO dto = new OwnerEarningsSummaryDTO();
        dto.setWalletBalance(wallet.getBalance());

        dto.setTotalEarnings(walletTxRepo.totalEarnings(ownerId));
        dto.setMonthlyEarnings(walletTxRepo.earningsSince(ownerId, monthStart));

        dto.setTotalPlatformFees(paymentTxRepo.totalPlatformFees(ownerId));
        dto.setTotalGatewayFees(paymentTxRepo.totalGatewayFees(ownerId));

        return dto;
    }

    public List<OwnerEarningTransactionDTO> recentTransactions(Long ownerId) {

        return walletTxRepo
                .findTop10ByOwnerIdOrderByCreatedAtDesc(ownerId)
                .stream()
                .map(this::map)
                .toList();
    }

    private OwnerEarningTransactionDTO map(OwnerWalletTransaction tx) {

        OwnerEarningTransactionDTO dto = new OwnerEarningTransactionDTO();
        dto.setReference(tx.getReference());
        dto.setAmount(tx.getAmount());
        dto.setType(tx.getType());
        dto.setDate(tx.getCreatedAt());
        return dto;
    }
}
