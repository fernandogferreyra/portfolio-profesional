package com.fernandogferreyra.portfolio.backend.dto.projects;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record ProjectMetricUpdateRequest(
    @NotBlank @Size(max = 80) String value,
    @NotBlank @Size(max = 120) String label
) {
}
