package com.fernandogferreyra.portfolio.backend.mapper.budgetbuilder;

import com.fernandogferreyra.portfolio.backend.domain.budgetbuilder.model.BudgetCalculationResult;
import com.fernandogferreyra.portfolio.backend.dto.budgetbuilder.BudgetDiscountResponse;
import com.fernandogferreyra.portfolio.backend.dto.budgetbuilder.BudgetExplanationResponse;
import com.fernandogferreyra.portfolio.backend.dto.budgetbuilder.BudgetModuleResponse;
import com.fernandogferreyra.portfolio.backend.dto.budgetbuilder.BudgetPreviewResponse;
import com.fernandogferreyra.portfolio.backend.dto.budgetbuilder.BudgetSurchargeResponse;
import org.springframework.stereotype.Component;

@Component
public class BudgetBuilderResponseMapper {

    public BudgetPreviewResponse toPreviewResponse(
        BudgetCalculationResult result,
        String configurationSnapshotId,
        String previewHash
    ) {
        return new BudgetPreviewResponse(
            configurationSnapshotId,
            previewHash,
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
                    module.estimatedHours()))
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
}
