package com.fernandogferreyra.portfolio.backend.module.quote.domain.dto;

import com.fernandogferreyra.portfolio.backend.module.quote.domain.enums.QuoteComplexity;
import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.UUID;

public record QuoteAdminSummaryResponse(
    UUID id,
    String projectType,
    QuoteComplexity complexity,
    BigDecimal totalHours,
    BigDecimal totalCost,
    BigDecimal hourlyRate,
    OffsetDateTime createdAt
) {
}
