package com.fernandogferreyra.portfolio.backend.dto.ai;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record AdminAiTranslateRequest(
    @NotBlank @Size(max = 8000) String text,
    @NotBlank @Pattern(regexp = "es|en") String sourceLanguage,
    @NotBlank @Pattern(regexp = "es|en") String targetLanguage,
    @Size(max = 1200) String context
) {
}
