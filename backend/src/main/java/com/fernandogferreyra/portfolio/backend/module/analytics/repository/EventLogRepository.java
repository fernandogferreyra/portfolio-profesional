package com.fernandogferreyra.portfolio.backend.module.analytics.repository;

import com.fernandogferreyra.portfolio.backend.module.analytics.domain.entity.EventLog;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EventLogRepository extends JpaRepository<EventLog, UUID> {
}
