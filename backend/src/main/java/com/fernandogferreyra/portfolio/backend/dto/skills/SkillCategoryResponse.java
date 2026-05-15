package com.fernandogferreyra.portfolio.backend.dto.skills;

import java.util.List;
import java.util.UUID;

public record SkillCategoryResponse(
    UUID id,
    String language,
    String slug,
    String label,
    String description,
    boolean published,
    int displayOrder,
    List<SkillResponse> skills
) {
}
