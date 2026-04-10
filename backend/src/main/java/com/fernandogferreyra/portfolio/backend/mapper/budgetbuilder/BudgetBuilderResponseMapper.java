package com.fernandogferreyra.portfolio.backend.mapper.budgetbuilder;

import com.fernandogferreyra.portfolio.backend.domain.budgetbuilder.enums.CategoryBillingType;
import com.fernandogferreyra.portfolio.backend.domain.budgetbuilder.model.BudgetCalculationResult;
import com.fernandogferreyra.portfolio.backend.domain.budgetbuilder.model.ConfigurationSnapshot;
import com.fernandogferreyra.portfolio.backend.domain.budgetbuilder.model.EstimateModule;
import com.fernandogferreyra.portfolio.backend.dto.budgetbuilder.BudgetDiscountResponse;
import com.fernandogferreyra.portfolio.backend.dto.budgetbuilder.BudgetExplanationResponse;
import com.fernandogferreyra.portfolio.backend.dto.budgetbuilder.BudgetModuleResponse;
import com.fernandogferreyra.portfolio.backend.dto.budgetbuilder.BudgetPreviewResponse;
import com.fernandogferreyra.portfolio.backend.dto.budgetbuilder.BudgetSurchargeResponse;
import java.math.BigDecimal;
import org.springframework.stereotype.Component;

@Component
public class BudgetBuilderResponseMapper {

    public BudgetPreviewResponse toPreviewResponse(
        BudgetCalculationResult result,
        ConfigurationSnapshot configuration,
        String configurationSnapshotId,
        String previewHash
    ) {
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
            result.technicalEstimate().modules().stream()
                .map(module -> new BudgetModuleResponse(
                    module.id(),
                    module.category(),
                    module.name(),
                    module.description(),
                    module.dependencyIds(),
                    module.blockingNote(),
                    module.estimatedHours(),
                    calculateModuleBaseAmount(module, configuration)))
                .toList(),
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
