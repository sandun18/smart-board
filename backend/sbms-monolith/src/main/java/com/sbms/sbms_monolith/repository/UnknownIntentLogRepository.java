package com.sbms.sbms_monolith.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.sbms.sbms_monolith.model.UnknownIntentLog;


public interface UnknownIntentLogRepository
extends JpaRepository<UnknownIntentLog, Long> {
}
