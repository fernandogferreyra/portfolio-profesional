package com.fernandogferreyra.portfolio.backend.dto.projects;

import java.util.UUID;

public record ProjectAssetResponse(
    UUID id,
    String filename,
    String contentType,
    String url
) {
}
