package com.fernandogferreyra.portfolio.backend.dto.budgetbuilder;

import java.math.BigDecimal;

public record BudgetModuleResponse(
    String id,
    String category,
    String name,
    String description,
    BigDecimal estimatedHours
) {
}
