package com.fernandogferreyra.portfolio.backend.service.impl;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.fernandogferreyra.portfolio.backend.domain.documents.entity.DocumentContentEntity;
import com.fernandogferreyra.portfolio.backend.domain.documents.entity.DocumentEntity;
import com.fernandogferreyra.portfolio.backend.repository.documents.DocumentContentRepository;
import com.fernandogferreyra.portfolio.backend.service.StorageService;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.Optional;
import java.util.UUID;
import org.junit.jupiter.api.Test;
import org.springframework.web.server.ResponseStatusException;

class DocumentFileServiceImplTest {

    private final DocumentContentRepository documentContentRepository = org.mockito.Mockito.mock(DocumentContentRepository.class);
    private final StorageService storageService = org.mockito.Mockito.mock(StorageService.class);
    private final DocumentFileServiceImpl service = new DocumentFileServiceImpl(documentContentRepository, storageService);

    @Test
    void downloadFallsBackToDurableContentWhenFilesystemFileIsMissing() throws Exception {
        DocumentEntity document = document();
        DocumentContentEntity content = new DocumentContentEntity();
        content.setId(document.getId());
        content.setContent("durable-cv".getBytes(StandardCharsets.UTF_8));

        when(storageService.load(document.getStoragePath())).thenThrow(new IOException("missing cache"));
        when(documentContentRepository.findById(document.getId())).thenReturn(Optional.of(content));

        var download = service.download(document, "Linked document file not found");

        assertThat(download.originalFilename()).isEqualTo("profile-cv.pdf");
        assertThat(download.resource().getContentAsByteArray()).isEqualTo("durable-cv".getBytes(StandardCharsets.UTF_8));
    }

    @Test
    void downloadKeepsExplicitNotFoundWhenNoDurableContentExists() throws Exception {
        DocumentEntity document = document();

        when(storageService.load(document.getStoragePath())).thenThrow(new IOException("missing cache"));
        when(documentContentRepository.findById(document.getId())).thenReturn(Optional.empty());

        assertThatThrownBy(() -> service.download(document, "Linked document file not found"))
            .isInstanceOf(ResponseStatusException.class)
            .hasMessageContaining("Linked document file not found");
    }

    @Test
    void deleteDurableContentDeletesByDocumentId() {
        UUID documentId = UUID.randomUUID();

        service.deleteDurableContent(documentId);

        verify(documentContentRepository).deleteById(documentId);
    }

    private DocumentEntity document() {
        DocumentEntity document = new DocumentEntity();
        document.setId(UUID.randomUUID());
        document.setOriginalFilename("profile-cv.pdf");
        document.setContentType("application/pdf");
        document.setSizeBytes(10);
        document.setStoragePath("profile-cv.pdf");
        return document;
    }
}
