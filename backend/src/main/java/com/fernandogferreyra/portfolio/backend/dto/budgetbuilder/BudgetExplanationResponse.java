package com.fernandogferreyra.portfolio.backend.dto.budgetbuilder;

import java.math.BigDecimal;

public record BudgetExplanationResponse(
    String stage,
    String title,
    String description,
    BigDecimal amountDelta,
    String tone
) {
}
