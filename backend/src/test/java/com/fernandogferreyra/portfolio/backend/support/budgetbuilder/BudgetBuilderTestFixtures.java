package com.fernandogferreyra.portfolio.backend.support.budgetbuilder;

import com.fernandogferreyra.portfolio.backend.domain.budgetbuilder.enums.BillingCadence;
import com.fernandogferreyra.portfolio.backend.domain.budgetbuilder.enums.BudgetComplexity;
import com.fernandogferreyra.portfolio.backend.domain.budgetbuilder.enums.BudgetModuleSelectionMode;
import com.fernandogferreyra.portfolio.backend.domain.budgetbuilder.enums.BudgetPricingMode;
import com.fernandogferreyra.portfolio.backend.domain.budgetbuilder.enums.BudgetUrgency;
import com.fernandogferreyra.portfolio.backend.domain.budgetbuilder.enums.PricingAdjustmentMode;
import com.fernandogferreyra.portfolio.backend.domain.budgetbuilder.model.BudgetProject;
import com.fernandogferreyra.portfolio.backend.domain.budgetbuilder.model.ConfigurationSnapshot;
import com.fernandogferreyra.portfolio.backend.domain.budgetbuilder.model.EstimateModule;
import com.fernandogferreyra.portfolio.backend.dto.budgetbuilder.BudgetPreviewRequest;
import com.fernandogferreyra.portfolio.backend.dto.budgetbuilder.ManualDiscountRequest;
import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

public final class BudgetBuilderTestFixtures {

    private BudgetBuilderTestFixtures() {
    }

    public static ConfigurationSnapshot configuration() {
        return new ConfigurationSnapshot(
            "config-seed-v1",
            "2026-04-07-mvp",
            "seed",
            "USD",
            "2026-04-07T00:00:00Z",
            32,
            new ConfigurationSnapshot.HourlyRateConfig(
                decimal(18),
                decimal(8),
                decimal(12)
            ),
            BigDecimal.ONE,
            BigDecimal.ZERO,
            new ConfigurationSnapshot.RoundingRules(
                ConfigurationSnapshot.TechnicalRounding.ROUND_NEAREST_HOUR,
                ConfigurationSnapshot.CommercialRounding.ROUND_2_DECIMALS
            ),
            List.of(
                module("DISCOVERY", "analysis_design", "Discovery", decimal(8), BigDecimal.ONE, BigDecimal.ONE, List.of(), false),
                module("CORE_BACKEND", "backend", "Core backend", decimal(12), BigDecimal.ONE, BigDecimal.ONE, List.of("DISCOVERY"), false),
                module("FRONTEND_APP", "frontend", "Frontend app", decimal(10), BigDecimal.ONE, BigDecimal.ONE, List.of("DISCOVERY"), true),
                module("DATABASE_LAYER", "backend", "Database layer", decimal(8), BigDecimal.ONE, BigDecimal.ONE, List.of("CORE_BACKEND"), true),
                module("ADMIN_PANEL", "frontend", "Admin panel", decimal(10), decimal(1.1), BigDecimal.ONE, List.of("CORE_BACKEND"), true)
            ),
            List.of(
                new ConfigurationSnapshot.TechnologyRule(
                    "default_web_stack",
                    "Default web stack",
                    BigDecimal.ONE,
                    null,
                    List.of("standard_project")
                ),
                new ConfigurationSnapshot.TechnologyRule(
                    "outside_primary_stack",
                    "Outside primary stack",
                    BigDecimal.ONE,
                    "outside-stack-surcharge",
                    List.of("standard_project")
                )
            ),
            List.of(
                new ConfigurationSnapshot.SurchargeRule(
                    "management-contingency-fixed",
                    "management_contingency_fixed",
                    "Management contingency",
                    "Covers management overhead and contingency.",
                    PricingAdjustmentMode.FIXED,
                    decimal(300),
                    BillingCadence.ONE_TIME,
                    "COMMERCIAL",
                    true
                ),
                new ConfigurationSnapshot.SurchargeRule(
                    "outside-stack-surcharge",
                    "outside_stack_surcharge",
                    "Outside stack surcharge",
                    "Applies when the project uses a stack outside the primary catalog.",
                    PricingAdjustmentMode.PERCENTAGE,
                    decimal(0.1),
                    BillingCadence.ONE_TIME,
                    "COMMERCIAL",
                    false
                )
            ),
            List.of(
                new ConfigurationSnapshot.SupportRule(
                    "support-basic",
                    "Basic support",
                    BillingCadence.MONTHLY,
                    decimal(3),
                    decimal(8),
                    decimal(24),
                    true
                )
            ),
            List.of(
                new ConfigurationSnapshot.ProjectTypeDefaultRule(
                    "standard_project",
                    List.of("DISCOVERY", "CORE_BACKEND"),
                    List.of("management-contingency-fixed"),
                    "support-basic",
                    null
                )
            ),
            Map.of("standard_project", BigDecimal.ONE),
            Map.of(
                "default_web_stack", BigDecimal.ONE,
                "outside_primary_stack", BigDecimal.ONE
            ),
            Map.of(
                BudgetComplexity.LOW, BigDecimal.ONE,
                BudgetComplexity.MEDIUM, decimal(1.25),
                BudgetComplexity.HIGH, decimal(1.6)
            )
        );
    }

    public static BudgetProject project() {
        return new BudgetProject(
            "project-mvp",
            "Operations MVP",
            "standard_project",
            BudgetPricingMode.PROJECT,
            "default_web_stack",
            BudgetComplexity.MEDIUM,
            BudgetUrgency.STANDARD,
            List.of("DISCOVERY", "CORE_BACKEND"),
            BudgetModuleSelectionMode.EXPLICIT,
            List.of("management-contingency-fixed"),
            true,
            "support-basic",
            null,
            null,
            null,
            null,
            List.of()
        );
    }

    public static BudgetPreviewRequest previewRequest() {
        return new BudgetPreviewRequest(
            "Operations MVP",
            "standard_project",
            BudgetPricingMode.PROJECT,
            "default_web_stack",
            BudgetComplexity.MEDIUM,
            BudgetUrgency.STANDARD,
            List.of("DISCOVERY", "CORE_BACKEND"),
            BudgetModuleSelectionMode.EXPLICIT,
            List.of("management-contingency-fixed"),
            true,
            "support-basic",
            null,
            null,
            null,
            null,
            null,
            List.of()
        );
    }

    public static ManualDiscountRequest oneTimeFixedDiscountRequest(BigDecimal value) {
        return new ManualDiscountRequest(
            "Manual discount",
            "Commercial negotiation",
            PricingAdjustmentMode.FIXED,
            value,
            BillingCadence.ONE_TIME
        );
    }

    private static EstimateModule module(
        String id,
        String category,
        String name,
        BigDecimal baseHours,
        BigDecimal complexityWeight,
        BigDecimal moduleMultiplier,
        List<String> dependencyIds,
        boolean optional
    ) {
        return new EstimateModule(
            id,
            category,
            name,
            name + " description",
            1,
            "STANDARD",
            baseHours,
            complexityWeight,
            moduleMultiplier,
            dependencyIds,
            optional,
            null
        );
    }

    private static BigDecimal decimal(double value) {
        return BigDecimal.valueOf(value);
    }
}
