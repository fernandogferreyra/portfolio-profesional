package com.fernandogferreyra.portfolio.backend.dto.budgetbuilder;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

@JsonIgnoreProperties(ignoreUnknown = true)
public record BudgetSaveRequest(
    @Valid
    @NotNull(message = "Preview input is required")
    BudgetPreviewRequest input,

    @NotBlank(message = "Configuration snapshot id is required")
    String expectedConfigurationSnapshotId,

    @NotBlank(message = "Preview hash is required")
    String expectedPreviewHash
) {
}
