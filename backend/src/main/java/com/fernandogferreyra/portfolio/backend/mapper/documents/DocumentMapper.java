package com.fernandogferreyra.portfolio.backend.mapper.documents;

import com.fernandogferreyra.portfolio.backend.domain.documents.entity.DocumentEntity;
import com.fernandogferreyra.portfolio.backend.dto.documents.DocumentAdminResponse;
import org.springframework.stereotype.Component;

@Component
public class DocumentMapper {

    public DocumentAdminResponse toAdminResponse(DocumentEntity entity) {
        return new DocumentAdminResponse(
            entity.getId(),
            entity.getPurpose(),
            entity.getOriginalFilename(),
            entity.getStoredFilename(),
            entity.getContentType(),
            entity.getSizeBytes(),
            entity.getStoragePath(),
            entity.getCreatedAt(),
            entity.getUpdatedAt());
    }
}
