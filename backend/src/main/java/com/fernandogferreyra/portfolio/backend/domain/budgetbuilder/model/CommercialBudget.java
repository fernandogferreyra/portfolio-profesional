package com.fernandogferreyra.portfolio.backend.domain.budgetbuilder.model;

import java.math.BigDecimal;
import java.util.List;

public record CommercialBudget(
    String id,
    String projectId,
    String configurationSnapshotId,
    String technicalEstimateId,
    String currency,
    BigDecimal totalHours,
    BigDecimal baseAmount,
    BigDecimal oneTimeSubtotal,
    BigDecimal monthlySubtotal,
    List<SurchargeItem> surchargeItems,
    List<DiscountItem> discountItems,
    BigDecimal finalOneTimeTotal,
    BigDecimal finalMonthlyTotal,
    String appliedSupportRuleId,
    MonthlyBreakdown monthlyBreakdown,
    List<PricingExplanationItem> pricingExplanation,
    String generatedAt
) {
}
