package com.fernandogferreyra.portfolio.backend.domain.budgetbuilder.model;

import java.math.BigDecimal;

public record MonthlyBreakdown(
    BigDecimal developmentRecovery,
    BigDecimal infrastructure,
    BigDecimal support,
    BigDecimal maintenance,
    BigDecimal userScaleAdjustment,
    BigDecimal extraHours,
    BigDecimal margin,
    BigDecimal monthlySubtotal,
    BigDecimal finalMonthlyTotal
) {
}
