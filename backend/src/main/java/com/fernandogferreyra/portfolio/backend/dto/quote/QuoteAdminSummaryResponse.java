package com.fernandogferreyra.portfolio.backend.dto.quote;

import com.fernandogferreyra.portfolio.backend.domain.quote.enums.QuoteComplexity;
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
