package com.fernandogferreyra.portfolio.backend.service.impl;

import com.fernandogferreyra.portfolio.backend.domain.documents.entity.DocumentEntity;
import com.fernandogferreyra.portfolio.backend.domain.documents.model.DocumentDownload;
import com.fernandogferreyra.portfolio.backend.domain.publiccontent.entity.PublicContentBlockEntity;
import com.fernandogferreyra.portfolio.backend.dto.publiccontent.PublicContentBlockCreateRequest;
import com.fernandogferreyra.portfolio.backend.dto.publiccontent.PublicContentBlockResponse;
import com.fernandogferreyra.portfolio.backend.dto.publiccontent.PublicContentBlockUpdateRequest;
import com.fernandogferreyra.portfolio.backend.mapper.publiccontent.PublicContentBlockMapper;
import com.fernandogferreyra.portfolio.backend.repository.documents.DocumentRepository;
import com.fernandogferreyra.portfolio.backend.repository.publiccontent.PublicContentBlockRepository;
import com.fernandogferreyra.portfolio.backend.service.DocumentFileService;
import com.fernandogferreyra.portfolio.backend.service.DocumentService;
import com.fernandogferreyra.portfolio.backend.service.PublicContentBlockService;
import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
@RequiredArgsConstructor
public class PublicContentBlockServiceImpl implements PublicContentBlockService {

    private final PublicContentBlockMapper publicContentBlockMapper;
    private final PublicContentBlockRepository publicContentBlockRepository;
    private final DocumentRepository documentRepository;
    private final DocumentFileService documentFileService;
    private final DocumentService documentService;

    @Override
    @Transactional(readOnly = true)
    public List<PublicContentBlockResponse> getPublicBlocks() {
        return publicContentBlockRepository.findByPublishedTrueOrderByDisplayOrderAscContentKeyAscLanguageAsc()
            .stream()
            .map(publicContentBlockMapper::toResponse)
            .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<PublicContentBlockResponse> getAdminBlocks() {
        return publicContentBlockRepository.findAllByOrderByDisplayOrderAscContentKeyAscLanguageAsc()
            .stream()
            .map(publicContentBlockMapper::toResponse)
            .toList();
    }

    @Override
    @Transactional
    public PublicContentBlockResponse createBlock(PublicContentBlockCreateRequest request) {
        if (publicContentBlockRepository.existsByContentKeyAndLanguage(request.key().trim(), request.language().trim())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Public content block already exists");
        }

        if (request.documentId() != null && !documentRepository.existsById(request.documentId())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Linked document not found");
        }

        PublicContentBlockEntity entity = publicContentBlockMapper.toEntity(request);
        return publicContentBlockMapper.toResponse(publicContentBlockRepository.save(entity));
    }

    @Override
    @Transactional
    public PublicContentBlockResponse updateBlock(UUID id, PublicContentBlockUpdateRequest request) {
        PublicContentBlockEntity entity = publicContentBlockRepository.findById(id)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Public content block not found"));

        if (request.documentId() != null && !documentRepository.existsById(request.documentId())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Linked document not found");
        }

        UUID previousDocumentId = entity.getDocumentId();
        String contentKey = entity.getContentKey();

        publicContentBlockMapper.applyUpdate(entity, request);
        PublicContentBlockResponse response = publicContentBlockMapper.toResponse(publicContentBlockRepository.save(entity));

        deletePreviousDocumentIfReplaced(contentKey, previousDocumentId, request.documentId());

        return response;
    }

    @Override
    @Transactional(readOnly = true)
    public DocumentDownload downloadPublishedBlockDocument(String key, String language) {
        PublicContentBlockEntity block = publicContentBlockRepository.findByContentKeyAndLanguageAndPublishedTrue(key, language)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Public content block not found"));

        if (block.getDocumentId() == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Public content block has no linked document");
        }

        DocumentEntity document = documentRepository.findById(block.getDocumentId())
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Linked document not found"));

        return documentFileService.download(document, "Linked document file not found");
    }

    private void deletePreviousDocumentIfReplaced(String contentKey, UUID previousDocumentId, UUID nextDocumentId) {
        if (!shouldDeletePreviousDocument(contentKey, previousDocumentId, nextDocumentId)) {
            return;
        }

        if (!documentRepository.existsById(previousDocumentId)) {
            return;
        }

        documentService.deleteDocument(previousDocumentId);
    }

    private boolean shouldDeletePreviousDocument(String contentKey, UUID previousDocumentId, UUID nextDocumentId) {
        return previousDocumentId != null
            && nextDocumentId != null
            && !previousDocumentId.equals(nextDocumentId)
            && ("contact.cv".equals(contentKey) || "site.profile-photo".equals(contentKey));
    }
}
