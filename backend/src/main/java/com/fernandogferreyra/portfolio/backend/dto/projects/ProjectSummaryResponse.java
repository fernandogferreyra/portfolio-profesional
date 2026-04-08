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
    String repositoryUrl
) {
}

