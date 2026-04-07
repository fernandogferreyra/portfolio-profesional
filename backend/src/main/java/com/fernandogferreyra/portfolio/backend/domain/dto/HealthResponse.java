package com.fernandogferreyra.portfolio.backend.domain.dto;

public record HealthResponse(
    String status,
    String application,
    String version
) {
}

