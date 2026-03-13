package com.sbms.sbms_monolith.repository;




import com.sbms.sbms_monolith.model.PaymentTransaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

public interface PaymentTransactionRepository
        extends JpaRepository<PaymentTransaction, Long> {

	Optional<PaymentTransaction> findByTransactionRef(String transactionRef);
	
    List<PaymentTransaction> findByIntentStudentId(Long studentId);
    
    @Query("""
    	    SELECT COALESCE(SUM(p.platformFee), 0)
    	    FROM PaymentTransaction p
    	    WHERE p.intent.ownerId = :ownerId
    	      AND p.status = 'SUCCESS'
    	""")
    	BigDecimal totalPlatformFees(Long ownerId);

    	@Query("""
    	    SELECT COALESCE(SUM(p.gatewayFee), 0)
    	    FROM PaymentTransaction p
    	    WHERE p.intent.ownerId = :ownerId
    	      AND p.status = 'SUCCESS'
    	""")
    	BigDecimal totalGatewayFees(Long ownerId);

}
