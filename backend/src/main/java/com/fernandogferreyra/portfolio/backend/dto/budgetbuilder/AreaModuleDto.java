package com.fernandogferreyra.portfolio.backend.dto.budgetbuilder;

import java.math.BigDecimal;

public record AreaModuleDto(
    String id,
    String name,
    BigDecimal estimatedHours,
    BigDecimal baseAmount
) {
}
