package com.sbms.sbms_monolith.service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.YearMonth;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.sbms.sbms_monolith.dto.dashboard.ChartDataDTO;
import com.sbms.sbms_monolith.dto.dashboard.OwnerEarningTransactionDTO;
import com.sbms.sbms_monolith.dto.dashboard.OwnerEarningsSummaryDTO;
import com.sbms.sbms_monolith.model.OwnerWallet;
import com.sbms.sbms_monolith.model.OwnerWalletTransaction;
import com.sbms.sbms_monolith.model.PaymentTransaction;
import com.sbms.sbms_monolith.repository.BoardingRepository;
import com.sbms.sbms_monolith.repository.OwnerWalletRepository;
import com.sbms.sbms_monolith.repository.OwnerWalletTransactionRepository;
import com.sbms.sbms_monolith.repository.PaymentTransactionRepository;
import com.sbms.sbms_monolith.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class OwnerEarningsService {

    private final OwnerWalletRepository walletRepo;
    private final OwnerWalletTransactionRepository walletTxRepo;
    private final PaymentTransactionRepository paymentTxRepo;

    private final UserRepository userRepo;
    private final BoardingRepository boardingRepo;

    public OwnerEarningsSummaryDTO getSummary(Long ownerId) {

        OwnerWallet wallet = walletRepo.findByOwnerId(ownerId)
                .orElseThrow(() -> new RuntimeException("Wallet not found"));

        LocalDateTime monthStart = YearMonth.now().atDay(1).atStartOfDay();

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

    // =========================================================================
    // ✅ NEW METHODS FOR REACT DASHBOARD
    // =========================================================================

    /**
     * 1. CHART DATA (Monthly Revenue)
     */
    public List<ChartDataDTO> getRevenueChartData(Long ownerId) {
        return walletTxRepo.getMonthlyEarnings(ownerId);
    }

    /**
     * 2. DASHBOARD TRANSACTIONS (Rich Data with Tenant Name & Property)
     */
    public List<OwnerEarningTransactionDTO> getDashboardTransactions(Long ownerId) {
        List<PaymentTransaction> transactions = paymentTxRepo.findRecentByOwner(ownerId);

        return transactions.stream().map(pt -> {
            OwnerEarningTransactionDTO dto = new OwnerEarningTransactionDTO();

            dto.setReference(pt.getTransactionRef());
            dto.setAmount(pt.getAmount());
            dto.setType("CREDIT");
            dto.setDate(pt.getPaidAt());
            dto.setStatus(pt.getStatus() != null ? pt.getStatus().toString() : "UNKNOWN");

            // Look up Details using IDs from PaymentIntent
            if (pt.getIntent() != null) {

                // ✅ UPDATED: Find Student using UserRepository + getFullName()
                Long studentId = pt.getIntent().getStudentId();
                userRepo.findById(studentId).ifPresent(user -> dto.setTenantName(user.getFullName()) // Corrected to
                                                                                                     // match your
                                                                                                     // Entity
                );

                // Find Property Title
                Long boardingId = pt.getIntent().getBoardingId();
                boardingRepo.findById(boardingId).ifPresent(boarding -> dto.setPropertyTitle(boarding.getTitle()));
            }
            return dto;
        }).collect(Collectors.toList());
    }
}
