package com.fernandogferreyra.portfolio.backend.dto.contact;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record ContactMessageReplyRequest(
    @NotBlank(message = "Reply message is required")
    @Size(max = 4000, message = "Reply message must be at most 4000 characters")
    String message,

    @Size(max = 160, message = "Reply subject must be at most 160 characters")
    String subject
) {
}
