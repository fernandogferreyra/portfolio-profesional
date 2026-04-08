package com.fernandogferreyra.portfolio.backend.service.impl;

import static org.assertj.core.api.Assertions.assertThat;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fernandogferreyra.portfolio.backend.domain.budgetbuilder.engine.BudgetBuilderPipeline;
import com.fernandogferreyra.portfolio.backend.domain.budgetbuilder.engine.BudgetCommercialPricer;
import com.fernandogferreyra.portfolio.backend.domain.budgetbuilder.engine.BudgetModuleResolver;
import com.fernandogferreyra.portfolio.backend.domain.budgetbuilder.engine.BudgetTechnicalEstimator;
import com.fernandogferreyra.portfolio.backend.dto.budgetbuilder.BudgetPreviewRequest;
import com.fernandogferreyra.portfolio.backend.mapper.budgetbuilder.BudgetBuilderRequestMapper;
import com.fernandogferreyra.portfolio.backend.mapper.budgetbuilder.BudgetBuilderResponseMapper;
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
        service = new BudgetBuilderServiceImpl(
            configurationService,
            new BudgetBuilderRequestMapper(),
            new BudgetBuilderResponseMapper(),
            new BudgetBuilderPipeline(
                new BudgetModuleResolver(),
                new BudgetTechnicalEstimator(),
                new BudgetCommercialPricer()
            ),
            new ObjectMapper()
        );
    }

    @Test
    void previewUsesConfiguredEngineAndBuildsResponse() {
        var response = service.preview(BudgetBuilderTestFixtures.previewRequest());

        assertThat(response.configurationSnapshotId()).isEqualTo("config-seed-v1");
        assertThat(response.previewHash()).hasSize(64);
        assertThat(response.modules()).hasSize(2);
        assertThat(response.totalHours()).isEqualByComparingTo("25.00");
        assertThat(response.baseAmount()).isEqualByComparingTo("450.00");
        assertThat(response.finalOneTimeTotal()).isEqualByComparingTo("750.00");
        assertThat(response.finalMonthlyTotal()).isEqualByComparingTo("24.00");
    }

    @Test
    void previewSupportsHourlyRateOverrideAndManualDiscount() {
        BudgetPreviewRequest request = new BudgetPreviewRequest(
            "Operations MVP",
            "standard_project",
            BudgetBuilderTestFixtures.previewRequest().pricingMode(),
            "default_web_stack",
            BudgetBuilderTestFixtures.previewRequest().complexity(),
            BudgetBuilderTestFixtures.previewRequest().urgency(),
            List.of("DISCOVERY", "CORE_BACKEND"),
            BudgetBuilderTestFixtures.previewRequest().moduleSelectionMode(),
            List.of("management-contingency-fixed"),
            true,
            "support-basic",
            null,
            BigDecimal.valueOf(20),
            BudgetBuilderTestFixtures.oneTimeFixedDiscountRequest(BigDecimal.valueOf(50)),
            null,
            null,
            List.of()
        );

        var response = service.preview(request);

        assertThat(response.totalHours()).isEqualByComparingTo("25.00");
        assertThat(response.baseAmount()).isEqualByComparingTo("500.00");
        assertThat(response.finalOneTimeTotal()).isEqualByComparingTo("750.00");
        assertThat(response.discounts()).hasSize(1);
    }
}
