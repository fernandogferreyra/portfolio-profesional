package com.fernandogferreyra.portfolio.backend.domain.budgetbuilder.model;

import com.fernandogferreyra.portfolio.backend.domain.budgetbuilder.enums.BillingCadence;
import com.fernandogferreyra.portfolio.backend.domain.budgetbuilder.enums.BudgetComplexity;
import com.fernandogferreyra.portfolio.backend.domain.budgetbuilder.enums.CategoryBillingType;
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
    BigDecimal riskBufferHours,
    HourlyRateConfig hourlyRate,
    BigDecimal commercialMultiplier,
    BigDecimal minimumBudget,
    RoundingRules roundingRules,
    List<EstimateModule> moduleCatalog,
    List<CategoryRule> categoryRules,
    List<TechnologyRule> technologyCatalog,
    List<SurchargeRule> surchargeRules,
    List<SupportRule> supportRules,
    List<MaintenanceRule> maintenanceRules,
    List<UserScaleRule> userScaleRules,
    SaasPricingRules saasPricing,
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
        String description,
        BigDecimal multiplier,
        String surchargeRuleId,
        List<String> supportedProjectTypes
    ) {
    }

    public record CategoryRule(
        String id,
        String label,
        CategoryBillingType billingType,
        BigDecimal rate,
        BillingCadence cadence
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

    public record MaintenanceRule(
        String id,
        String label,
        BillingCadence cadence,
        BigDecimal monthlyAmount,
        boolean enabledByDefault
    ) {
    }

    public record UserScaleRule(
        String id,
        String label,
        Integer minUsers,
        Integer maxUsers,
        PricingAdjustmentMode mode,
        BigDecimal value
    ) {
    }

    public record SaasPricingRules(
        Integer recoveryMonths,
        BigDecimal monthlyInfrastructureCost,
        BigDecimal marginPercentage
    ) {
    }

    public record ProjectTypeDefaultRule(
        String projectType,
        String label,
        String description,
        List<String> defaultModuleIds,
        List<String> defaultSurchargeRuleIds,
        String defaultSupportRuleId,
        String defaultMaintenanceRuleId
    ) {
    }
}
