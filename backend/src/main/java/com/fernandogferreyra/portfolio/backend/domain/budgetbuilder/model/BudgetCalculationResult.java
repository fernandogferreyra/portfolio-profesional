package com.fernandogferreyra.portfolio.backend.domain.budgetbuilder.model;

import java.util.List;

public record BudgetCalculationResult(
    List<EstimateModule> modules,
    TechnicalEstimate technicalEstimate,
    CommercialBudget commercialBudget
) {
}
