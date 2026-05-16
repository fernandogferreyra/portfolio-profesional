package com.fernandogferreyra.portfolio.backend.dto.skills;

import java.util.List;
import java.util.UUID;

public record SkillResponse(
    UUID id,
    String language,
    String slug,
    String name,
    String description,
    UUID categoryId,
    String categorySlug,
    String icon,
    UUID iconDocumentId,
    String iconUrl,
    String accentColor,
    String level,
    List<String> tags,
    boolean showLevel,
    boolean published,
    int displayOrder
) {
}
