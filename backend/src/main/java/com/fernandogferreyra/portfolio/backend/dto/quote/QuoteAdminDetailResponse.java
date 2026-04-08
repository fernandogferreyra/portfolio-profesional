package com.fernandogferreyra.portfolio.backend.dto.quote;

import com.fasterxml.jackson.databind.JsonNode;
import com.fernandogferreyra.portfolio.backend.domain.quote.enums.QuoteComplexity;
import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.UUID;

public record QuoteAdminDetailResponse(
    UUID id,
    String projectType,
    QuoteComplexity complexity,
    BigDecimal totalHours,
    BigDecimal totalCost,
    BigDecimal hourlyRate,
    OffsetDateTime createdAt,
    JsonNode requestJson,
    JsonNode resultJson
) {
}
