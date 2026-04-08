package com.fernandogferreyra.portfolio.backend.dto.analytics;

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

