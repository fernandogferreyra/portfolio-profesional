package com.fernandogferreyra.portfolio.backend.dto.contact;

import com.fernandogferreyra.portfolio.backend.domain.enums.ContactMessageStatus;
import java.time.OffsetDateTime;
import java.util.UUID;

public record ContactMessageAdminDetailResponse(
    UUID id,
    String name,
    String email,
    String subject,
    String message,
    ContactMessageStatus status,
    String source,
    String context,
    String language,
    String userAgent,
    OffsetDateTime submittedAt,
    String replyMessage,
    OffsetDateTime repliedAt,
    String repliedBy,
    OffsetDateTime createdAt,
    OffsetDateTime updatedAt
) {
}
