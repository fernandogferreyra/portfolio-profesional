package com.fernandogferreyra.portfolio.backend.module.contact.domain.dto;

import com.fernandogferreyra.portfolio.backend.domain.enums.ContactMessageStatus;
import java.time.OffsetDateTime;
import java.util.UUID;

public record ContactResponse(
    UUID id,
    ContactMessageStatus status,
    String detail,
    OffsetDateTime receivedAt
) {
}
