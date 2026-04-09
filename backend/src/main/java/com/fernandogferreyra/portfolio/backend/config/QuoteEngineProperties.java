package com.fernandogferreyra.portfolio.backend.config;

import com.fernandogferreyra.portfolio.backend.domain.quote.enums.QuoteComplexity;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.util.EnumMap;
import java.util.LinkedHashMap;
import java.util.Map;
import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.validation.annotation.Validated;

@Getter
@Setter
@Validated
@ConfigurationProperties(prefix = "app.quote")
public class QuoteEngineProperties {

    @NotNull
    @DecimalMin(value = "0.01")
    private BigDecimal hourlyRate;

    @NotNull
    @DecimalMin(value = "0.00")
    private BigDecimal riskBufferHours = BigDecimal.ZERO;

    @NotNull
    @DecimalMin(value = "1.00")
    private BigDecimal saasModuleMultiplier = BigDecimal.ONE;

    @NotEmpty
    private Map<QuoteComplexity, BigDecimal> complexityMultipliers = new EnumMap<>(QuoteComplexity.class);

    @NotEmpty
    private Map<String, ProjectTypeRule> projectTypes = new LinkedHashMap<>();

    @NotEmpty
    private Map<String, ModuleRule> modules = new LinkedHashMap<>();

    @Getter
    @Setter
    public static class ProjectTypeRule {

        @NotBlank
        private String label;

        @NotNull
        @DecimalMin(value = "0.10")
        private BigDecimal multiplier;

        private boolean saas;
    }

    @Getter
    @Setter
    public static class ModuleRule {

        @NotBlank
        private String label;

        @NotNull
        @DecimalMin(value = "0.10")
        private BigDecimal baseHours;

        @NotNull
        @DecimalMin(value = "0.00")
        private BigDecimal optimisticHours = BigDecimal.ZERO;

        @NotNull
        @DecimalMin(value = "0.00")
        private BigDecimal probableHours = BigDecimal.ZERO;

        @NotNull
        @DecimalMin(value = "0.00")
        private BigDecimal pessimisticHours = BigDecimal.ZERO;

        @NotNull
        private java.util.List<String> dependencyIds = java.util.List.of();

        private String dependencyNote;

        private boolean saasEligible;
    }
}
