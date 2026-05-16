package com.fernandogferreyra.portfolio.backend.dto.skills;

import jakarta.validation.constraints.NotBlank;
import java.util.List;
import java.util.UUID;

public record SkillCreateRequest(
    @NotBlank String language,
    String slug,
    @NotBlank String name,
    String description,
    UUID categoryId,
    String icon,
    UUID iconDocumentId,
    String accentColor,
    String level,
    List<String> tags,
    Boolean showLevel,
    Boolean published,
    Integer displayOrder
) {
}
