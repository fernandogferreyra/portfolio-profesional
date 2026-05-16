package com.fernandogferreyra.portfolio.backend.dto.credentials;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.util.UUID;

public record CredentialUpdateRequest(
    @NotBlank @Size(max = 8) String language,
    @NotBlank @Size(max = 80) String type,
    @NotBlank @Size(max = 220) String title,
    @NotBlank @Size(max = 180) String institution,
    @NotBlank @Size(max = 5000) String description,
    UUID documentId,
    boolean published,
    @Min(0) @Max(999) int displayOrder
) {
}
