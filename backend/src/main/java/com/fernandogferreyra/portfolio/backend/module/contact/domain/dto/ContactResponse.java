package com.fernandogferreyra.portfolio.backend.module.contact.domain.dto;

import java.time.OffsetDateTime;
import java.util.UUID;

public record ContactResponse(
    UUID id,
    OffsetDateTime createdAt
) {
}
