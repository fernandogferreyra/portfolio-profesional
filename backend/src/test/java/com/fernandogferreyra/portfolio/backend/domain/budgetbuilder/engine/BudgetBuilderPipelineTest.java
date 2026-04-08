package com.fernandogferreyra.portfolio.backend.domain.budgetbuilder.engine;

import static org.assertj.core.api.Assertions.assertThat;

import com.fernandogferreyra.portfolio.backend.domain.budgetbuilder.enums.BillingCadence;
import com.fernandogferreyra.portfolio.backend.domain.budgetbuilder.enums.PricingAdjustmentMode;
import com.fernandogferreyra.portfolio.backend.domain.budgetbuilder.model.BudgetProject;
import com.fernandogferreyra.portfolio.backend.domain.budgetbuilder.model.ConfigurationSnapshot;
import com.fernandogferreyra.portfolio.backend.support.budgetbuilder.BudgetBuilderTestFixtures;
import java.math.BigDecimal;
import java.util.List;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

class BudgetBuilderPipelineTest {

    private BudgetBuilderPipeline pipeline;
    private ConfigurationSnapshot configuration;
    private BudgetProject baseProject;

    @BeforeEach
    void setUp() {
        pipeline = new BudgetBuilderPipeline(
            new BudgetModuleResolver(),
            new BudgetTechnicalEstimator(),
            new BudgetCommercialPricer()
        );
        configuration = BudgetBuilderTestFixtures.configuration();
        baseProject = BudgetBuilderTestFixtures.project();
    }

    @Test
    void calculatesHoursAndTotalsForMultipleModules() {
        BudgetProject project = new BudgetProject(
            baseProject.id(),
            baseProject.name(),
            baseProject.projectType(),
            baseProject.pricingMode(),
            baseProject.desiredStackId(),
            baseProject.complexity(),
            baseProject.urgency(),
            List.of("DISCOVERY", "CORE_BACKEND", "ADMIN_PANEL"),
            baseProject.moduleSelectionMode(),
            List.of("management-contingency-fixed"),
            baseProject.supportEnabled(),
            baseProject.supportPlanId(),
            baseProject.maintenancePlanId(),
            baseProject.manualDiscount(),
            baseProject.activeClients(),
            baseProject.userScaleTierId(),
            baseProject.notes()
        );

        var result = pipeline.run(project, configuration);

        assertThat(result.modules()).hasSize(3);
        assertThat(result.technicalEstimate().totalHours()).isEqualByComparingTo("39.00");
        assertThat(result.commercialBudget().baseAmount()).isEqualByComparingTo("702.00");
        assertThat(result.commercialBudget().finalOneTimeTotal()).isEqualByComparingTo("1002.00");
        assertThat(result.commercialBudget().finalMonthlyTotal()).isEqualByComparingTo("24.00");
    }

    @Test
    void skipsSupportWhenExplicitlyDisabled() {
        BudgetProject project = new BudgetProject(
            baseProject.id(),
            baseProject.name(),
            baseProject.projectType(),
            baseProject.pricingMode(),
            baseProject.desiredStackId(),
            baseProject.complexity(),
            baseProject.urgency(),
            baseProject.selectedModuleIds(),
            baseProject.moduleSelectionMode(),
            baseProject.selectedSurchargeRuleIds(),
            false,
            null,
            baseProject.maintenancePlanId(),
            baseProject.manualDiscount(),
            baseProject.activeClients(),
            baseProject.userScaleTierId(),
            baseProject.notes()
        );

        var result = pipeline.run(project, configuration);

        assertThat(result.commercialBudget().appliedSupportRuleId()).isNull();
        assertThat(result.commercialBudget().finalMonthlyTotal()).isEqualByComparingTo("0.00");
    }

    @Test
    void appliesManualDiscountsToNegotiatedTotal() {
        BudgetProject project = new BudgetProject(
            baseProject.id(),
            baseProject.name(),
            baseProject.projectType(),
            baseProject.pricingMode(),
            baseProject.desiredStackId(),
            baseProject.complexity(),
            baseProject.urgency(),
            baseProject.selectedModuleIds(),
            baseProject.moduleSelectionMode(),
            baseProject.selectedSurchargeRuleIds(),
            baseProject.supportEnabled(),
            baseProject.supportPlanId(),
            baseProject.maintenancePlanId(),
            new BudgetProject.ManualDiscount(
                "Manual discount",
                "Commercial negotiation",
                PricingAdjustmentMode.FIXED,
                BigDecimal.valueOf(100),
                BillingCadence.ONE_TIME
            ),
            baseProject.activeClients(),
            baseProject.userScaleTierId(),
            baseProject.notes()
        );

        var result = pipeline.run(project, configuration);

        assertThat(result.commercialBudget().discountItems()).hasSize(1);
        assertThat(result.commercialBudget().discountItems().get(0).amount()).isEqualByComparingTo("100.00");
        assertThat(result.commercialBudget().finalOneTimeTotal()).isEqualByComparingTo("650.00");
    }

    @Test
    void addsTechnologySurchargeWithoutInferringProjectDefaultSurcharge() {
        BudgetProject project = new BudgetProject(
            baseProject.id(),
            baseProject.name(),
            baseProject.projectType(),
            baseProject.pricingMode(),
            "outside_primary_stack",
            baseProject.complexity(),
            baseProject.urgency(),
            baseProject.selectedModuleIds(),
            baseProject.moduleSelectionMode(),
            List.of(),
            baseProject.supportEnabled(),
            baseProject.supportPlanId(),
            baseProject.maintenancePlanId(),
            baseProject.manualDiscount(),
            baseProject.activeClients(),
            baseProject.userScaleTierId(),
            baseProject.notes()
        );

        var result = pipeline.run(project, configuration);

        assertThat(result.commercialBudget().surchargeItems()).hasSize(1);
        assertThat(result.commercialBudget().surchargeItems().get(0).code()).isEqualTo("outside_stack_surcharge");
        assertThat(result.commercialBudget().surchargeItems().get(0).amount()).isEqualByComparingTo("45.00");
        assertThat(result.commercialBudget().finalOneTimeTotal()).isEqualByComparingTo("495.00");
    }

    @Test
    void handlesEmptyInputsAndZeroValuesWithoutNegativeTotals() {
        ConfigurationSnapshot zeroRateConfiguration = new ConfigurationSnapshot(
            configuration.id(),
            configuration.version(),
            configuration.source(),
            configuration.currency(),
            configuration.createdAt(),
            configuration.workingHoursPerWeek(),
            new ConfigurationSnapshot.HourlyRateConfig(
                BigDecimal.ZERO,
                configuration.hourlyRate().supportHourlyRate(),
                configuration.hourlyRate().extraHourRate()
            ),
            configuration.commercialMultiplier(),
            BigDecimal.ZERO,
            configuration.roundingRules(),
            configuration.moduleCatalog(),
            configuration.technologyCatalog(),
            configuration.surchargeRules(),
            configuration.supportRules(),
            List.of(),
            configuration.projectMultipliers(),
            configuration.stackMultipliers(),
            configuration.complexityMultipliers()
        );
        BudgetProject project = new BudgetProject(
            baseProject.id(),
            baseProject.name(),
            "unknown_project",
            baseProject.pricingMode(),
            baseProject.desiredStackId(),
            baseProject.complexity(),
            baseProject.urgency(),
            List.of(),
            baseProject.moduleSelectionMode(),
            List.of(),
            false,
            null,
            null,
            new BudgetProject.ManualDiscount(
                "Empty discount",
                "Zero-value edge case",
                PricingAdjustmentMode.PERCENTAGE,
                BigDecimal.ZERO,
                BillingCadence.ONE_TIME
            ),
            baseProject.activeClients(),
            baseProject.userScaleTierId(),
            baseProject.notes()
        );

        var result = pipeline.run(project, zeroRateConfiguration);

        assertThat(result.modules()).isEmpty();
        assertThat(result.technicalEstimate().totalHours()).isEqualByComparingTo("0.00");
        assertThat(result.commercialBudget().baseAmount()).isEqualByComparingTo("0.00");
        assertThat(result.commercialBudget().finalOneTimeTotal()).isEqualByComparingTo("0.00");
        assertThat(result.commercialBudget().finalMonthlyTotal()).isEqualByComparingTo("0.00");
    }
}
