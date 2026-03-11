package com.sbms.sbms_monolith.repository;

import com.sbms.sbms_monolith.model.SystemBackup;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SystemBackupRepository extends JpaRepository<SystemBackup, Long> {
    List<SystemBackup> findAllByOrderByCreatedAtDesc();
}
