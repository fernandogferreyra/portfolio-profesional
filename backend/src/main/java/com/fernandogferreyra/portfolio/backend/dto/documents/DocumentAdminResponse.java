package com.fernandogferreyra.portfolio.backend.dto.documents;

import java.time.OffsetDateTime;
import java.util.UUID;

public record DocumentAdminResponse(
    UUID id,
    String purpose,
    String originalFilename,
    String storedFilename,
    String contentType,
    long sizeBytes,
    String storagePath,
    OffsetDateTime createdAt,
    OffsetDateTime updatedAt
) {
}
