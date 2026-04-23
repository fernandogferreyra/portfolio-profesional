package com.fernandogferreyra.portfolio.backend.dto.budgetbuilder;

import com.fernandogferreyra.portfolio.backend.domain.budgetbuilder.enums.BudgetPricingMode;
import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.UUID;

public record BudgetAdminSummaryResponse(
    UUID id,
    String budgetName,
    String client,
    String projectType,
    BudgetPricingMode pricingMode,
    String desiredStackId,
    BigDecimal totalHours,
    BigDecimal finalOneTimeTotal,
    BigDecimal finalMonthlyTotal,
    String currency,
    OffsetDateTime createdAt
) {
}
