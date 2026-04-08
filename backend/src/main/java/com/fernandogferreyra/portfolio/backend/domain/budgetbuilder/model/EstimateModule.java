package com.fernandogferreyra.portfolio.backend.domain.budgetbuilder.model;

import java.math.BigDecimal;
import java.util.List;

public record EstimateModule(
    String id,
    String category,
    String name,
    String description,
    int quantity,
    String tier,
    BigDecimal baseHours,
    BigDecimal complexityWeight,
    BigDecimal moduleMultiplier,
    List<String> dependencyIds,
    boolean optional,
    BigDecimal estimatedHours
) {
}
