package com.fernandogferreyra.portfolio.backend.dto.budgetbuilder;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fernandogferreyra.portfolio.backend.domain.budgetbuilder.enums.BudgetComplexity;
import com.fernandogferreyra.portfolio.backend.domain.budgetbuilder.enums.BudgetModuleSelectionMode;
import com.fernandogferreyra.portfolio.backend.domain.budgetbuilder.enums.BudgetPricingMode;
import com.fernandogferreyra.portfolio.backend.domain.budgetbuilder.enums.BudgetUrgency;
import jakarta.validation.Valid;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.math.BigDecimal;
import java.util.List;

@JsonIgnoreProperties(ignoreUnknown = true)
public record BudgetPreviewRequest(
    @NotBlank(message = "Budget name is required")
    @Size(max = 160, message = "Budget name must be at most 160 characters")
    String budgetName,

    @NotBlank(message = "Project type is required")
    String projectType,

    @NotNull(message = "Pricing mode is required")
    BudgetPricingMode pricingMode,

    @NotBlank(message = "Desired stack is required")
    String desiredStackId,

    @NotNull(message = "Complexity is required")
    BudgetComplexity complexity,

    @NotNull(message = "Urgency is required")
    BudgetUrgency urgency,

    @NotNull(message = "Selected modules collection is required")
    List<@NotBlank(message = "Module code is required") String> selectedModuleIds,

    BudgetModuleSelectionMode moduleSelectionMode,

    List<@NotBlank(message = "Surcharge rule id is required") String> selectedSurchargeRuleIds,

    Boolean supportEnabled,

    String supportPlanId,

    String maintenancePlanId,

    @DecimalMin(value = "0.00", message = "Hourly rate override must be greater than or equal to zero")
    BigDecimal hourlyRateOverride,

    @Valid ManualDiscountRequest manualDiscount,

    @Min(value = 0, message = "Active clients must be greater than or equal to zero")
    Integer activeClients,

    String userScaleTierId,

    @Min(value = 0, message = "Extra monthly hours must be greater than or equal to zero")
    Integer extraMonthlyHours,

    List<String> notes
) {
}
