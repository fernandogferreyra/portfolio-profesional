package com.fernandogferreyra.portfolio.backend.service.impl;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.mock;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fernandogferreyra.portfolio.backend.domain.budgetbuilder.engine.BudgetBuilderPipeline;
import com.fernandogferreyra.portfolio.backend.domain.budgetbuilder.engine.BudgetCommercialPricer;
import com.fernandogferreyra.portfolio.backend.domain.budgetbuilder.engine.BudgetModuleResolver;
import com.fernandogferreyra.portfolio.backend.domain.budgetbuilder.engine.BudgetTechnicalEstimator;
import com.fernandogferreyra.portfolio.backend.domain.budgetbuilder.enums.BudgetComplexity;
import com.fernandogferreyra.portfolio.backend.domain.budgetbuilder.enums.BudgetModuleSelectionMode;
import com.fernandogferreyra.portfolio.backend.domain.budgetbuilder.enums.BudgetPricingMode;
import com.fernandogferreyra.portfolio.backend.domain.budgetbuilder.enums.BudgetUrgency;
import com.fernandogferreyra.portfolio.backend.dto.budgetbuilder.BudgetPreviewRequest;
import com.fernandogferreyra.portfolio.backend.mapper.budgetbuilder.BudgetBuilderRequestMapper;
import com.fernandogferreyra.portfolio.backend.mapper.budgetbuilder.BudgetBuilderResponseMapper;
import com.fernandogferreyra.portfolio.backend.repository.budgetbuilder.BudgetSnapshotRepository;
import com.fernandogferreyra.portfolio.backend.service.BudgetConfigurationService;
import com.fernandogferreyra.portfolio.backend.support.budgetbuilder.BudgetBuilderTestFixtures;
import java.math.BigDecimal;
import java.util.List;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

class BudgetBuilderServiceImplTest {

    private BudgetBuilderServiceImpl service;

    @BeforeEach
    void setUp() {
        BudgetConfigurationService configurationService = BudgetBuilderTestFixtures::configuration;
        BudgetSnapshotRepository repository = mock(BudgetSnapshotRepository.class);
        service = new BudgetBuilderServiceImpl(
            configurationService,
            new BudgetBuilderRequestMapper(),
            new BudgetBuilderResponseMapper(),
            new BudgetBuilderPipeline(
                new BudgetModuleResolver(),
                new BudgetTechnicalEstimator(),
                new BudgetCommercialPricer()
            ),
            repository,
            new ObjectMapper()
        );
    }

    @Test
    void previewUsesConfiguredEngineAndBuildsResponse() {
        var response = service.preview(BudgetBuilderTestFixtures.previewRequest());

        assertThat(response.configurationSnapshotId()).isEqualTo("config-seed-v1");
        assertThat(response.previewHash()).hasSize(64);
        assertThat(response.currency()).isEqualTo("ARS");
        assertThat(response.modules()).hasSize(5);
        assertThat(response.technicalSummary()).isNotNull();
        assertThat(response.areaBreakdown()).hasSize(5);
        assertThat(response.monthlyBreakdown()).isNull();
        assertThat(response.modules().get(0).baseAmount()).isEqualByComparingTo("225.00");
        assertThat(response.modules().get(1).baseAmount()).isEqualByComparingTo("360.00");
        assertThat(response.totalHours()).isEqualByComparingTo("60.00");
        assertThat(response.baseAmount()).isEqualByComparingTo("1038.00");
        assertThat(response.finalOneTimeTotal()).isEqualByComparingTo("1588.00");
        assertThat(response.finalMonthlyTotal()).isEqualByComparingTo("24.00");
    }

    @Test
    void previewSupportsHourlyRateOverrideAndManualDiscount() {
        BudgetPreviewRequest request = new BudgetPreviewRequest(
            "Operations MVP",
            "ACME Corp",
            "standard_project",
            BudgetBuilderTestFixtures.previewRequest().pricingMode(),
            "default_web_stack",
            BudgetBuilderTestFixtures.previewRequest().complexity(),
            BudgetBuilderTestFixtures.previewRequest().urgency(),
            List.of("ANALYSIS_DISCOVERY", "BACKEND_DEVELOPMENT", "FRONTEND_DELIVERY", "QA_VALIDATION", "DEPLOY_RELEASE"),
            BudgetBuilderTestFixtures.previewRequest().moduleSelectionMode(),
            List.of("hosting-licenses-fixed", "management-contingency-fixed"),
            true,
            "support-basic",
            null,
            BigDecimal.valueOf(20),
            BudgetBuilderTestFixtures.oneTimeFixedDiscountRequest(BigDecimal.valueOf(50)),
            null,
            null,
            null,
            List.of()
        );

        var response = service.preview(request);

        assertThat(response.totalHours()).isEqualByComparingTo("60.00");
        assertThat(response.modules().stream().map(module -> module.baseAmount().toPlainString()).toList())
            .containsExactly("300.00", "360.00", "240.00", "100.00", "180.00");
        assertThat(response.baseAmount()).isEqualByComparingTo("1180.00");
        assertThat(response.technicalSummary().totalBaseAmount()).isEqualByComparingTo("1180.00");
        assertThat(response.finalOneTimeTotal()).isEqualByComparingTo("1680.00");
        assertThat(response.discounts()).hasSize(1);
    }

    @Test
    void previewIncludesMonthlyBreakdownForSaasPricing() {
        BudgetPreviewRequest request = new BudgetPreviewRequest(
            "SaaS MVP",
            "ACME Corp",
            "saas_product",
            BudgetPricingMode.SAAS,
            "default_web_stack",
            BudgetComplexity.MEDIUM,
            BudgetUrgency.STANDARD,
            List.of("ANALYSIS_DISCOVERY", "BACKEND_DEVELOPMENT", "FRONTEND_DELIVERY", "QA_VALIDATION", "DEPLOY_RELEASE"),
            BudgetModuleSelectionMode.EXPLICIT,
            List.of("management-contingency-fixed"),
            true,
            "support-basic",
            null,
            null,
            null,
            10,
            "basic",
            2,
            List.of()
        );

        var response = service.preview(request);

        assertThat(response.monthlyBreakdown()).isNotNull();
        assertThat(response.monthlyBreakdown().developmentRecovery()).isGreaterThan(BigDecimal.ZERO);
        assertThat(response.monthlyBreakdown().infrastructure()).isEqualByComparingTo("80.00");
        assertThat(response.monthlyBreakdown().support()).isEqualByComparingTo("24.00");
        assertThat(response.monthlyBreakdown().userScaleAdjustment()).isEqualByComparingTo("10.00");
        assertThat(response.monthlyBreakdown().extraHours()).isEqualByComparingTo("24.00");
        assertThat(response.finalMonthlyTotal()).isEqualByComparingTo(response.monthlyBreakdown().finalMonthlyTotal());
    }
}
