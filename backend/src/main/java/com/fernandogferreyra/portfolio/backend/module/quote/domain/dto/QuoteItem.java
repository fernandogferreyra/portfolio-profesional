package com.fernandogferreyra.portfolio.backend.module.quote.domain.dto;

import java.math.BigDecimal;

public record QuoteItem(
    String name,
    BigDecimal hours,
    BigDecimal cost
) {
}
