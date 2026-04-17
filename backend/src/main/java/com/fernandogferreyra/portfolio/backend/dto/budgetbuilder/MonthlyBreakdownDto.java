package com.fernandogferreyra.portfolio.backend.dto.budgetbuilder;

import java.math.BigDecimal;

public record MonthlyBreakdownDto(
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
