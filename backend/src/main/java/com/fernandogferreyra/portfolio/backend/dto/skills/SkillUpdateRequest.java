package com.fernandogferreyra.portfolio.backend.dto.skills;

import jakarta.validation.constraints.NotBlank;
import java.util.List;
import java.util.UUID;

public record SkillUpdateRequest(
    String slug,
    @NotBlank String name,
    String description,
    UUID categoryId,
    String icon,
    String level,
    List<String> tags,
    boolean showLevel,
    boolean published,
    int displayOrder
) {
}
