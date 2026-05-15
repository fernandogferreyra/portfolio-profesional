package com.fernandogferreyra.portfolio.backend.dto.skills;

import jakarta.validation.constraints.NotBlank;

public record SkillCategoryCreateRequest(
    @NotBlank String language,
    String slug,
    @NotBlank String label,
    String description,
    Boolean published,
    Integer displayOrder
) {
}
