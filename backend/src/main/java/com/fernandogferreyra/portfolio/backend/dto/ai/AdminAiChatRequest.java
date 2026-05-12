package com.fernandogferreyra.portfolio.backend.dto.ai;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record AdminAiChatRequest(
    @NotBlank @Size(max = 4000) String message,
    @Size(max = 1200) String context
) {
}
