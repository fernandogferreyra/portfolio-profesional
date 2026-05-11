package com.fernandogferreyra.portfolio.backend.dto.publiccontent;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;

public record PublicContentBlockResponse(
    UUID id,
    String key,
    String language,
    String title,
    String body,
    List<String> items,
    boolean published,
    int displayOrder,
    OffsetDateTime createdAt,
    OffsetDateTime updatedAt
) {
}
