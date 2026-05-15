package com.fernandogferreyra.portfolio.backend.dto.credentials;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record CredentialCreateRequest(
    @NotBlank @Size(max = 8) String language
) {
}
