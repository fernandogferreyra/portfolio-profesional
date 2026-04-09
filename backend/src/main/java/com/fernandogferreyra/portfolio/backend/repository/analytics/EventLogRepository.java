package com.fernandogferreyra.portfolio.backend.repository.analytics;

import com.fernandogferreyra.portfolio.backend.domain.analytics.entity.EventLog;
import java.util.UUID;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EventLogRepository extends JpaRepository<EventLog, UUID> {

    java.util.List<EventLog> findAllByOrderByCreatedAtDesc(Pageable pageable);
}
