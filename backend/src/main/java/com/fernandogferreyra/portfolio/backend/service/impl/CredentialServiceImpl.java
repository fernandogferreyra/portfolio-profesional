package com.fernandogferreyra.portfolio.backend.service.impl;

import com.fernandogferreyra.portfolio.backend.domain.credentials.entity.CredentialEntity;
import com.fernandogferreyra.portfolio.backend.domain.documents.entity.DocumentEntity;
import com.fernandogferreyra.portfolio.backend.domain.documents.model.DocumentDownload;
import com.fernandogferreyra.portfolio.backend.dto.credentials.CredentialCreateRequest;
import com.fernandogferreyra.portfolio.backend.dto.credentials.CredentialResponse;
import com.fernandogferreyra.portfolio.backend.dto.credentials.CredentialUpdateRequest;
import com.fernandogferreyra.portfolio.backend.mapper.credentials.CredentialMapper;
import com.fernandogferreyra.portfolio.backend.repository.credentials.CredentialRepository;
import com.fernandogferreyra.portfolio.backend.repository.documents.DocumentRepository;
import com.fernandogferreyra.portfolio.backend.service.CredentialService;
import com.fernandogferreyra.portfolio.backend.service.StorageService;
import java.io.IOException;
import java.util.List;
import java.util.Locale;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
@RequiredArgsConstructor
public class CredentialServiceImpl implements CredentialService {

    private final CredentialMapper credentialMapper;
    private final CredentialRepository credentialRepository;
    private final DocumentRepository documentRepository;
    private final StorageService storageService;

    @Override
    @Transactional(readOnly = true)
    public List<CredentialResponse> getPublicCredentials() {
        return credentialRepository.findByPublishedTrueOrderByDisplayOrderAscTitleAscLanguageAsc()
            .stream()
            .map(credentialMapper::toResponse)
            .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<CredentialResponse> getAdminCredentials() {
        return credentialRepository.findAllByOrderByDisplayOrderAscTitleAscLanguageAsc()
            .stream()
            .map(credentialMapper::toResponse)
            .toList();
    }

    @Override
    @Transactional
    public CredentialResponse createCredential(CredentialCreateRequest request) {
        String language = normalizeLanguage(request.language());
        boolean spanish = "es".equals(language);

        CredentialEntity entity = new CredentialEntity();
        entity.setLanguage(language);
        entity.setType(spanish ? "Formacion" : "Education");
        entity.setTitle(spanish ? "Nueva formacion o certificacion" : "New education or certification");
        entity.setInstitution(spanish ? "Institucion" : "Institution");
        entity.setDescription(spanish ? "Descripcion de la formacion o certificacion." : "Education or certification description.");
        entity.setPublished(false);
        entity.setDisplayOrder(resolveNextDisplayOrder());

        return credentialMapper.toResponse(credentialRepository.save(entity));
    }

    @Override
    @Transactional
    public CredentialResponse updateCredential(UUID id, CredentialUpdateRequest request) {
        CredentialEntity entity = credentialRepository.findById(id)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Credential not found"));

        if (request.documentId() != null && !documentRepository.existsById(request.documentId())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Linked document not found");
        }

        credentialMapper.applyUpdate(entity, request);
        entity.setLanguage(normalizeLanguage(entity.getLanguage()));

        return credentialMapper.toResponse(credentialRepository.save(entity));
    }

    @Override
    @Transactional(readOnly = true)
    public DocumentDownload downloadPublishedCredentialDocument(UUID id) {
        CredentialEntity credential = credentialRepository.findById(id)
            .filter(CredentialEntity::isPublished)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Credential not found"));

        if (credential.getDocumentId() == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Credential has no linked document");
        }

        DocumentEntity document = documentRepository.findById(credential.getDocumentId())
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Linked document not found"));

        try {
            return new DocumentDownload(
                storageService.load(document.getStoragePath()),
                document.getOriginalFilename(),
                document.getContentType(),
                document.getSizeBytes());
        } catch (IOException exception) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Linked document file not found");
        }
    }

    private int resolveNextDisplayOrder() {
        return credentialRepository.findAllByOrderByDisplayOrderAscTitleAscLanguageAsc()
            .stream()
            .mapToInt(CredentialEntity::getDisplayOrder)
            .max()
            .orElse(0) + 10;
    }

    private String normalizeLanguage(String language) {
        if (language == null || language.isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Credential language is required");
        }

        String normalized = language.trim().toLowerCase(Locale.ROOT);
        if (!("es".equals(normalized) || "en".equals(normalized))) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Credential language is invalid");
        }

        return normalized;
    }
}
