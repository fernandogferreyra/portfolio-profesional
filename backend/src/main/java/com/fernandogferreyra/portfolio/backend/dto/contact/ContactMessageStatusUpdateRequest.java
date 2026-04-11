package com.fernandogferreyra.portfolio.backend.dto.contact;

import com.fernandogferreyra.portfolio.backend.domain.enums.ContactMessageStatus;
import jakarta.validation.constraints.NotNull;

public record ContactMessageStatusUpdateRequest(
    @NotNull(message = "Status is required")
    ContactMessageStatus status
) {
}
