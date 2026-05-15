package com.fernandogferreyra.portfolio.backend.dto.publiccontent;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.util.List;
import java.util.UUID;

public record PublicContentBlockCreateRequest(
    @NotBlank @Size(max = 120) String key,
    @NotBlank @Size(max = 8) String language,
    @NotBlank @Size(max = 220) String title,
    @NotBlank @Size(max = 5000) String body,
    @NotNull List<@NotBlank @Size(max = 220) String> items,
    UUID documentId,
    boolean published,
    @Min(0) @Max(999) int displayOrder
) {
}
