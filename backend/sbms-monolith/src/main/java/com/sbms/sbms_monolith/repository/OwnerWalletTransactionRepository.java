package com.sbms.sbms_monolith.repository;


import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

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
}
