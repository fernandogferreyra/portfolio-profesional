package com.fernandogferreyra.portfolio.backend.dto.quote;

import com.fernandogferreyra.portfolio.backend.domain.quote.enums.QuoteComplexity;
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
