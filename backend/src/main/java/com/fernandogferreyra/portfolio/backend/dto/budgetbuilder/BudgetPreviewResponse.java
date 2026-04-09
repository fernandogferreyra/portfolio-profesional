package com.fernandogferreyra.portfolio.backend.dto.budgetbuilder;

import java.math.BigDecimal;
import java.util.List;

public record BudgetPreviewResponse(
    String configurationSnapshotId,
    String previewHash,
    String currency,
    BigDecimal totalHours,
    BigDecimal totalWeeks,
    BigDecimal baseAmount,
    BigDecimal oneTimeSubtotal,
    BigDecimal monthlySubtotal,
    BigDecimal finalOneTimeTotal,
    BigDecimal finalMonthlyTotal,
    List<BudgetModuleResponse> modules,
    List<BudgetSurchargeResponse> surcharges,
    List<BudgetDiscountResponse> discounts,
    List<BudgetExplanationResponse> explanation
) {
}
