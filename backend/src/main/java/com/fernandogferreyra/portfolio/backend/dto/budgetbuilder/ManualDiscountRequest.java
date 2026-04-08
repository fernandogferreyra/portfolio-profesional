package com.fernandogferreyra.portfolio.backend.dto.budgetbuilder;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fernandogferreyra.portfolio.backend.domain.budgetbuilder.enums.BillingCadence;
import com.fernandogferreyra.portfolio.backend.domain.budgetbuilder.enums.PricingAdjustmentMode;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Size;
import java.math.BigDecimal;

@JsonIgnoreProperties(ignoreUnknown = true)
public record ManualDiscountRequest(
    @Size(max = 120, message = "Discount label must be at most 120 characters")
    String label,

    @Size(max = 280, message = "Discount reason must be at most 280 characters")
    String reason,

    PricingAdjustmentMode mode,

    @DecimalMin(value = "0.00", message = "Discount value must be greater than or equal to zero")
    BigDecimal value,

    BillingCadence cadence
) {
}
