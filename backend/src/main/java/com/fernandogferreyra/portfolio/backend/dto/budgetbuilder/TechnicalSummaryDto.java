package com.fernandogferreyra.portfolio.backend.dto.budgetbuilder;

import java.math.BigDecimal;

public record TechnicalSummaryDto(
    BigDecimal totalHours,
    BigDecimal totalWeeks,
    BigDecimal totalBaseAmount
) {
}
