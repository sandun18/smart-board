package com.sbms.sbms_monolith.repository;

import com.sbms.sbms_monolith.model.ThirdPartyAd;
import com.sbms.sbms_monolith.model.enums.AdStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDateTime;
import java.util.List;

public interface ThirdPartyAdRepository extends JpaRepository<ThirdPartyAd, Long> {
    List<ThirdPartyAd> findByStatus(AdStatus status);
    List<ThirdPartyAd> findByExpiryDateBeforeAndStatus(LocalDateTime now, AdStatus status);
}