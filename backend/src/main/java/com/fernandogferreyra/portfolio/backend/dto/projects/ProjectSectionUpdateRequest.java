package com.fernandogferreyra.portfolio.backend.dto.projects;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.util.List;

public record ProjectSectionUpdateRequest(
    @NotBlank @Size(max = 120) String title,
    @NotNull List<@NotBlank @Size(max = 240) String> items
) {
}
