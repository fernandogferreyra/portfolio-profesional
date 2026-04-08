package com.fernandogferreyra.portfolio.backend.config;

import com.fernandogferreyra.portfolio.backend.domain.budgetbuilder.enums.BillingCadence;
import com.fernandogferreyra.portfolio.backend.domain.budgetbuilder.enums.BudgetComplexity;
import com.fernandogferreyra.portfolio.backend.domain.budgetbuilder.enums.PricingAdjustmentMode;
import jakarta.validation.Valid;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.EnumMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.validation.annotation.Validated;

@Getter
@Setter
@Validated
@ConfigurationProperties(prefix = "app.budget-builder")
public class BudgetBuilderSeedProperties {

    @NotBlank
    private String configurationId;

    @NotBlank
    private String version;

    @NotBlank
    private String source;

    @NotBlank
    private String currency;

    @NotBlank
    private String createdAt;

    @Min(1)
    private int workingHoursPerWeek;

    @Valid
    @NotNull
    private HourlyRateProperties hourlyRate = new HourlyRateProperties();

    @NotNull
    @DecimalMin("0.00")
    private BigDecimal commercialMultiplier = BigDecimal.ONE;

    @NotNull
    @DecimalMin("0.00")
    private BigDecimal minimumBudget = BigDecimal.ZERO;

    @Valid
    @NotNull
    private RoundingRulesProperties roundingRules = new RoundingRulesProperties();

    @Valid
    @NotEmpty
    private List<ModuleProperties> moduleCatalog = new ArrayList<>();

    @Valid
    @NotEmpty
    private List<TechnologyProperties> technologyCatalog = new ArrayList<>();

    @Valid
    @NotEmpty
    private List<SurchargeProperties> surchargeRules = new ArrayList<>();

    @Valid
    @NotEmpty
    private List<SupportProperties> supportRules = new ArrayList<>();

    @Valid
    @NotEmpty
    private List<ProjectTypeDefaultProperties> projectTypeDefaults = new ArrayList<>();

    @NotEmpty
    private Map<String, BigDecimal> projectMultipliers = new LinkedHashMap<>();

    @NotEmpty
    private Map<String, BigDecimal> stackMultipliers = new LinkedHashMap<>();

    @NotEmpty
    private Map<BudgetComplexity, BigDecimal> complexityMultipliers = new EnumMap<>(BudgetComplexity.class);

    @Getter
    @Setter
    public static class HourlyRateProperties {
        @NotNull
        @DecimalMin("0.00")
        private BigDecimal base = BigDecimal.ZERO;

        @NotNull
        @DecimalMin("0.00")
        private BigDecimal supportHourlyRate = BigDecimal.ZERO;

        @NotNull
        @DecimalMin("0.00")
        private BigDecimal extraHourRate = BigDecimal.ZERO;
    }

    @Getter
    @Setter
    public static class RoundingRulesProperties {
        @NotNull
        private TechnicalRounding technical = TechnicalRounding.ROUND_NEAREST_HOUR;

        @NotNull
        private CommercialRounding commercial = CommercialRounding.ROUND_2_DECIMALS;
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

    @Getter
    @Setter
    public static class ModuleProperties {
        @NotBlank
        private String id;
        @NotBlank
        private String category;
        @NotBlank
        private String name;
        @NotBlank
        private String description;
        @Min(0)
        private int quantity = 1;
        @NotBlank
        private String tier;
        @NotNull
        @DecimalMin("0.00")
        private BigDecimal baseHours = BigDecimal.ZERO;
        @NotNull
        @DecimalMin("0.00")
        private BigDecimal complexityWeight = BigDecimal.ONE;
        @NotNull
        @DecimalMin("0.00")
        private BigDecimal moduleMultiplier = BigDecimal.ONE;
        @NotNull
        private List<String> dependencyIds = new ArrayList<>();
        private boolean optional;
    }

    @Getter
    @Setter
    public static class TechnologyProperties {
        @NotBlank
        private String id;
        @NotBlank
        private String label;
        @NotNull
        @DecimalMin("0.00")
        private BigDecimal multiplier = BigDecimal.ONE;
        private String surchargeRuleId;
        @NotNull
        private List<String> supportedProjectTypes = new ArrayList<>();
    }

    @Getter
    @Setter
    public static class SurchargeProperties {
        @NotBlank
        private String id;
        @NotBlank
        private String code;
        @NotBlank
        private String label;
        @NotBlank
        private String reason;
        @NotNull
        private PricingAdjustmentMode mode;
        @NotNull
        @DecimalMin("0.00")
        private BigDecimal value = BigDecimal.ZERO;
        @NotNull
        private BillingCadence appliesTo;
        @NotBlank
        private String stage;
        private boolean enabledByDefault;
    }

    @Getter
    @Setter
    public static class SupportProperties {
        @NotBlank
        private String id;
        @NotBlank
        private String label;
        @NotNull
        private BillingCadence cadence = BillingCadence.MONTHLY;
        @NotNull
        @DecimalMin("0.00")
        private BigDecimal includedHours = BigDecimal.ZERO;
        @NotNull
        @DecimalMin("0.00")
        private BigDecimal hourlyRate = BigDecimal.ZERO;
        @NotNull
        @DecimalMin("0.00")
        private BigDecimal monthlyAmount = BigDecimal.ZERO;
        private boolean enabledByDefault;
    }

    @Getter
    @Setter
    public static class ProjectTypeDefaultProperties {
        @NotBlank
        private String projectType;
        @NotNull
        private List<String> defaultModuleIds = new ArrayList<>();
        @NotNull
        private List<String> defaultSurchargeRuleIds = new ArrayList<>();
        private String defaultSupportRuleId;
        private String defaultMaintenanceRuleId;
    }
}
