package com.fernandogferreyra.portfolio.backend.domain.documents.model;

import org.springframework.core.io.Resource;

public record DocumentDownload(
    Resource resource,
    String originalFilename,
    String contentType,
    long sizeBytes
) {
}
