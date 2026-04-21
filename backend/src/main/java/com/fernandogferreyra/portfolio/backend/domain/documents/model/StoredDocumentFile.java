package com.fernandogferreyra.portfolio.backend.domain.documents.model;

public record StoredDocumentFile(
    String storedFilename,
    String storagePath
) {
}
