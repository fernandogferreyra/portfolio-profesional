package com.fernandogferreyra.portfolio.backend.dto.projects;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.util.List;
import java.util.UUID;

public record ProjectAdminUpdateRequest(
    @NotBlank @Size(max = 120) String slug,
    @NotBlank @Size(max = 180) String name,
    @NotBlank @Size(max = 4) String year,
    @NotBlank @Size(max = 80) String category,
    @NotBlank @Size(max = 500) String summary,
    @Size(max = 400) String repositoryUrl,
    @Size(max = 400) String demoUrl,
    @Size(max = 400) String monographUrl,
    UUID iconDocumentId,
    @NotNull @NotEmpty List<@NotBlank @Size(max = 80) String> stack,
    @NotNull List<ProjectMetricUpdateRequest> metrics,
    @NotNull List<ProjectSectionUpdateRequest> sections,
    @NotNull List<@NotBlank @Size(max = 160) String> features,
    @NotNull List<UUID> documentationDocumentIds,
    @NotNull List<UUID> screenshotDocumentIds,
    boolean featured,
    boolean published,
    @Min(0) @Max(999) int displayOrder
) {
}
