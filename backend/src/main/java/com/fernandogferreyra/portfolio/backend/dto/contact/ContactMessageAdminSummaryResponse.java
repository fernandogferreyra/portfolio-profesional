package com.fernandogferreyra.portfolio.backend.dto.contact;

import com.fernandogferreyra.portfolio.backend.domain.enums.ContactMessageStatus;
import java.time.OffsetDateTime;
import java.util.UUID;

public record ContactMessageAdminSummaryResponse(
    UUID id,
    String name,
    String email,
    String subject,
    String messagePreview,
    ContactMessageStatus status,
    String language,
    String context,
    OffsetDateTime createdAt,
    OffsetDateTime repliedAt
) {
}
