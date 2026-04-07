package com.fernandogferreyra.portfolio.backend.module.quote.domain.dto;

import com.fernandogferreyra.portfolio.backend.module.quote.domain.enums.QuoteComplexity;
import java.math.BigDecimal;
import java.util.List;

public record QuoteResult(
    String projectType,
    String projectLabel,
    QuoteComplexity complexity,
    BigDecimal totalHours,
    BigDecimal totalCost,
    BigDecimal hourlyRate,
    List<QuoteItem> items
) {
}
