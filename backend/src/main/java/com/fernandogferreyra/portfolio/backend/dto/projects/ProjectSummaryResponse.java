package com.fernandogferreyra.portfolio.backend.dto.projects;

import java.util.List;

public record ProjectSummaryResponse(
    String slug,
    String name,
    String year,
    String category,
    String summary,
    List<String> stack,
    boolean featured,
    String repositoryUrl,
    String demoUrl,
    String monographUrl,
    String iconUrl,
    List<ProjectMetricResponse> metrics,
    List<ProjectSectionResponse> sections,
    List<String> features,
    List<ProjectAssetResponse> documentation,
    List<ProjectAssetResponse> screenshots
) {
}
