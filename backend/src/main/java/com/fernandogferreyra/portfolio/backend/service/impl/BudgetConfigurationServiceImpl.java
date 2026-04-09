package com.fernandogferreyra.portfolio.backend.service.impl;

import com.fernandogferreyra.portfolio.backend.config.BudgetBuilderSeedProperties;
import com.fernandogferreyra.portfolio.backend.domain.budgetbuilder.model.ConfigurationSnapshot;
import com.fernandogferreyra.portfolio.backend.domain.budgetbuilder.model.EstimateModule;
import com.fernandogferreyra.portfolio.backend.service.BudgetConfigurationService;
import java.util.List;
import java.util.Map;
import org.springframework.stereotype.Service;

@Service
public class BudgetConfigurationServiceImpl implements BudgetConfigurationService {

    private final BudgetBuilderSeedProperties properties;

    public BudgetConfigurationServiceImpl(BudgetBuilderSeedProperties properties) {
        this.properties = properties;
    }

    @Override
    public ConfigurationSnapshot getActiveConfiguration() {
        return new ConfigurationSnapshot(
            properties.getConfigurationId(),
            properties.getVersion(),
            properties.getSource(),
            properties.getCurrency(),
            properties.getCreatedAt(),
            properties.getWorkingHoursPerWeek(),
            properties.getRiskBufferHours(),
            new ConfigurationSnapshot.HourlyRateConfig(
                properties.getHourlyRate().getBase(),
                properties.getHourlyRate().getSupportHourlyRate(),
                properties.getHourlyRate().getExtraHourRate()
            ),
            properties.getCommercialMultiplier(),
            properties.getMinimumBudget(),
            new ConfigurationSnapshot.RoundingRules(
                mapTechnicalRounding(properties.getRoundingRules().getTechnical()),
                mapCommercialRounding(properties.getRoundingRules().getCommercial())
            ),
            properties.getModuleCatalog().stream()
                .map(module -> new EstimateModule(
                    module.getId(),
                    module.getCategory(),
                    module.getName(),
                    module.getDescription(),
                    module.getQuantity(),
                    module.getTier(),
                    module.getBaseHours(),
                    module.getOptimisticHours(),
                    module.getProbableHours(),
                    module.getPessimisticHours(),
                    module.getComplexityWeight(),
                    module.getModuleMultiplier(),
                    List.copyOf(module.getDependencyIds()),
                    module.getBlockingNote(),
                    module.isOptional(),
                    null
                ))
                .toList(),
            properties.getCategoryRules().stream()
                .map(rule -> new ConfigurationSnapshot.CategoryRule(
                    rule.getId(),
                    rule.getLabel(),
                    rule.getBillingType(),
                    rule.getRate(),
                    rule.getCadence()
                ))
                .toList(),
            properties.getTechnologyCatalog().stream()
                .map(technology -> new ConfigurationSnapshot.TechnologyRule(
                    technology.getId(),
                    technology.getLabel(),
                    technology.getDescription(),
                    technology.getMultiplier(),
                    technology.getSurchargeRuleId(),
                    List.copyOf(technology.getSupportedProjectTypes())
                ))
                .toList(),
            properties.getSurchargeRules().stream()
                .map(rule -> new ConfigurationSnapshot.SurchargeRule(
                    rule.getId(),
                    rule.getCode(),
                    rule.getLabel(),
                    rule.getReason(),
                    rule.getMode(),
                    rule.getValue(),
                    rule.getAppliesTo(),
                    rule.getStage(),
                    rule.isEnabledByDefault()
                ))
                .toList(),
            properties.getSupportRules().stream()
                .map(rule -> new ConfigurationSnapshot.SupportRule(
                    rule.getId(),
                    rule.getLabel(),
                    rule.getCadence(),
                    rule.getIncludedHours(),
                    rule.getHourlyRate(),
                    rule.getMonthlyAmount(),
                    rule.isEnabledByDefault()
                ))
                .toList(),
            properties.getMaintenanceRules().stream()
                .map(rule -> new ConfigurationSnapshot.MaintenanceRule(
                    rule.getId(),
                    rule.getLabel(),
                    rule.getCadence(),
                    rule.getMonthlyAmount(),
                    rule.isEnabledByDefault()
                ))
                .toList(),
            properties.getUserScaleRules().stream()
                .map(rule -> new ConfigurationSnapshot.UserScaleRule(
                    rule.getId(),
                    rule.getLabel(),
                    rule.getMinUsers(),
                    rule.getMaxUsers(),
                    rule.getMode(),
                    rule.getValue()
                ))
                .toList(),
            new ConfigurationSnapshot.SaasPricingRules(
                properties.getSaasPricing().getRecoveryMonths(),
                properties.getSaasPricing().getMonthlyInfrastructureCost(),
                properties.getSaasPricing().getMarginPercentage()
            ),
            properties.getProjectTypeDefaults().stream()
                .map(rule -> new ConfigurationSnapshot.ProjectTypeDefaultRule(
                    rule.getProjectType(),
                    rule.getLabel(),
                    rule.getDescription(),
                    List.copyOf(rule.getDefaultModuleIds()),
                    List.copyOf(rule.getDefaultSurchargeRuleIds()),
                    rule.getDefaultSupportRuleId(),
                    rule.getDefaultMaintenanceRuleId()
                ))
                .toList(),
            Map.copyOf(properties.getProjectMultipliers()),
            Map.copyOf(properties.getStackMultipliers()),
            Map.copyOf(properties.getComplexityMultipliers())
        );
    }

    private ConfigurationSnapshot.TechnicalRounding mapTechnicalRounding(
        BudgetBuilderSeedProperties.TechnicalRounding value
    ) {
        return value == BudgetBuilderSeedProperties.TechnicalRounding.NONE
            ? ConfigurationSnapshot.TechnicalRounding.NONE
            : ConfigurationSnapshot.TechnicalRounding.ROUND_NEAREST_HOUR;
    }

    private ConfigurationSnapshot.CommercialRounding mapCommercialRounding(
        BudgetBuilderSeedProperties.CommercialRounding value
    ) {
        return switch (value) {
            case ROUND_UP_INTEGER -> ConfigurationSnapshot.CommercialRounding.ROUND_UP_INTEGER;
            case NONE -> ConfigurationSnapshot.CommercialRounding.NONE;
            case ROUND_2_DECIMALS -> ConfigurationSnapshot.CommercialRounding.ROUND_2_DECIMALS;
        };
    }
}
