package com.fernandogferreyra.portfolio.backend.domain.budgetbuilder.model;

import com.fernandogferreyra.portfolio.backend.domain.budgetbuilder.enums.BillingCadence;
import com.fernandogferreyra.portfolio.backend.domain.budgetbuilder.enums.PricingAdjustmentMode;
import java.math.BigDecimal;

public record SurchargeItem(
    String id,
    String code,
    String label,
    String reason,
    PricingAdjustmentMode mode,
    BigDecimal value,
    BigDecimal amount,
    BillingCadence cadence,
    String stage,
    boolean removable
) {
}
