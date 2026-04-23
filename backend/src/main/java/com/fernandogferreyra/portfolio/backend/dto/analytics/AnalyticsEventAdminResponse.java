package com.fernandogferreyra.portfolio.backend.dto.analytics;

import java.time.OffsetDateTime;
import java.util.UUID;

public record AnalyticsEventAdminResponse(
    UUID id,
    String type,
    String action,
    String label,
    String route,
    OffsetDateTime createdAt
) {
}
