package com.fernandogferreyra.portfolio.backend.dto.contact;

import java.time.OffsetDateTime;
import java.util.UUID;

public record ContactResponse(
    UUID id,
    OffsetDateTime createdAt
) {
}
