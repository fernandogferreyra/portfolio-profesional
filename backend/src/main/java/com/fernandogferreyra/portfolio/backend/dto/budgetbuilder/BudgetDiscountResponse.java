package com.fernandogferreyra.portfolio.backend.dto.budgetbuilder;

import java.math.BigDecimal;

public record BudgetDiscountResponse(
    String code,
    String label,
    String reason,
    String cadence,
    BigDecimal amount
) {
}
