package com.fernandogferreyra.portfolio.backend.domain.budgetbuilder.engine;

import com.fernandogferreyra.portfolio.backend.domain.budgetbuilder.enums.BillingCadence;
import com.fernandogferreyra.portfolio.backend.domain.budgetbuilder.enums.PricingAdjustmentMode;
import com.fernandogferreyra.portfolio.backend.domain.budgetbuilder.model.BudgetProject;
import com.fernandogferreyra.portfolio.backend.domain.budgetbuilder.model.CommercialBudget;
import com.fernandogferreyra.portfolio.backend.domain.budgetbuilder.model.ConfigurationSnapshot;
import com.fernandogferreyra.portfolio.backend.domain.budgetbuilder.model.DiscountItem;
import com.fernandogferreyra.portfolio.backend.domain.budgetbuilder.model.PricingExplanationItem;
import com.fernandogferreyra.portfolio.backend.domain.budgetbuilder.model.SurchargeItem;
import com.fernandogferreyra.portfolio.backend.domain.budgetbuilder.model.TechnicalEstimate;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;
import org.springframework.stereotype.Component;

@Component
public class BudgetCommercialPricer {

    public CommercialBudget calculate(
        BudgetProject project,
        ConfigurationSnapshot configuration,
        TechnicalEstimate technicalEstimate
    ) {
        BigDecimal subtotal = calculateCommercialSubtotal(technicalEstimate, configuration);
        boolean hasWork = !technicalEstimate.modules().isEmpty() && subtotal.compareTo(BigDecimal.ZERO) > 0;
        List<SurchargeItem> surchargeItems = applySimpleSurcharges(subtotal, project, configuration, hasWork);
        BigDecimal surchargeTotal = surchargeItems.stream()
            .map(SurchargeItem::amount)
            .reduce(BigDecimal.ZERO, BigDecimal::add);
        SupportApplication supportApplication = applyBasicSupport(project, configuration, hasWork);
        List<DiscountItem> discountItems = applyManualDiscounts(
            subtotal.add(surchargeTotal),
            supportApplication.monthlyAmount(),
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
                subtotal.add(surchargeTotal).subtract(oneTimeDiscountTotal),
                configuration.minimumBudget()),
            configuration.roundingRules().commercial());
        BigDecimal finalMonthlyTotal = BudgetCalculationUtils.roundCommercialValue(
            supportApplication.monthlyAmount().subtract(monthlyDiscountTotal).max(BigDecimal.ZERO),
            configuration.roundingRules().commercial());

        return new CommercialBudget(
            project.id() + "-commercial-budget",
            project.id(),
            configuration.id(),
            technicalEstimate.id(),
            configuration.currency(),
            technicalEstimate.totalHours(),
            subtotal,
            subtotal,
            supportApplication.monthlyAmount(),
            surchargeItems,
            discountItems,
            finalOneTimeTotal,
            finalMonthlyTotal,
            supportApplication.supportRuleId(),
            buildExplanation(technicalEstimate, subtotal, surchargeItems, discountItems, supportApplication),
            configuration.createdAt()
        );
    }

    private BigDecimal calculateCommercialSubtotal(
        TechnicalEstimate technicalEstimate,
        ConfigurationSnapshot configuration
    ) {
        return BudgetCalculationUtils.roundCurrency(
            technicalEstimate.totalHours().multiply(BudgetCalculationUtils.safe(configuration.hourlyRate().base()))
        );
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
        BigDecimal subtotal,
        List<SurchargeItem> surcharges,
        List<DiscountItem> discounts,
        SupportApplication supportApplication
    ) {
        List<PricingExplanationItem> explanation = new ArrayList<>();
        explanation.add(new PricingExplanationItem(
            technicalEstimate.id() + "-hours",
            "TECHNICAL",
            "Technical effort",
            "Base estimate generated from the selected modules.",
            technicalEstimate.totalHours(),
            technicalEstimate.modules().stream().map(module -> module.id()).toList(),
            "INFO"
        ));
        explanation.add(new PricingExplanationItem(
            technicalEstimate.id() + "-subtotal",
            "COMMERCIAL",
            "Commercial subtotal",
            "Subtotal based on total hours multiplied by the configured hourly rate.",
            subtotal,
            List.of("hourly-rate-base"),
            "INFO"
        ));

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
                "Basic monthly support applied from the active configuration.",
                supportApplication.monthlyAmount(),
                List.of(supportApplication.supportRuleId()),
                "INFO"
            ));
        }

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

    private record SupportApplication(
        String supportRuleId,
        BigDecimal monthlyAmount,
        String supportLabel
    ) {
    }
}
