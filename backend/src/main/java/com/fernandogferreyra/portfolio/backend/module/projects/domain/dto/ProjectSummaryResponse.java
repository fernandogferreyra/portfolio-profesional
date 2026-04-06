package com.fernandogferreyra.portfolio.backend.module.projects.domain.dto;

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

