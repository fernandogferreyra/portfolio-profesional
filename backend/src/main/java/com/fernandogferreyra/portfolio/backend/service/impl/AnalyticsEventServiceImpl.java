package com.fernandogferreyra.portfolio.backend.service.impl;

import com.fernandogferreyra.portfolio.backend.dto.analytics.AnalyticsEventRequest;
import com.fernandogferreyra.portfolio.backend.dto.analytics.AnalyticsEventAdminResponse;
import com.fernandogferreyra.portfolio.backend.dto.analytics.AnalyticsEventResponse;
import com.fernandogferreyra.portfolio.backend.domain.analytics.entity.EventLog;
import com.fernandogferreyra.portfolio.backend.mapper.analytics.AnalyticsEventMapper;
import com.fernandogferreyra.portfolio.backend.repository.analytics.EventLogRepository;
import com.fernandogferreyra.portfolio.backend.service.AnalyticsEventService;
import java.time.Clock;
import java.util.List;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.PageRequest;
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

    @Override
    @Transactional(readOnly = true)
    public List<AnalyticsEventAdminResponse> getRecentEvents(int limit) {
        int safeLimit = Math.max(1, Math.min(limit, 400));

        return eventLogRepository.findAllByOrderByCreatedAtDesc(PageRequest.of(0, safeLimit))
            .stream()
            .map(eventLog -> analyticsEventMapper.toAdminResponse(eventLog, clock))
            .toList();
    }
}
