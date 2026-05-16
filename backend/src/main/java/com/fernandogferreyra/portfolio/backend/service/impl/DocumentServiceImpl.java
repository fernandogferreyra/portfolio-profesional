package com.fernandogferreyra.portfolio.backend.service.impl;

import com.fernandogferreyra.portfolio.backend.config.DocumentStorageProperties;
import com.fernandogferreyra.portfolio.backend.domain.credentials.entity.CredentialEntity;
import com.fernandogferreyra.portfolio.backend.domain.documents.entity.DocumentEntity;
import com.fernandogferreyra.portfolio.backend.domain.documents.model.StoredDocumentFile;
import com.fernandogferreyra.portfolio.backend.domain.publiccontent.entity.PublicContentBlockEntity;
import com.fernandogferreyra.portfolio.backend.dto.documents.DocumentAdminResponse;
import com.fernandogferreyra.portfolio.backend.mapper.documents.DocumentMapper;
import com.fernandogferreyra.portfolio.backend.repository.credentials.CredentialRepository;
import com.fernandogferreyra.portfolio.backend.repository.documents.DocumentRepository;
import com.fernandogferreyra.portfolio.backend.repository.projects.ProjectRepository;
import com.fernandogferreyra.portfolio.backend.repository.publiccontent.PublicContentBlockRepository;
import com.fernandogferreyra.portfolio.backend.repository.skills.SkillRepository;
import com.fernandogferreyra.portfolio.backend.service.DocumentService;
import com.fernandogferreyra.portfolio.backend.service.StorageService;
import java.io.IOException;
import java.nio.file.Path;
import java.util.List;
import java.util.Locale;
import java.util.Set;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

@Service
@RequiredArgsConstructor
public class DocumentServiceImpl implements DocumentService {

    private final DocumentMapper documentMapper;
    private final CredentialRepository credentialRepository;
    private final DocumentRepository documentRepository;
    private final ProjectRepository projectRepository;
    private final PublicContentBlockRepository publicContentBlockRepository;
    private final SkillRepository skillRepository;
    private final DocumentStorageProperties documentStorageProperties;
    private final StorageService storageService;

    @Override
    @Transactional(readOnly = true)
    public List<DocumentAdminResponse> getAdminDocuments() {
        return documentRepository.findAllByOrderByCreatedAtDesc()
            .stream()
            .map(documentMapper::toAdminResponse)
            .toList();
    }

    @Override
    @Transactional
    public DocumentAdminResponse uploadDocument(MultipartFile file, String purpose) {
        if (file == null || file.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Document file is required");
        }

        if (file.getOriginalFilename() == null || file.getOriginalFilename().isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Document filename is required");
        }

        String normalizedPurpose = normalizePurpose(purpose);
        validate(file);

        String originalFilename = Path.of(file.getOriginalFilename()).getFileName().toString().trim();
        String storedFilename = buildStoredFilename(originalFilename);
        StoredDocumentFile storedDocument;

        try {
            storedDocument = storageService.store(storedFilename, file.getInputStream());
        } catch (IOException exception) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Document could not be stored");
        }

        DocumentEntity entity = new DocumentEntity();
        entity.setPurpose(normalizedPurpose);
        entity.setOriginalFilename(originalFilename);
        entity.setStoredFilename(storedDocument.storedFilename());
        entity.setContentType(normalizeContentType(file.getContentType()));
        entity.setSizeBytes(file.getSize());
        entity.setStoragePath(storedDocument.storagePath());

        return documentMapper.toAdminResponse(documentRepository.save(entity));
    }

    @Override
    @Transactional
    public void deleteDocument(UUID id) {
        DocumentEntity document = documentRepository.findById(id)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Document not found"));

        List<PublicContentBlockEntity> linkedBlocks = publicContentBlockRepository.findAllByDocumentId(id);
        linkedBlocks.forEach(block -> block.setDocumentId(null));
        publicContentBlockRepository.saveAll(linkedBlocks);

        List<CredentialEntity> linkedCredentials = credentialRepository.findAllByDocumentId(id);
        linkedCredentials.forEach(credential -> credential.setDocumentId(null));
        credentialRepository.saveAll(linkedCredentials);

        List<com.fernandogferreyra.portfolio.backend.domain.projects.entity.ProjectEntity> linkedProjects = projectRepository.findAllByIconDocumentId(id);
        linkedProjects.forEach(project -> project.setIconDocumentId(null));
        projectRepository.saveAll(linkedProjects);

        List<com.fernandogferreyra.portfolio.backend.domain.skills.entity.SkillEntity> linkedSkills = skillRepository.findAllByIconDocumentId(id);
        linkedSkills.forEach(skill -> skill.setIconDocumentId(null));
        skillRepository.saveAll(linkedSkills);

        try {
            storageService.delete(document.getStoragePath());
        } catch (IOException exception) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Document could not be deleted");
        }

        documentRepository.delete(document);
    }

    private void validate(MultipartFile file) {
        long maxFileSizeBytes = documentStorageProperties.getMaxFileSizeBytes();
        if (maxFileSizeBytes > 0 && file.getSize() > maxFileSizeBytes) {
            throw new ResponseStatusException(HttpStatus.PAYLOAD_TOO_LARGE, "Document exceeds the allowed size");
        }

        String contentType = normalizeContentType(file.getContentType()).toLowerCase(Locale.ROOT);
        Set<String> allowedContentTypes = documentStorageProperties.getAllowedContentTypes()
            .stream()
            .map(value -> value.trim().toLowerCase(Locale.ROOT))
            .filter(value -> !value.isBlank())
            .collect(java.util.stream.Collectors.toSet());

        if (!allowedContentTypes.isEmpty() && !allowedContentTypes.contains(contentType)) {
            throw new ResponseStatusException(HttpStatus.UNSUPPORTED_MEDIA_TYPE, "Document type is not allowed");
        }
    }

    private String normalizePurpose(String purpose) {
        if (purpose == null || purpose.isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Document purpose is required");
        }

        String normalized = purpose.trim().toLowerCase(Locale.ROOT);
        if (normalized.length() > 80) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Document purpose is too long");
        }

        if (!normalized.matches("[a-z0-9_-]+")) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Document purpose format is invalid");
        }

        return normalized;
    }

    private String buildStoredFilename(String originalFilename) {
        String extension = "";
        int separatorIndex = originalFilename.lastIndexOf('.');
        if (separatorIndex >= 0 && separatorIndex < originalFilename.length() - 1) {
            extension = "." + sanitizeSegment(originalFilename.substring(separatorIndex + 1).toLowerCase(Locale.ROOT));
        }

        return UUID.randomUUID() + extension;
    }

    private String sanitizeSegment(String value) {
        String sanitized = value.replaceAll("[^a-z0-9_-]", "");
        return sanitized.isBlank() ? "bin" : sanitized;
    }

    private String normalizeContentType(String contentType) {
        if (contentType == null || contentType.isBlank()) {
            return "application/octet-stream";
        }

        return contentType.trim();
    }
}
