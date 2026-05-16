package com.fernandogferreyra.portfolio.backend.service.impl;

import com.fernandogferreyra.portfolio.backend.domain.documents.entity.DocumentContentEntity;
import com.fernandogferreyra.portfolio.backend.domain.documents.entity.DocumentEntity;
import com.fernandogferreyra.portfolio.backend.domain.documents.model.DocumentDownload;
import com.fernandogferreyra.portfolio.backend.repository.documents.DocumentContentRepository;
import com.fernandogferreyra.portfolio.backend.service.DocumentFileService;
import com.fernandogferreyra.portfolio.backend.service.StorageService;
import java.io.IOException;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
@RequiredArgsConstructor
public class DocumentFileServiceImpl implements DocumentFileService {

    private final DocumentContentRepository documentContentRepository;
    private final StorageService storageService;

    @Override
    @Transactional
    public void saveDurableContent(DocumentEntity document, byte[] content) {
        DocumentContentEntity entity = documentContentRepository.findById(document.getId())
            .orElseGet(DocumentContentEntity::new);
        entity.setId(document.getId());
        entity.setContent(content.clone());

        documentContentRepository.save(entity);
    }

    @Override
    @Transactional(readOnly = true)
    public DocumentDownload download(DocumentEntity document, String missingMessage) {
        try {
            return new DocumentDownload(
                storageService.load(document.getStoragePath()),
                document.getOriginalFilename(),
                document.getContentType(),
                document.getSizeBytes());
        } catch (IOException exception) {
            return documentContentRepository.findById(document.getId())
                .map(content -> new DocumentDownload(
                    new ByteArrayResource(content.getContent()),
                    document.getOriginalFilename(),
                    document.getContentType(),
                    document.getSizeBytes()))
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, missingMessage));
        }
    }

    @Override
    @Transactional
    public void deleteDurableContent(UUID documentId) {
        documentContentRepository.deleteById(documentId);
    }
}
