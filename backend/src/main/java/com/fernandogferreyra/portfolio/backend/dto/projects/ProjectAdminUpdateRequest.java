package com.fernandogferreyra.portfolio.backend.dto.projects;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.util.List;

public record ProjectAdminUpdateRequest(
    @NotBlank @Size(max = 120) String slug,
    @NotBlank @Size(max = 180) String name,
    @NotBlank @Size(max = 4) String year,
    @NotBlank @Size(max = 80) String category,
    @NotBlank @Size(max = 500) String summary,
    @Size(max = 400) String repositoryUrl,
    @NotNull @NotEmpty List<@NotBlank @Size(max = 80) String> stack,
    boolean featured,
    boolean published,
    @Min(0) @Max(999) int displayOrder
) {
}
