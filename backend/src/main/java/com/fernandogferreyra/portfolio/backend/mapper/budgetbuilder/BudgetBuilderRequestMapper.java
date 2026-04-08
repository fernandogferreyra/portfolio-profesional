package com.fernandogferreyra.portfolio.backend.mapper.budgetbuilder;

import com.fernandogferreyra.portfolio.backend.domain.budgetbuilder.engine.BudgetCalculationUtils;
import com.fernandogferreyra.portfolio.backend.domain.budgetbuilder.enums.BillingCadence;
import com.fernandogferreyra.portfolio.backend.domain.budgetbuilder.enums.BudgetModuleSelectionMode;
import com.fernandogferreyra.portfolio.backend.domain.budgetbuilder.enums.PricingAdjustmentMode;
import com.fernandogferreyra.portfolio.backend.domain.budgetbuilder.model.BudgetProject;
import com.fernandogferreyra.portfolio.backend.dto.budgetbuilder.BudgetPreviewRequest;
import com.fernandogferreyra.portfolio.backend.dto.budgetbuilder.ManualDiscountRequest;
import java.util.List;
import org.springframework.stereotype.Component;

@Component
public class BudgetBuilderRequestMapper {

    public BudgetProject toProject(BudgetPreviewRequest request) {
        List<String> selectedModules = request.selectedModuleIds() == null
            ? List.of()
            : request.selectedModuleIds().stream()
                .map(BudgetCalculationUtils::normalizeModuleKey)
                .filter(value -> !value.isBlank())
                .distinct()
                .toList();

        return new BudgetProject(
            "budget-builder-preview",
            request.budgetName().trim(),
            BudgetCalculationUtils.normalizeProjectKey(request.projectType()),
            request.pricingMode(),
            BudgetCalculationUtils.normalizeStackKey(request.desiredStackId()),
            request.complexity(),
            request.urgency(),
            selectedModules,
            resolveSelectionMode(request, selectedModules),
            request.selectedSurchargeRuleIds() == null
                ? List.of()
                : request.selectedSurchargeRuleIds().stream()
                    .map(BudgetCalculationUtils::normalizeSurchargeKey)
                    .filter(value -> !value.isBlank())
                    .distinct()
                    .toList(),
            request.supportEnabled(),
            normalizePlanKey(request.supportPlanId()),
            normalizePlanKey(request.maintenancePlanId()),
            toManualDiscount(request.manualDiscount()),
            request.activeClients(),
            request.userScaleTierId(),
            request.notes() == null
                ? List.of()
                : request.notes().stream()
                    .map(String::trim)
                    .filter(note -> !note.isBlank())
                    .toList()
        );
    }

    private BudgetModuleSelectionMode resolveSelectionMode(
        BudgetPreviewRequest request,
        List<String> selectedModules
    ) {
        if (request.moduleSelectionMode() != null) {
            return request.moduleSelectionMode();
        }

        return selectedModules.isEmpty()
            ? BudgetModuleSelectionMode.PROJECT_DEFAULTS
            : BudgetModuleSelectionMode.EXPLICIT;
    }

    private BudgetProject.ManualDiscount toManualDiscount(ManualDiscountRequest request) {
        if (request == null || request.value() == null || request.value().signum() <= 0) {
            return null;
        }

        return new BudgetProject.ManualDiscount(
            request.label() == null || request.label().isBlank() ? "Manual discount" : request.label().trim(),
            request.reason() == null || request.reason().isBlank() ? "Manual adjustment" : request.reason().trim(),
            request.mode() == null ? PricingAdjustmentMode.FIXED : request.mode(),
            request.value(),
            request.cadence() == null ? BillingCadence.ONE_TIME : request.cadence()
        );
    }

    private String normalizePlanKey(String value) {
        if (value == null || value.isBlank()) {
            return null;
        }
        return BudgetCalculationUtils.normalizePlanKey(value);
    }
}
