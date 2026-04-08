package com.fernandogferreyra.portfolio.backend.dto;

public record HealthResponse(
    String status,
    String application,
    String version
) {
}

