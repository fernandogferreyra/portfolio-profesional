package com.fernandogferreyra.portfolio.backend.dto.budgetbuilder;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.UUID;

public record BudgetSaveResponse(
    UUID id,
    String budgetName,
    String configurationSnapshotId,
    BigDecimal finalOneTimeTotal,
    BigDecimal finalMonthlyTotal,
    OffsetDateTime createdAt
) {
}
