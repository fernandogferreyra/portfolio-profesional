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
    OffsetDateTime createdAt,
    OffsetDateTime updatedAt
) {
}
