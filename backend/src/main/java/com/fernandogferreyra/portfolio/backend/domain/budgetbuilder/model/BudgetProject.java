package com.fernandogferreyra.portfolio.backend.domain.budgetbuilder.model;

import com.fernandogferreyra.portfolio.backend.domain.budgetbuilder.enums.BillingCadence;
import com.fernandogferreyra.portfolio.backend.domain.budgetbuilder.enums.BudgetComplexity;
import com.fernandogferreyra.portfolio.backend.domain.budgetbuilder.enums.BudgetModuleSelectionMode;
import com.fernandogferreyra.portfolio.backend.domain.budgetbuilder.enums.BudgetPricingMode;
import com.fernandogferreyra.portfolio.backend.domain.budgetbuilder.enums.BudgetUrgency;
import com.fernandogferreyra.portfolio.backend.domain.budgetbuilder.enums.PricingAdjustmentMode;
import java.math.BigDecimal;
import java.util.List;

public record BudgetProject(
    String id,
    String name,
    String client,
    String projectType,
    BudgetPricingMode pricingMode,
    String desiredStackId,
    BudgetComplexity complexity,
    BudgetUrgency urgency,
    List<String> selectedModuleIds,
    BudgetModuleSelectionMode moduleSelectionMode,
    List<String> selectedSurchargeRuleIds,
    Boolean supportEnabled,
    String supportPlanId,
    String maintenancePlanId,
    ManualDiscount manualDiscount,
    Integer activeClients,
    String userScaleTierId,
    Integer extraMonthlyHours,
    List<String> notes
) {
    public record ManualDiscount(
        String label,
        String reason,
        PricingAdjustmentMode mode,
        BigDecimal value,
        BillingCadence cadence
    ) {
    }
}
