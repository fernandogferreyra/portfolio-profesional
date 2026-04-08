package com.fernandogferreyra.portfolio.backend.domain.budgetbuilder.model;

import java.math.BigDecimal;
import java.util.List;

public record PricingExplanationItem(
    String id,
    String stage,
    String title,
    String description,
    BigDecimal amountDelta,
    List<String> relatedCodes,
    String tone
) {
}
