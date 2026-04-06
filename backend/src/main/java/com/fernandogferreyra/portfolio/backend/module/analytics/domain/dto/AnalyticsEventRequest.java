package com.fernandogferreyra.portfolio.backend.module.analytics.domain.dto;

import com.fernandogferreyra.portfolio.backend.domain.enums.EventType;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.util.Map;

public record AnalyticsEventRequest(
    @NotNull(message = "Event type is required")
    EventType eventType,

    @Size(max = 255, message = "Path must be at most 255 characters")
    String path,

    @Size(max = 120, message = "Source must be at most 120 characters")
    String source,

    @Size(max = 120, message = "Reference must be at most 120 characters")
    String reference,

    Map<String, String> metadata
) {
}

