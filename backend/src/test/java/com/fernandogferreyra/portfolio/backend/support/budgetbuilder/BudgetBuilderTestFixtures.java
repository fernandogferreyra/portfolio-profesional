package com.fernandogferreyra.portfolio.backend.support.budgetbuilder;

import com.fernandogferreyra.portfolio.backend.domain.budgetbuilder.enums.BillingCadence;
import com.fernandogferreyra.portfolio.backend.domain.budgetbuilder.enums.BudgetComplexity;
import com.fernandogferreyra.portfolio.backend.domain.budgetbuilder.enums.BudgetModuleSelectionMode;
import com.fernandogferreyra.portfolio.backend.domain.budgetbuilder.enums.BudgetPricingMode;
import com.fernandogferreyra.portfolio.backend.domain.budgetbuilder.enums.BudgetUrgency;
import com.fernandogferreyra.portfolio.backend.domain.budgetbuilder.enums.CategoryBillingType;
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
            "2026-04-08-reference",
            "seed",
            "ARS",
            "2026-04-08T00:00:00Z",
            32,
            decimal(1),
            new ConfigurationSnapshot.HourlyRateConfig(
                decimal(18),
                decimal(8),
                decimal(12)
            ),
            BigDecimal.ONE,
            BigDecimal.ZERO,
            new ConfigurationSnapshot.RoundingRules(
                ConfigurationSnapshot.TechnicalRounding.ROUND_NEAREST_HOUR,
                ConfigurationSnapshot.CommercialRounding.ROUND_UP_INTEGER
            ),
            List.of(
                module("ANALYSIS_DISCOVERY", "analysis_design", "Analysis and design", decimal(15), decimal(12), decimal(15), decimal(18), List.of(), null, false),
                module("BACKEND_DEVELOPMENT", "backend", "Backend development", decimal(18), decimal(15), decimal(18), decimal(21), List.of("ANALYSIS_DISCOVERY"), "Depends on finishing analysis and design.", false),
                module("FRONTEND_DELIVERY", "frontend", "Frontend delivery", decimal(12), decimal(10), decimal(12), decimal(14), List.of("ANALYSIS_DISCOVERY", "BACKEND_DEVELOPMENT"), "Frontend integration depends on backend contracts.", true),
                module("QA_VALIDATION", "testing", "Testing and validation", decimal(5), decimal(4), decimal(5), decimal(6), List.of("BACKEND_DEVELOPMENT", "FRONTEND_DELIVERY"), "Testing starts after implementation closes.", true),
                module("DEPLOY_RELEASE", "deploy", "Deploy and release", decimal(9), decimal(7), decimal(9), decimal(11), List.of("QA_VALIDATION"), "Deployment starts after QA validation.", true)
            ),
            List.of(
                new ConfigurationSnapshot.CategoryRule(
                    "analysis_design",
                    "Analysis and design",
                    CategoryBillingType.TIME_BASED,
                    decimal(15),
                    BillingCadence.ONE_TIME
                ),
                new ConfigurationSnapshot.CategoryRule(
                    "backend",
                    "Backend development",
                    CategoryBillingType.TIME_BASED,
                    decimal(20),
                    BillingCadence.ONE_TIME
                ),
                new ConfigurationSnapshot.CategoryRule(
                    "frontend",
                    "Frontend development",
                    CategoryBillingType.TIME_BASED,
                    decimal(18),
                    BillingCadence.ONE_TIME
                ),
                new ConfigurationSnapshot.CategoryRule(
                    "testing",
                    "Testing",
                    CategoryBillingType.TIME_BASED,
                    decimal(15),
                    BillingCadence.ONE_TIME
                ),
                new ConfigurationSnapshot.CategoryRule(
                    "deploy",
                    "Deploy and configuration",
                    CategoryBillingType.TIME_BASED,
                    decimal(18),
                    BillingCadence.ONE_TIME
                )
            ),
            List.of(
                new ConfigurationSnapshot.TechnologyRule(
                    "default_web_stack",
                    "Default web stack",
                    "Primary delivery stack without extra commercial surcharge.",
                    BigDecimal.ONE,
                    null,
                    List.of("standard_project", "saas_product")
                ),
                new ConfigurationSnapshot.TechnologyRule(
                    "outside_primary_stack",
                    "Outside primary stack",
                    "Technology outside the main stack catalog with commercial uplift.",
                    BigDecimal.ONE,
                    "outside-stack-surcharge",
                    List.of("standard_project", "saas_product")
                )
            ),
            List.of(
                new ConfigurationSnapshot.SurchargeRule(
                    "hosting-licenses-fixed",
                    "hosting_licenses_fixed",
                    "Hosting and licenses",
                    "Fixed infrastructure and licensing cost for standard project delivery.",
                    PricingAdjustmentMode.FIXED,
                    decimal(250),
                    BillingCadence.ONE_TIME,
                    "COMMERCIAL",
                    true
                ),
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
                new ConfigurationSnapshot.MaintenanceRule(
                    "maintenance-standard",
                    "Standard maintenance",
                    BillingCadence.MONTHLY,
                    decimal(90),
                    false
                )
            ),
            List.of(
                new ConfigurationSnapshot.UserScaleRule(
                    "basic",
                    "Basic",
                    1,
                    10,
                    PricingAdjustmentMode.FIXED,
                    decimal(10)
                ),
                new ConfigurationSnapshot.UserScaleRule(
                    "pro",
                    "Pro",
                    51,
                    150,
                    PricingAdjustmentMode.FIXED,
                    decimal(50)
                )
            ),
            new ConfigurationSnapshot.SaasPricingRules(
                24,
                decimal(80),
                decimal(0.4)
            ),
            List.of(
                new ConfigurationSnapshot.ProjectTypeDefaultRule(
                    "essential_web",
                    "Presencia esencial",
                    "Landing o sitio compacto para mostrar propuesta y captar oportunidades.",
                    List.of("ANALYSIS_DISCOVERY", "FRONTEND_DELIVERY", "QA_VALIDATION", "DEPLOY_RELEASE"),
                    List.of("hosting-licenses-fixed"),
                    "support-basic",
                    null
                ),
                new ConfigurationSnapshot.ProjectTypeDefaultRule(
                    "business_site",
                    "Sitio comercial",
                    "Web corporativa con secciones, mensajes de venta y estructura lista para crecer.",
                    List.of("ANALYSIS_DISCOVERY", "BACKEND_DEVELOPMENT", "FRONTEND_DELIVERY", "QA_VALIDATION", "DEPLOY_RELEASE"),
                    List.of("hosting-licenses-fixed", "management-contingency-fixed"),
                    "support-basic",
                    null
                ),
                new ConfigurationSnapshot.ProjectTypeDefaultRule(
                    "operations_tool",
                    "Sistema operativo",
                    "Panel interno o flujo comercial con usuarios, procesos y soporte operativo.",
                    List.of("ANALYSIS_DISCOVERY", "BACKEND_DEVELOPMENT", "FRONTEND_DELIVERY", "QA_VALIDATION", "DEPLOY_RELEASE"),
                    List.of("management-contingency-fixed"),
                    "support-basic",
                    "maintenance-standard"
                ),
                new ConfigurationSnapshot.ProjectTypeDefaultRule(
                    "product_platform",
                    "Plataforma producto",
                    "Producto digital mas ambicioso con roadmap, cuentas y arquitectura mas exigente.",
                    List.of("ANALYSIS_DISCOVERY", "BACKEND_DEVELOPMENT", "FRONTEND_DELIVERY", "QA_VALIDATION", "DEPLOY_RELEASE"),
                    List.of("management-contingency-fixed"),
                    "support-basic",
                    "maintenance-standard"
                ),
                new ConfigurationSnapshot.ProjectTypeDefaultRule(
                    "standard_project",
                    "Proyecto estandar",
                    "Entrega one-shot con costo de implementacion y soporte opcional.",
                    List.of("ANALYSIS_DISCOVERY", "BACKEND_DEVELOPMENT", "FRONTEND_DELIVERY", "QA_VALIDATION", "DEPLOY_RELEASE"),
                    List.of("hosting-licenses-fixed", "management-contingency-fixed"),
                    "support-basic",
                    null
                ),
                new ConfigurationSnapshot.ProjectTypeDefaultRule(
                    "saas_product",
                    "Producto SaaS",
                    "Producto con recupero mensual, infraestructura y tier por usuarios.",
                    List.of("ANALYSIS_DISCOVERY", "BACKEND_DEVELOPMENT", "FRONTEND_DELIVERY", "QA_VALIDATION", "DEPLOY_RELEASE"),
                    List.of("management-contingency-fixed"),
                    "support-basic",
                    null
                )
            ),
            Map.of(
                "essential_web", decimal(0.82),
                "business_site", BigDecimal.ONE,
                "operations_tool", decimal(1.18),
                "product_platform", decimal(1.32),
                "standard_project", BigDecimal.ONE,
                "saas_product", BigDecimal.ONE
            ),
            Map.of(
                "default_web_stack", BigDecimal.ONE,
                "outside_primary_stack", BigDecimal.ONE
            ),
            Map.of(
                BudgetComplexity.LOW, decimal(0.9),
                BudgetComplexity.MEDIUM, BigDecimal.ONE,
                BudgetComplexity.HIGH, decimal(1.2)
            )
        );
    }

    public static BudgetProject project() {
        return new BudgetProject(
            "project-mvp",
            "Operations MVP",
            "ACME Corp",
            "standard_project",
            BudgetPricingMode.PROJECT,
            "default_web_stack",
            BudgetComplexity.MEDIUM,
            BudgetUrgency.STANDARD,
            List.of("ANALYSIS_DISCOVERY", "BACKEND_DEVELOPMENT", "FRONTEND_DELIVERY", "QA_VALIDATION", "DEPLOY_RELEASE"),
            BudgetModuleSelectionMode.EXPLICIT,
            List.of("hosting-licenses-fixed", "management-contingency-fixed"),
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

    public static BudgetPreviewRequest previewRequest() {
        return new BudgetPreviewRequest(
            "Operations MVP",
            "ACME Corp",
            "standard_project",
            BudgetPricingMode.PROJECT,
            "default_web_stack",
            BudgetComplexity.MEDIUM,
            BudgetUrgency.STANDARD,
            List.of("ANALYSIS_DISCOVERY", "BACKEND_DEVELOPMENT", "FRONTEND_DELIVERY", "QA_VALIDATION", "DEPLOY_RELEASE"),
            BudgetModuleSelectionMode.EXPLICIT,
            List.of("hosting-licenses-fixed", "management-contingency-fixed"),
            true,
            "support-basic",
            null,
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
        BigDecimal optimisticHours,
        BigDecimal probableHours,
        BigDecimal pessimisticHours,
        List<String> dependencyIds,
        String blockingNote,
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
            optimisticHours,
            probableHours,
            pessimisticHours,
            BigDecimal.ONE,
            BigDecimal.ONE,
            dependencyIds,
            blockingNote,
            optional,
            null
        );
    }

    private static BigDecimal decimal(double value) {
        return BigDecimal.valueOf(value);
    }
}
