package com.fernandogferreyra.portfolio.backend.service;

import com.fernandogferreyra.portfolio.backend.domain.documents.entity.DocumentEntity;
import com.fernandogferreyra.portfolio.backend.domain.documents.model.DocumentDownload;
import java.util.UUID;

public interface DocumentFileService {

    void saveDurableContent(DocumentEntity document, byte[] content);

    DocumentDownload download(DocumentEntity document, String missingMessage);

    void deleteDurableContent(UUID documentId);
}
