package com.fernandogferreyra.portfolio.backend.domain.budgetbuilder.engine;

import com.fernandogferreyra.portfolio.backend.domain.budgetbuilder.enums.BillingCadence;
import com.fernandogferreyra.portfolio.backend.domain.budgetbuilder.enums.CategoryBillingType;
import com.fernandogferreyra.portfolio.backend.domain.budgetbuilder.enums.PricingAdjustmentMode;
import com.fernandogferreyra.portfolio.backend.domain.budgetbuilder.model.BudgetProject;
import com.fernandogferreyra.portfolio.backend.domain.budgetbuilder.model.CommercialBudget;
import com.fernandogferreyra.portfolio.backend.domain.budgetbuilder.model.ConfigurationSnapshot;
import com.fernandogferreyra.portfolio.backend.domain.budgetbuilder.model.DiscountItem;
import com.fernandogferreyra.portfolio.backend.domain.budgetbuilder.model.MonthlyBreakdown;
import com.fernandogferreyra.portfolio.backend.domain.budgetbuilder.model.PricingExplanationItem;
import com.fernandogferreyra.portfolio.backend.domain.budgetbuilder.model.SurchargeItem;
import com.fernandogferreyra.portfolio.backend.domain.budgetbuilder.model.TechnicalEstimate;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Objects;
import java.util.Set;
import org.springframework.stereotype.Component;

@Component
public class BudgetCommercialPricer {

    public CommercialBudget calculate(
        BudgetProject project,
        ConfigurationSnapshot configuration,
        TechnicalEstimate technicalEstimate
    ) {
        boolean hasWork = !technicalEstimate.modules().isEmpty();
        CommercialBase commercialBase = calculateCommercialBase(technicalEstimate, configuration);
        List<SurchargeItem> surchargeItems = applySimpleSurcharges(
            commercialBase.baseAmount(),
            project,
            configuration,
            hasWork
        );
        BigDecimal surchargeTotal = surchargeItems.stream()
            .map(SurchargeItem::amount)
            .reduce(BigDecimal.ZERO, BigDecimal::add);
        SupportApplication supportApplication = applyBasicSupport(project, configuration, hasWork);
        MaintenanceApplication maintenanceApplication = applyMaintenance(project, configuration, hasWork);
        SaasApplication saasApplication = applySaasPricing(
            project,
            configuration,
            hasWork,
            commercialBase.baseAmount().add(surchargeTotal),
            supportApplication.monthlyAmount().add(maintenanceApplication.monthlyAmount())
        );
        BigDecimal monthlyBaseAmount = saasApplication.monthlyAmount() != null
            ? saasApplication.monthlyAmount()
            : supportApplication.monthlyAmount().add(maintenanceApplication.monthlyAmount());
        List<DiscountItem> discountItems = applyManualDiscounts(
            commercialBase.baseAmount().add(surchargeTotal),
            monthlyBaseAmount,
            project
        );
        BigDecimal oneTimeDiscountTotal = discountItems.stream()
            .filter(item -> item.cadence() == BillingCadence.ONE_TIME)
            .map(DiscountItem::amount)
            .reduce(BigDecimal.ZERO, BigDecimal::add);
        BigDecimal monthlyDiscountTotal = discountItems.stream()
            .filter(item -> item.cadence() == BillingCadence.MONTHLY)
            .map(DiscountItem::amount)
            .reduce(BigDecimal.ZERO, BigDecimal::add);
        BigDecimal finalOneTimeTotal = BudgetCalculationUtils.roundCommercialValue(
            BudgetCalculationUtils.clampMinimum(
                commercialBase.baseAmount().add(surchargeTotal).subtract(oneTimeDiscountTotal),
                configuration.minimumBudget()),
            configuration.roundingRules().commercial());
        BigDecimal finalMonthlyTotal = BudgetCalculationUtils.roundCommercialValue(
            monthlyBaseAmount.subtract(monthlyDiscountTotal).max(BigDecimal.ZERO),
            configuration.roundingRules().commercial());
        MonthlyBreakdown monthlyBreakdown = buildMonthlyBreakdown(
            project,
            supportApplication,
            maintenanceApplication,
            saasApplication,
            monthlyBaseAmount,
            finalMonthlyTotal
        );

        return new CommercialBudget(
            project.id() + "-commercial-budget",
            project.id(),
            configuration.id(),
            technicalEstimate.id(),
            configuration.currency(),
            technicalEstimate.totalHours(),
            commercialBase.baseAmount(),
            commercialBase.baseAmount(),
            monthlyBaseAmount,
            surchargeItems,
            discountItems,
            finalOneTimeTotal,
            finalMonthlyTotal,
            supportApplication.supportRuleId(),
            monthlyBreakdown,
            buildExplanation(
                technicalEstimate,
                commercialBase,
                surchargeItems,
                discountItems,
                supportApplication,
                maintenanceApplication,
                saasApplication
            ),
            configuration.createdAt()
        );
    }

    private MonthlyBreakdown buildMonthlyBreakdown(
        BudgetProject project,
        SupportApplication supportApplication,
        MaintenanceApplication maintenanceApplication,
        SaasApplication saasApplication,
        BigDecimal monthlyBaseAmount,
        BigDecimal finalMonthlyTotal
    ) {
        if (project.pricingMode() != com.fernandogferreyra.portfolio.backend.domain.budgetbuilder.enums.BudgetPricingMode.SAAS
            || saasApplication.monthlyAmount() == null) {
            return null;
        }

        return new MonthlyBreakdown(
            saasApplication.developmentRecovery(),
            saasApplication.infrastructure(),
            supportApplication.monthlyAmount(),
            maintenanceApplication.monthlyAmount(),
            saasApplication.userScaleAdjustment(),
            saasApplication.extraHours(),
            saasApplication.margin(),
            monthlyBaseAmount,
            finalMonthlyTotal
        );
    }

    private CommercialBase calculateCommercialBase(
        TechnicalEstimate technicalEstimate,
        ConfigurationSnapshot configuration
    ) {
        List<PricingExplanationItem> explanation = new ArrayList<>();
        BigDecimal total = BigDecimal.ZERO;

        for (ConfigurationSnapshot.CategoryRule categoryRule : configuration.categoryRules()) {
            BigDecimal amount = calculateCategoryAmount(categoryRule, technicalEstimate, configuration);
            if (amount.compareTo(BigDecimal.ZERO) <= 0) {
                continue;
            }

            total = total.add(amount);
            explanation.add(new PricingExplanationItem(
                technicalEstimate.id() + "-" + categoryRule.id(),
                "COMMERCIAL",
                categoryRule.label(),
                buildCategoryExplanation(categoryRule, technicalEstimate),
                amount,
                technicalEstimate.modules().stream()
                    .filter(module -> Objects.equals(module.category(), categoryRule.id()))
                    .map(module -> module.id())
                    .toList(),
                "INFO"
            ));
        }

        explanation.add(0, new PricingExplanationItem(
            technicalEstimate.id() + "-hours",
            "TECHNICAL",
            "Technical effort",
            "PERT estimation with the active risk buffer applied over the selected delivery blocks.",
            technicalEstimate.totalHours(),
            technicalEstimate.modules().stream().map(module -> module.id()).toList(),
            "INFO"
        ));

        return new CommercialBase(BudgetCalculationUtils.roundCurrency(total), List.copyOf(explanation));
    }

    private BigDecimal calculateCategoryAmount(
        ConfigurationSnapshot.CategoryRule categoryRule,
        TechnicalEstimate technicalEstimate,
        ConfigurationSnapshot configuration
    ) {
        if (categoryRule.billingType() == CategoryBillingType.TIME_BASED) {
            BigDecimal totalCategoryHours = technicalEstimate.modules().stream()
                .filter(module -> Objects.equals(module.category(), categoryRule.id()))
                .map(module -> BudgetCalculationUtils.safe(module.estimatedHours()))
                .reduce(BigDecimal.ZERO, BigDecimal::add);
            return BudgetCalculationUtils.roundCurrency(totalCategoryHours.multiply(BudgetCalculationUtils.safe(categoryRule.rate())));
        }

        if (categoryRule.billingType() == CategoryBillingType.FIXED_AMOUNT
            && categoryRule.cadence() == BillingCadence.ONE_TIME) {
            return BudgetCalculationUtils.roundCurrency(categoryRule.rate());
        }

        return BigDecimal.ZERO;
    }

    private String buildCategoryExplanation(
        ConfigurationSnapshot.CategoryRule categoryRule,
        TechnicalEstimate technicalEstimate
    ) {
        if (categoryRule.billingType() == CategoryBillingType.TIME_BASED) {
            BigDecimal totalCategoryHours = technicalEstimate.modules().stream()
                .filter(module -> Objects.equals(module.category(), categoryRule.id()))
                .map(module -> BudgetCalculationUtils.safe(module.estimatedHours()))
                .reduce(BigDecimal.ZERO, BigDecimal::add);
            return "Time-based category calculated from " + totalCategoryHours + " estimated hours at the configured rate.";
        }

        return "Fixed commercial category from the active configuration snapshot.";
    }

    private List<SurchargeItem> applySimpleSurcharges(
        BigDecimal subtotal,
        BudgetProject project,
        ConfigurationSnapshot configuration,
        boolean hasWork
    ) {
        if (!hasWork) {
            return List.of();
        }

        Set<String> ruleIds = new LinkedHashSet<>();
        ruleIds.addAll(project.selectedSurchargeRuleIds());

        configuration.technologyCatalog().stream()
            .filter(rule -> rule.id().equals(project.desiredStackId()))
            .filter(rule -> rule.surchargeRuleId() != null && !rule.surchargeRuleId().isBlank())
            .filter(rule -> rule.supportedProjectTypes().isEmpty() || rule.supportedProjectTypes().contains(project.projectType()))
            .findFirst()
            .map(ConfigurationSnapshot.TechnologyRule::surchargeRuleId)
            .ifPresent(ruleIds::add);

        return ruleIds.stream()
            .map(ruleId -> configuration.surchargeRules().stream()
                .filter(rule -> rule.id().equals(ruleId))
                .findFirst()
                .orElse(null))
            .filter(rule -> rule != null && rule.appliesTo() == BillingCadence.ONE_TIME)
            .map(rule -> new SurchargeItem(
                project.id() + "-" + rule.id(),
                rule.code(),
                rule.label(),
                rule.reason(),
                rule.mode(),
                rule.value(),
                calculateAdjustmentAmount(subtotal, rule.mode(), rule.value()),
                rule.appliesTo(),
                rule.stage(),
                true
            ))
            .toList();
    }

    private SupportApplication applyBasicSupport(
        BudgetProject project,
        ConfigurationSnapshot configuration,
        boolean hasWork
    ) {
        if (!hasWork || Boolean.FALSE.equals(project.supportEnabled())) {
            return new SupportApplication(null, BigDecimal.ZERO, null);
        }

        String supportPlanId = project.supportPlanId();
        if (supportPlanId == null || supportPlanId.isBlank()) {
            supportPlanId = configuration.projectTypeDefaults().stream()
                .filter(rule -> rule.projectType().equals(project.projectType()))
                .findFirst()
                .map(ConfigurationSnapshot.ProjectTypeDefaultRule::defaultSupportRuleId)
                .orElse(null);
        }

        if (supportPlanId == null || supportPlanId.isBlank()) {
            return new SupportApplication(null, BigDecimal.ZERO, null);
        }

        String resolvedSupportPlanId = supportPlanId;
        return configuration.supportRules().stream()
            .filter(rule -> rule.id().equals(resolvedSupportPlanId))
            .findFirst()
            .map(rule -> {
                BigDecimal monthlyAmount = rule.monthlyAmount() != null
                    ? rule.monthlyAmount()
                    : rule.includedHours().multiply(rule.hourlyRate());
                return new SupportApplication(
                    rule.id(),
                    BudgetCalculationUtils.roundCommercialValue(
                        monthlyAmount,
                        configuration.roundingRules().commercial()),
                    rule.label()
                );
            })
            .orElse(new SupportApplication(null, BigDecimal.ZERO, null));
    }

    private MaintenanceApplication applyMaintenance(
        BudgetProject project,
        ConfigurationSnapshot configuration,
        boolean hasWork
    ) {
        if (!hasWork) {
            return new MaintenanceApplication(null, BigDecimal.ZERO, null);
        }

        String maintenancePlanId = project.maintenancePlanId();
        if (maintenancePlanId == null || maintenancePlanId.isBlank()) {
            maintenancePlanId = configuration.projectTypeDefaults().stream()
                .filter(rule -> rule.projectType().equals(project.projectType()))
                .findFirst()
                .map(ConfigurationSnapshot.ProjectTypeDefaultRule::defaultMaintenanceRuleId)
                .orElse(null);
        }

        if (maintenancePlanId == null || maintenancePlanId.isBlank()) {
            return new MaintenanceApplication(null, BigDecimal.ZERO, null);
        }

        String resolvedMaintenancePlanId = maintenancePlanId;
        return configuration.maintenanceRules().stream()
            .filter(rule -> rule.id().equals(resolvedMaintenancePlanId))
            .findFirst()
            .map(rule -> new MaintenanceApplication(
                rule.id(),
                BudgetCalculationUtils.roundCommercialValue(
                    BudgetCalculationUtils.safe(rule.monthlyAmount()),
                    configuration.roundingRules().commercial()),
                rule.label()
            ))
            .orElse(new MaintenanceApplication(null, BigDecimal.ZERO, null));
    }

    private SaasApplication applySaasPricing(
        BudgetProject project,
        ConfigurationSnapshot configuration,
        boolean hasWork,
        BigDecimal oneTimeBaseAmount,
        BigDecimal supportMonthlyAmount
    ) {
        if (!hasWork || project.pricingMode() != com.fernandogferreyra.portfolio.backend.domain.budgetbuilder.enums.BudgetPricingMode.SAAS) {
            return new SaasApplication(null, BigDecimal.ZERO, BigDecimal.ZERO, BigDecimal.ZERO, BigDecimal.ZERO, BigDecimal.ZERO, List.of());
        }

        int activeClients = project.activeClients() == null || project.activeClients() <= 0 ? 1 : project.activeClients();
        int recoveryMonths = configuration.saasPricing().recoveryMonths() == null || configuration.saasPricing().recoveryMonths() <= 0
            ? 24
            : configuration.saasPricing().recoveryMonths();
        BigDecimal recoveredDevelopmentCost = BudgetCalculationUtils.roundCurrency(
            oneTimeBaseAmount.divide(BigDecimal.valueOf(recoveryMonths), 4, RoundingMode.HALF_UP));
        BigDecimal infrastructureCost = BudgetCalculationUtils.safe(configuration.saasPricing().monthlyInfrastructureCost());
        BigDecimal extraHoursCost = configuration.hourlyRate().extraHourRate()
            .multiply(BigDecimal.valueOf(Math.max(project.extraMonthlyHours() == null ? 0 : project.extraMonthlyHours(), 0)));
        BigDecimal tierAdjustment = resolveUserScaleAdjustment(project, configuration);
        BigDecimal basePerClient = BudgetCalculationUtils.roundCurrency(
            recoveredDevelopmentCost.add(infrastructureCost)
                .divide(BigDecimal.valueOf(activeClients), 4, RoundingMode.HALF_UP)
                .add(supportMonthlyAmount)
        );
        BigDecimal marginAmount = BudgetCalculationUtils.roundCurrency(
            basePerClient.multiply(BudgetCalculationUtils.safe(configuration.saasPricing().marginPercentage()))
        );
        BigDecimal monthlyAmount = BudgetCalculationUtils.roundCommercialValue(
            basePerClient.add(marginAmount).add(tierAdjustment).add(extraHoursCost),
            configuration.roundingRules().commercial()
        );

        List<PricingExplanationItem> explanation = List.of(
            new PricingExplanationItem(
                project.id() + "-saas-recovery",
                "COMMERCIAL",
                "Development recovery",
                "One-time budget distributed across the configured SaaS recovery window.",
                recoveredDevelopmentCost,
                List.of("saas-recovery"),
                "INFO"
            ),
            new PricingExplanationItem(
                project.id() + "-saas-infrastructure",
                "COMMERCIAL",
                "Infrastructure base",
                "Monthly infrastructure cost from the active SaaS configuration.",
                infrastructureCost,
                List.of("saas-infrastructure"),
                "INFO"
            ),
            new PricingExplanationItem(
                project.id() + "-saas-margin",
                "NEGOTIATION",
                "SaaS margin",
                "Commercial margin applied over the per-client SaaS base.",
                marginAmount,
                List.of("saas-margin"),
                "UP"
            )
        );

        List<PricingExplanationItem> extendedExplanation = new ArrayList<>(explanation);

        if (tierAdjustment.compareTo(BigDecimal.ZERO) > 0) {
            extendedExplanation.add(new PricingExplanationItem(
                project.id() + "-saas-tier",
                "COMMERCIAL",
                "User scale tier",
                "Plan increment applied according to the selected user scale tier.",
                tierAdjustment,
                List.of(project.userScaleTierId() == null ? "default-tier" : project.userScaleTierId()),
                "UP"
            ));
        }

        if (extraHoursCost.compareTo(BigDecimal.ZERO) > 0) {
            extendedExplanation.add(new PricingExplanationItem(
                project.id() + "-saas-extra-hours",
                "COMMERCIAL",
                "Extra monthly hours",
                "Additional monthly support hours priced with the configured extra-hour rate.",
                extraHoursCost,
                List.of("extra-hours"),
                "UP"
            ));
        }

        return new SaasApplication(
            monthlyAmount,
            recoveredDevelopmentCost,
            infrastructureCost,
            tierAdjustment,
            extraHoursCost,
            marginAmount,
            List.copyOf(extendedExplanation)
        );
    }

    private BigDecimal resolveUserScaleAdjustment(
        BudgetProject project,
        ConfigurationSnapshot configuration
    ) {
        if (project.userScaleTierId() == null || project.userScaleTierId().isBlank()) {
            return BigDecimal.ZERO;
        }

        return configuration.userScaleRules().stream()
            .filter(rule -> rule.id().equals(project.userScaleTierId()))
            .findFirst()
            .map(rule -> calculateAdjustmentAmount(BigDecimal.ONE, rule.mode(), rule.value()))
            .orElse(BigDecimal.ZERO);
    }

    private List<DiscountItem> applyManualDiscounts(
        BigDecimal oneTimeBaseAmount,
        BigDecimal monthlyBaseAmount,
        BudgetProject project
    ) {
        BudgetProject.ManualDiscount manualDiscount = project.manualDiscount();
        if (manualDiscount == null || manualDiscount.value() == null || manualDiscount.value().compareTo(BigDecimal.ZERO) <= 0) {
            return List.of();
        }

        BillingCadence cadence = manualDiscount.cadence() == null ? BillingCadence.ONE_TIME : manualDiscount.cadence();
        BigDecimal baseAmount = cadence == BillingCadence.MONTHLY ? monthlyBaseAmount : oneTimeBaseAmount;
        BigDecimal amount = calculateAdjustmentAmount(
            baseAmount,
            manualDiscount.mode() == null ? PricingAdjustmentMode.FIXED : manualDiscount.mode(),
            manualDiscount.value()
        );

        return List.of(new DiscountItem(
            project.id() + "-manual-discount",
            "manual_discount",
            manualDiscount.label(),
            manualDiscount.reason(),
            manualDiscount.mode(),
            manualDiscount.value(),
            amount,
            cadence,
            "NEGOTIATION",
            true
        ));
    }

    private List<PricingExplanationItem> buildExplanation(
        TechnicalEstimate technicalEstimate,
        CommercialBase commercialBase,
        List<SurchargeItem> surcharges,
        List<DiscountItem> discounts,
        SupportApplication supportApplication,
        MaintenanceApplication maintenanceApplication,
        SaasApplication saasApplication
    ) {
        List<PricingExplanationItem> explanation = new ArrayList<>(commercialBase.explanation());

        surcharges.forEach(item -> explanation.add(new PricingExplanationItem(
            technicalEstimate.id() + "-" + item.code(),
            item.stage(),
            item.label(),
            item.reason(),
            item.amount(),
            List.of(item.code()),
            "UP"
        )));

        discounts.forEach(item -> explanation.add(new PricingExplanationItem(
            technicalEstimate.id() + "-" + item.code(),
            item.stage(),
            item.label(),
            item.reason(),
            item.amount(),
            List.of(item.code()),
            "DOWN"
        )));

        if (supportApplication.monthlyAmount().compareTo(BigDecimal.ZERO) > 0) {
            explanation.add(new PricingExplanationItem(
                technicalEstimate.id() + "-support",
                "COMMERCIAL",
                supportApplication.supportLabel(),
                "Monthly support baseline from the active configuration.",
                supportApplication.monthlyAmount(),
                List.of(supportApplication.supportRuleId()),
                "INFO"
            ));
        }

        if (maintenanceApplication.monthlyAmount().compareTo(BigDecimal.ZERO) > 0) {
            explanation.add(new PricingExplanationItem(
                technicalEstimate.id() + "-maintenance",
                "COMMERCIAL",
                maintenanceApplication.maintenanceLabel() == null ? "Maintenance" : maintenanceApplication.maintenanceLabel(),
                "Monthly maintenance plan applied from the active configuration.",
                maintenanceApplication.monthlyAmount(),
                List.of(maintenanceApplication.maintenanceRuleId() == null ? "maintenance" : maintenanceApplication.maintenanceRuleId()),
                "INFO"
            ));
        }

        explanation.addAll(saasApplication.explanation());
        return List.copyOf(explanation);
    }

    private BigDecimal calculateAdjustmentAmount(
        BigDecimal baseAmount,
        PricingAdjustmentMode mode,
        BigDecimal value
    ) {
        if (mode == PricingAdjustmentMode.PERCENTAGE) {
            return BudgetCalculationUtils.roundCurrency(baseAmount.multiply(BudgetCalculationUtils.safe(value)));
        }
        return BudgetCalculationUtils.roundCurrency(value);
    }

    private record CommercialBase(
        BigDecimal baseAmount,
        List<PricingExplanationItem> explanation
    ) {
    }

    private record SupportApplication(
        String supportRuleId,
        BigDecimal monthlyAmount,
        String supportLabel
    ) {
    }

    private record MaintenanceApplication(
        String maintenanceRuleId,
        BigDecimal monthlyAmount,
        String maintenanceLabel
    ) {
    }

    private record SaasApplication(
        BigDecimal monthlyAmount,
        BigDecimal developmentRecovery,
        BigDecimal infrastructure,
        BigDecimal userScaleAdjustment,
        BigDecimal extraHours,
        BigDecimal margin,
        List<PricingExplanationItem> explanation
    ) {
    }
}
