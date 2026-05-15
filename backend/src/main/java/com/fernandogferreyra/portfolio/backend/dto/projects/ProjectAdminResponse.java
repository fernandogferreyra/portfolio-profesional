package com.fernandogferreyra.portfolio.backend.dto.projects;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;

public record ProjectAdminResponse(
    UUID id,
    String slug,
    String name,
    String year,
    String category,
    String summary,
    List<String> stack,
    boolean featured,
    boolean published,
    int displayOrder,
    String repositoryUrl,
    String demoUrl,
    String monographUrl,
    UUID iconDocumentId,
    String iconUrl,
    List<ProjectMetricResponse> metrics,
    List<ProjectSectionResponse> sections,
    List<String> features,
    List<ProjectAssetResponse> documentation,
    List<ProjectAssetResponse> screenshots,
    OffsetDateTime createdAt,
    OffsetDateTime updatedAt
) {
}
