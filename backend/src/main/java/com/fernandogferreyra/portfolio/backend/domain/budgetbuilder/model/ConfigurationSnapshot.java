package com.fernandogferreyra.portfolio.backend.domain.budgetbuilder.model;

import com.fernandogferreyra.portfolio.backend.domain.budgetbuilder.enums.BillingCadence;
import com.fernandogferreyra.portfolio.backend.domain.budgetbuilder.enums.BudgetComplexity;
import com.fernandogferreyra.portfolio.backend.domain.budgetbuilder.enums.PricingAdjustmentMode;
import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

public record ConfigurationSnapshot(
    String id,
    String version,
    String source,
    String currency,
    String createdAt,
    int workingHoursPerWeek,
    HourlyRateConfig hourlyRate,
    BigDecimal commercialMultiplier,
    BigDecimal minimumBudget,
    RoundingRules roundingRules,
    List<EstimateModule> moduleCatalog,
    List<TechnologyRule> technologyCatalog,
    List<SurchargeRule> surchargeRules,
    List<SupportRule> supportRules,
    List<ProjectTypeDefaultRule> projectTypeDefaults,
    Map<String, BigDecimal> projectMultipliers,
    Map<String, BigDecimal> stackMultipliers,
    Map<BudgetComplexity, BigDecimal> complexityMultipliers
) {
    public record HourlyRateConfig(
        BigDecimal base,
        BigDecimal supportHourlyRate,
        BigDecimal extraHourRate
    ) {
    }

    public record RoundingRules(
        TechnicalRounding technical,
        CommercialRounding commercial
    ) {
    }

    public enum TechnicalRounding {
        ROUND_NEAREST_HOUR,
        NONE
    }

    public enum CommercialRounding {
        ROUND_UP_INTEGER,
        ROUND_2_DECIMALS,
        NONE
    }

    public record TechnologyRule(
        String id,
        String label,
        BigDecimal multiplier,
        String surchargeRuleId,
        List<String> supportedProjectTypes
    ) {
    }

    public record SurchargeRule(
        String id,
        String code,
        String label,
        String reason,
        PricingAdjustmentMode mode,
        BigDecimal value,
        BillingCadence appliesTo,
        String stage,
        boolean enabledByDefault
    ) {
    }

    public record SupportRule(
        String id,
        String label,
        BillingCadence cadence,
        BigDecimal includedHours,
        BigDecimal hourlyRate,
        BigDecimal monthlyAmount,
        boolean enabledByDefault
    ) {
    }

    public record ProjectTypeDefaultRule(
        String projectType,
        List<String> defaultModuleIds,
        List<String> defaultSurchargeRuleIds,
        String defaultSupportRuleId,
        String defaultMaintenanceRuleId
    ) {
    }
}
