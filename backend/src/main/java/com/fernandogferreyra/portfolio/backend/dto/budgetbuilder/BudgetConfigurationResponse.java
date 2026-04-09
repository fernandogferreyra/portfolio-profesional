package com.fernandogferreyra.portfolio.backend.dto.budgetbuilder;

import com.fernandogferreyra.portfolio.backend.domain.budgetbuilder.enums.BillingCadence;
import com.fernandogferreyra.portfolio.backend.domain.budgetbuilder.enums.BudgetComplexity;
import com.fernandogferreyra.portfolio.backend.domain.budgetbuilder.enums.CategoryBillingType;
import com.fernandogferreyra.portfolio.backend.domain.budgetbuilder.enums.PricingAdjustmentMode;
import java.math.BigDecimal;
import java.util.List;

public record BudgetConfigurationResponse(
    String configurationSnapshotId,
    String version,
    String source,
    String currency,
    String createdAt,
    int workingHoursPerWeek,
    BigDecimal defaultHourlyRate,
    BigDecimal supportHourlyRate,
    BigDecimal extraHourRate,
    BigDecimal riskBufferHours,
    List<ProjectTypeDefaultResponse> projectTypeDefaults,
    List<ModuleCatalogItemResponse> modules,
    List<CategoryRuleResponse> categories,
    List<TechnologyOptionResponse> technologies,
    List<SurchargeRuleResponse> surchargeRules,
    List<SupportPlanResponse> supportPlans,
    List<MaintenancePlanResponse> maintenancePlans,
    List<UserScaleTierResponse> userScaleTiers,
    List<BudgetComplexity> complexityOptions
) {
    public record ProjectTypeDefaultResponse(
        String projectType,
        String label,
        String description,
        List<String> defaultModuleIds,
        List<String> defaultSurchargeRuleIds,
        String defaultSupportRuleId,
        String defaultMaintenanceRuleId
    ) {
    }

    public record ModuleCatalogItemResponse(
        String id,
        String category,
        String name,
        String description,
        BigDecimal baseHours,
        BigDecimal optimisticHours,
        BigDecimal probableHours,
        BigDecimal pessimisticHours,
        List<String> dependencyIds,
        String blockingNote,
        boolean optional
    ) {
    }

    public record CategoryRuleResponse(
        String id,
        String label,
        CategoryBillingType billingType,
        BigDecimal rate,
        BillingCadence cadence
    ) {
    }

    public record TechnologyOptionResponse(
        String id,
        String label,
        String description,
        String surchargeRuleId,
        List<String> supportedProjectTypes
    ) {
    }

    public record SurchargeRuleResponse(
        String id,
        String code,
        String label,
        String reason,
        PricingAdjustmentMode mode,
        BillingCadence appliesTo,
        BigDecimal value,
        boolean enabledByDefault
    ) {
    }

    public record SupportPlanResponse(
        String id,
        String label,
        BillingCadence cadence,
        BigDecimal includedHours,
        BigDecimal hourlyRate,
        BigDecimal monthlyAmount
    ) {
    }

    public record MaintenancePlanResponse(
        String id,
        String label,
        BillingCadence cadence,
        BigDecimal monthlyAmount
    ) {
    }

    public record UserScaleTierResponse(
        String id,
        String label,
        Integer minUsers,
        Integer maxUsers,
        PricingAdjustmentMode mode,
        BigDecimal value
    ) {
    }
}
