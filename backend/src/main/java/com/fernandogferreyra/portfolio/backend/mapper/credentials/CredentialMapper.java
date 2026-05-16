package com.fernandogferreyra.portfolio.backend.mapper.credentials;

import com.fernandogferreyra.portfolio.backend.domain.credentials.entity.CredentialEntity;
import com.fernandogferreyra.portfolio.backend.dto.credentials.CredentialResponse;
import com.fernandogferreyra.portfolio.backend.dto.credentials.CredentialUpdateRequest;
import org.springframework.stereotype.Component;

@Component
public class CredentialMapper {

    public CredentialResponse toResponse(CredentialEntity entity) {
        return new CredentialResponse(
            entity.getId(),
            entity.getLanguage(),
            entity.getType(),
            entity.getTitle(),
            entity.getInstitution(),
            entity.getDescription(),
            entity.getDocumentId(),
            buildDocumentUrl(entity),
            entity.isPublished(),
            entity.getDisplayOrder(),
            entity.getCreatedAt(),
            entity.getUpdatedAt());
    }

    public void applyUpdate(CredentialEntity entity, CredentialUpdateRequest request) {
        entity.setLanguage(request.language().trim().toLowerCase());
        entity.setType(request.type().trim());
        entity.setTitle(request.title().trim());
        entity.setInstitution(request.institution().trim());
        entity.setDescription(request.description().trim());
        entity.setDocumentId(request.documentId());
        entity.setPublished(request.published());
        entity.setDisplayOrder(request.displayOrder());
    }

    private String buildDocumentUrl(CredentialEntity entity) {
        if (entity.getDocumentId() == null) {
            return null;
        }

        return "/api/credentials/" + entity.getId() + "/document";
    }
}
