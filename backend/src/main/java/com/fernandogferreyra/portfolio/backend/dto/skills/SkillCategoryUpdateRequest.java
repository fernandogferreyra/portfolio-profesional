package com.fernandogferreyra.portfolio.backend.dto.skills;

import jakarta.validation.constraints.NotBlank;

public record SkillCategoryUpdateRequest(
    String slug,
    @NotBlank String label,
    String description,
    boolean published,
    int displayOrder
) {
}
