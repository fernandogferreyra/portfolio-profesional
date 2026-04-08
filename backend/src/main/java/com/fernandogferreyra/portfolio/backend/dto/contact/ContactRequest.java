package com.fernandogferreyra.portfolio.backend.dto.contact;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.time.OffsetDateTime;

@JsonIgnoreProperties(ignoreUnknown = true)
public record ContactRequest(
    @NotBlank(message = "Name is required")
    @Size(max = 120, message = "Name must be at most 120 characters")
    String name,

    @NotBlank(message = "Email is required")
    @Email(message = "Email must be valid")
    @Size(max = 180, message = "Email must be at most 180 characters")
    String email,

    @NotBlank(message = "Message is required")
    @Size(max = 2500, message = "Message must be at most 2500 characters")
    String message,

    @Size(max = 160, message = "Subject must be at most 160 characters")
    String subject,

    String source,

    String context,

    String language,

    String userAgent,

    OffsetDateTime submittedAt
) {
}

