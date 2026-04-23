package com.fernandogferreyra.portfolio.backend.dto.quote;

import java.math.BigDecimal;

public record QuoteItem(
    String name,
    BigDecimal hours,
    BigDecimal cost,
    BigDecimal optimisticHours,
    BigDecimal probableHours,
    BigDecimal pessimisticHours,
    java.util.List<String> dependencyIds,
    String dependencyNote
) {
}
