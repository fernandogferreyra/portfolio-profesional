package com.fernandogferreyra.portfolio.backend.dto.quote;

import java.math.BigDecimal;

public record QuoteItem(
    String name,
    BigDecimal hours,
    BigDecimal cost
) {
}
