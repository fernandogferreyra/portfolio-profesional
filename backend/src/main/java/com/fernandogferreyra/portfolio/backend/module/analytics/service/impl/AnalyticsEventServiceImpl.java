package com.fernandogferreyra.portfolio.backend.module.analytics.service.impl;

import com.fernandogferreyra.portfolio.backend.module.analytics.domain.dto.AnalyticsEventRequest;
import com.fernandogferreyra.portfolio.backend.module.analytics.domain.dto.AnalyticsEventResponse;
import com.fernandogferreyra.portfolio.backend.module.analytics.domain.entity.EventLog;
import com.fernandogferreyra.portfolio.backend.module.analytics.mapper.AnalyticsEventMapper;
import com.fernandogferreyra.portfolio.backend.module.analytics.repository.EventLogRepository;
import com.fernandogferreyra.portfolio.backend.module.analytics.service.AnalyticsEventService;
import java.time.Clock;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Slf4j
@RequiredArgsConstructor
public class AnalyticsEventServiceImpl implements AnalyticsEventService {

    private final AnalyticsEventMapper analyticsEventMapper;
    private final EventLogRepository eventLogRepository;
    private final Clock clock;

    @Override
    @Transactional
    public AnalyticsEventResponse track(AnalyticsEventRequest request) {
        EventLog eventLog = analyticsEventMapper.toEntity(request);
        EventLog savedEventLog = eventLogRepository.save(eventLog);

        log.info("Event log persisted with id={} type={} source={}",
            savedEventLog.getId(), savedEventLog.getEventType(), savedEventLog.getSource());

        return analyticsEventMapper.toResponse(savedEventLog, clock);
    }
}
