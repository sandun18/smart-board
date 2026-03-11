package com.sbms.sbms_monolith.repository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.sbms.sbms_monolith.dto.dashboard.ChartDataDTO;
import com.sbms.sbms_monolith.model.OwnerWalletTransaction;

public interface OwnerWalletTransactionRepository
		extends JpaRepository<OwnerWalletTransaction, Long> {

	List<OwnerWalletTransaction> findTop10ByOwnerIdOrderByCreatedAtDesc(Long ownerId);

	@Query("""
			    SELECT COALESCE(SUM(t.amount), 0)
			    FROM OwnerWalletTransaction t
			    WHERE t.ownerId = :ownerId
			      AND t.type = 'CREDIT'
			""")
	BigDecimal totalEarnings(Long ownerId);

	@Query("""
			    SELECT COALESCE(SUM(t.amount), 0)
			    FROM OwnerWalletTransaction t
			    WHERE t.ownerId = :ownerId
			      AND t.type = 'CREDIT'
			      AND t.createdAt >= :startDate
			""")
	BigDecimal earningsSince(Long ownerId, LocalDateTime startDate);

	@Query("""
			    SELECT new com.sbms.sbms_monolith.dto.dashboard.ChartDataDTO(
			        TO_CHAR(t.createdAt, 'Mon'),
			        SUM(t.amount)
			    )
			    FROM OwnerWalletTransaction t
			    WHERE t.ownerId = :ownerId
			      AND t.type = 'CREDIT'
			      AND t.createdAt >= CURRENT_DATE - 6 MONTH
			    GROUP BY TO_CHAR(t.createdAt, 'Mon'), EXTRACT(MONTH FROM t.createdAt)
			    ORDER BY EXTRACT(MONTH FROM t.createdAt)
			""")
	List<ChartDataDTO> getMonthlyEarnings(@Param("ownerId") Long ownerId);
}
