package com.fernandogferreyra.portfolio.backend.dto.budgetbuilder;

import com.fasterxml.jackson.databind.JsonNode;
import com.fernandogferreyra.portfolio.backend.domain.budgetbuilder.enums.BudgetPricingMode;
import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.UUID;

public record BudgetAdminDetailResponse(
    UUID id,
    String budgetName,
    String projectType,
    BudgetPricingMode pricingMode,
    String desiredStackId,
    String configurationSnapshotId,
    String previewHash,
    BigDecimal totalHours,
    BigDecimal finalOneTimeTotal,
    BigDecimal finalMonthlyTotal,
    String currency,
    OffsetDateTime createdAt,
    JsonNode requestJson,
    JsonNode resultJson
) {
}
