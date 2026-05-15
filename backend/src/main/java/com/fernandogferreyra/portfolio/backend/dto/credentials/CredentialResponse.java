package com.fernandogferreyra.portfolio.backend.dto.credentials;

import java.time.OffsetDateTime;
import java.util.UUID;

public record CredentialResponse(
    UUID id,
    String language,
    String type,
    String title,
    String institution,
    String description,
    UUID documentId,
    String documentUrl,
    boolean published,
    int displayOrder,
    OffsetDateTime createdAt,
    OffsetDateTime updatedAt
) {
}
