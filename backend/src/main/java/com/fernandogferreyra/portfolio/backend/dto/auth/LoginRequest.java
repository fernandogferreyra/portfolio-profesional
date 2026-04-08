package com.fernandogferreyra.portfolio.backend.dto.auth;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record LoginRequest(
    @NotBlank(message = "Username is required")
    @Size(max = 80, message = "Username must be at most 80 characters")
    String username,

    @NotBlank(message = "Password is required")
    @Size(max = 255, message = "Password must be at most 255 characters")
    String password
) {
}
