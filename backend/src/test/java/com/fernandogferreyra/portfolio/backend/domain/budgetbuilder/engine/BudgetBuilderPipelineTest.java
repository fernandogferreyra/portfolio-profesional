package com.fernandogferreyra.portfolio.backend.domain.budgetbuilder.engine;

import static org.assertj.core.api.Assertions.assertThat;

import com.fernandogferreyra.portfolio.backend.domain.budgetbuilder.enums.BillingCadence;
import com.fernandogferreyra.portfolio.backend.domain.budgetbuilder.enums.BudgetPricingMode;
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
    void calculatesReferenceWorkbookTotalsForProjectMode() {
        var result = pipeline.run(baseProject, configuration);

        assertThat(result.modules()).hasSize(5);
        assertThat(result.technicalEstimate().riskBufferHours()).isEqualByComparingTo("1.00");
        assertThat(result.technicalEstimate().totalHours()).isEqualByComparingTo("60.00");
        assertThat(result.commercialBudget().baseAmount()).isEqualByComparingTo("1038.00");
        assertThat(result.commercialBudget().finalOneTimeTotal()).isEqualByComparingTo("1588.00");
        assertThat(result.commercialBudget().finalMonthlyTotal()).isEqualByComparingTo("24.00");
    }

    @Test
    void skipsSupportWhenExplicitlyDisabled() {
        BudgetProject project = new BudgetProject(
            baseProject.id(),
            baseProject.name(),
            baseProject.client(),
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
            baseProject.extraMonthlyHours(),
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
            baseProject.client(),
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
            baseProject.extraMonthlyHours(),
            baseProject.notes()
        );

        var result = pipeline.run(project, configuration);

        assertThat(result.commercialBudget().discountItems()).hasSize(1);
        assertThat(result.commercialBudget().discountItems().get(0).amount()).isEqualByComparingTo("100.00");
        assertThat(result.commercialBudget().finalOneTimeTotal()).isEqualByComparingTo("1488.00");
    }

    @Test
    void addsTechnologySurchargeWithoutInferringProjectDefaultSurcharge() {
        BudgetProject project = new BudgetProject(
            baseProject.id(),
            baseProject.name(),
            baseProject.client(),
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
            baseProject.extraMonthlyHours(),
            baseProject.notes()
        );

        var result = pipeline.run(project, configuration);

        assertThat(result.commercialBudget().surchargeItems()).hasSize(1);
        assertThat(result.commercialBudget().surchargeItems().get(0).code()).isEqualTo("outside_stack_surcharge");
        assertThat(result.commercialBudget().surchargeItems().get(0).amount()).isEqualByComparingTo("103.80");
        assertThat(result.commercialBudget().finalOneTimeTotal()).isEqualByComparingTo("1142.00");
    }

    @Test
    void calculatesSaasMonthlyPricingFromRecoveryInfrastructureAndTier() {
        BudgetProject project = new BudgetProject(
            baseProject.id(),
            baseProject.name(),
            baseProject.client(),
            "saas_product",
            BudgetPricingMode.SAAS,
            baseProject.desiredStackId(),
            baseProject.complexity(),
            baseProject.urgency(),
            baseProject.selectedModuleIds(),
            baseProject.moduleSelectionMode(),
            List.of("management-contingency-fixed"),
            true,
            "support-basic",
            null,
            null,
            10,
            "basic",
            0,
            List.of()
        );

        var result = pipeline.run(project, configuration);

        assertThat(result.commercialBudget().finalOneTimeTotal()).isEqualByComparingTo("1338.00");
        assertThat(result.commercialBudget().finalMonthlyTotal()).isEqualByComparingTo("63.00");
    }
}
