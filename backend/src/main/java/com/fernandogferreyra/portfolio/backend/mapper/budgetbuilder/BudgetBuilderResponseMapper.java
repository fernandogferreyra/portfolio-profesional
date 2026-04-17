package com.fernandogferreyra.portfolio.backend.mapper.budgetbuilder;

import com.fernandogferreyra.portfolio.backend.domain.budgetbuilder.enums.CategoryBillingType;
import com.fernandogferreyra.portfolio.backend.domain.budgetbuilder.model.BudgetCalculationResult;
import com.fernandogferreyra.portfolio.backend.domain.budgetbuilder.model.ConfigurationSnapshot;
import com.fernandogferreyra.portfolio.backend.domain.budgetbuilder.model.EstimateModule;
import com.fernandogferreyra.portfolio.backend.domain.budgetbuilder.model.MonthlyBreakdown;
import com.fernandogferreyra.portfolio.backend.dto.budgetbuilder.AreaBreakdownDto;
import com.fernandogferreyra.portfolio.backend.dto.budgetbuilder.AreaModuleDto;
import com.fernandogferreyra.portfolio.backend.dto.budgetbuilder.BudgetDiscountResponse;
import com.fernandogferreyra.portfolio.backend.dto.budgetbuilder.BudgetExplanationResponse;
import com.fernandogferreyra.portfolio.backend.dto.budgetbuilder.BudgetModuleResponse;
import com.fernandogferreyra.portfolio.backend.dto.budgetbuilder.BudgetPreviewResponse;
import com.fernandogferreyra.portfolio.backend.dto.budgetbuilder.BudgetSurchargeResponse;
import com.fernandogferreyra.portfolio.backend.dto.budgetbuilder.MonthlyBreakdownDto;
import com.fernandogferreyra.portfolio.backend.dto.budgetbuilder.TechnicalSummaryDto;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import org.springframework.stereotype.Component;

@Component
public class BudgetBuilderResponseMapper {

    public BudgetPreviewResponse toPreviewResponse(
        BudgetCalculationResult result,
        ConfigurationSnapshot configuration,
        String configurationSnapshotId,
        String previewHash
    ) {
        List<BudgetModuleResponse> moduleResponses = result.technicalEstimate().modules().stream()
            .map(module -> new BudgetModuleResponse(
                module.id(),
                module.category(),
                module.name(),
                module.description(),
                module.dependencyIds(),
                module.blockingNote(),
                module.estimatedHours(),
                calculateModuleBaseAmount(module, configuration)))
            .toList();
        TechnicalSummaryDto technicalSummary = toTechnicalSummary(result);

        return new BudgetPreviewResponse(
            configurationSnapshotId,
            previewHash,
            result.commercialBudget().currency(),
            result.technicalEstimate().totalHours(),
            result.technicalEstimate().totalWeeks(),
            result.commercialBudget().baseAmount(),
            result.commercialBudget().oneTimeSubtotal(),
            result.commercialBudget().monthlySubtotal(),
            result.commercialBudget().finalOneTimeTotal(),
            result.commercialBudget().finalMonthlyTotal(),
            technicalSummary,
            toAreaBreakdown(moduleResponses, configuration, technicalSummary.totalBaseAmount()),
            toMonthlyBreakdown(result.commercialBudget().monthlyBreakdown()),
            moduleResponses,
            result.commercialBudget().surchargeItems().stream()
                .map(item -> new BudgetSurchargeResponse(
                    item.code(),
                    item.label(),
                    item.reason(),
                    item.cadence().name(),
                    item.amount()))
                .toList(),
            result.commercialBudget().discountItems().stream()
                .map(item -> new BudgetDiscountResponse(
                    item.code(),
                    item.label(),
                    item.reason(),
                    item.cadence().name(),
                    item.amount()))
                .toList(),
            result.commercialBudget().pricingExplanation().stream()
                .map(item -> new BudgetExplanationResponse(
                    item.stage(),
                    item.title(),
                    item.description(),
                    item.amountDelta(),
                    item.tone()))
                .toList()
        );
    }

    private TechnicalSummaryDto toTechnicalSummary(BudgetCalculationResult result) {
        return new TechnicalSummaryDto(
            result.technicalEstimate().totalHours(),
            result.technicalEstimate().totalWeeks(),
            result.commercialBudget().baseAmount()
        );
    }

    private List<AreaBreakdownDto> toAreaBreakdown(
        List<BudgetModuleResponse> moduleResponses,
        ConfigurationSnapshot configuration,
        BigDecimal totalBaseAmount
    ) {
        Map<String, String> categoryLabels = configuration.categoryRules().stream()
            .collect(Collectors.toMap(
                ConfigurationSnapshot.CategoryRule::id,
                ConfigurationSnapshot.CategoryRule::label,
                (first, second) -> first,
                LinkedHashMap::new
            ));

        Map<String, List<BudgetModuleResponse>> modulesByArea = moduleResponses.stream()
            .collect(Collectors.groupingBy(
                BudgetModuleResponse::category,
                LinkedHashMap::new,
                Collectors.toList()
            ));

        return modulesByArea.entrySet().stream()
            .map(entry -> {
                BigDecimal areaHours = entry.getValue().stream()
                    .map(BudgetModuleResponse::estimatedHours)
                    .reduce(BigDecimal.ZERO, BigDecimal::add);
                BigDecimal areaBaseAmount = entry.getValue().stream()
                    .map(BudgetModuleResponse::baseAmount)
                    .reduce(BigDecimal.ZERO, BigDecimal::add);
                BigDecimal shareOfTechnicalTotal = totalBaseAmount != null && totalBaseAmount.signum() > 0
                    ? areaBaseAmount.divide(totalBaseAmount, 4, RoundingMode.HALF_UP)
                    : BigDecimal.ZERO;

                return new AreaBreakdownDto(
                    entry.getKey(),
                    categoryLabels.getOrDefault(entry.getKey(), entry.getKey()),
                    areaHours,
                    areaBaseAmount,
                    entry.getValue().size(),
                    shareOfTechnicalTotal,
                    entry.getValue().stream()
                        .map(module -> new AreaModuleDto(
                            module.id(),
                            module.name(),
                            module.estimatedHours(),
                            module.baseAmount()
                        ))
                        .toList()
                );
            })
            .toList();
    }

    private MonthlyBreakdownDto toMonthlyBreakdown(MonthlyBreakdown monthlyBreakdown) {
        if (monthlyBreakdown == null) {
            return null;
        }

        return new MonthlyBreakdownDto(
            monthlyBreakdown.developmentRecovery(),
            monthlyBreakdown.infrastructure(),
            monthlyBreakdown.support(),
            monthlyBreakdown.maintenance(),
            monthlyBreakdown.userScaleAdjustment(),
            monthlyBreakdown.extraHours(),
            monthlyBreakdown.margin(),
            monthlyBreakdown.monthlySubtotal(),
            monthlyBreakdown.finalMonthlyTotal()
        );
    }

    private BigDecimal calculateModuleBaseAmount(EstimateModule module, ConfigurationSnapshot configuration) {
        ConfigurationSnapshot.CategoryRule categoryRule = configuration.categoryRules().stream()
            .filter(rule -> rule.id().equals(module.category()))
            .findFirst()
            .orElse(null);

        if (categoryRule == null) {
            return BigDecimal.ZERO;
        }

        if (categoryRule.billingType() == CategoryBillingType.TIME_BASED) {
            return module.estimatedHours().multiply(categoryRule.rate());
        }

        return categoryRule.rate();
    }
}
