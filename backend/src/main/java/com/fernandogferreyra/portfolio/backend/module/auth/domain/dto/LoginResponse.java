package com.fernandogferreyra.portfolio.backend.module.auth.domain.dto;

import com.fernandogferreyra.portfolio.backend.domain.enums.UserRole;
import java.time.OffsetDateTime;

public record LoginResponse(
    String accessToken,
    String tokenType,
    OffsetDateTime expiresAt,
    String username,
    UserRole role
) {
}
