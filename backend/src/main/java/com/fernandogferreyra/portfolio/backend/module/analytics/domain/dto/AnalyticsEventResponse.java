package com.fernandogferreyra.portfolio.backend.module.analytics.domain.dto;

import com.fernandogferreyra.portfolio.backend.domain.enums.EventType;
import java.time.OffsetDateTime;
import java.util.UUID;

public record AnalyticsEventResponse(
    UUID id,
    EventType eventType,
    String status,
    OffsetDateTime createdAt
) {
}

