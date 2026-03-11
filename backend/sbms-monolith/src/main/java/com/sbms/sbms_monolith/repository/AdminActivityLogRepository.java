package com.sbms.sbms_monolith.repository;

import com.sbms.sbms_monolith.model.AdminActivityLog;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AdminActivityLogRepository extends JpaRepository<AdminActivityLog, Long> {
    List<AdminActivityLog> findTop200ByOrderByCreatedAtDesc();
}
