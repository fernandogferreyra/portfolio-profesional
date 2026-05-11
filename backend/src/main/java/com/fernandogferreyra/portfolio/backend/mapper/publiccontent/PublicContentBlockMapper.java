package com.fernandogferreyra.portfolio.backend.mapper.publiccontent;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fernandogferreyra.portfolio.backend.domain.publiccontent.entity.PublicContentBlockEntity;
import com.fernandogferreyra.portfolio.backend.dto.publiccontent.PublicContentBlockResponse;
import com.fernandogferreyra.portfolio.backend.dto.publiccontent.PublicContentBlockUpdateRequest;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class PublicContentBlockMapper {

    private static final TypeReference<List<String>> STRING_LIST = new TypeReference<>() {
    };

    private final ObjectMapper objectMapper;

    public PublicContentBlockResponse toResponse(PublicContentBlockEntity entity) {
        return new PublicContentBlockResponse(
            entity.getId(),
            entity.getContentKey(),
            entity.getLanguage(),
            entity.getTitle(),
            entity.getBody(),
            readItems(entity.getItemsJson()),
            entity.getDocumentId(),
            buildDocumentUrl(entity),
            entity.isPublished(),
            entity.getDisplayOrder(),
            entity.getCreatedAt(),
            entity.getUpdatedAt());
    }

    public void applyUpdate(PublicContentBlockEntity entity, PublicContentBlockUpdateRequest request) {
        entity.setTitle(request.title().trim());
        entity.setBody(request.body().trim());
        entity.setItemsJson(writeItems(request.items()));
        entity.setDocumentId(request.documentId());
        entity.setPublished(request.published());
        entity.setDisplayOrder(request.displayOrder());
    }

    private String buildDocumentUrl(PublicContentBlockEntity entity) {
        if (entity.getDocumentId() == null) {
            return null;
        }

        return "/api/content-blocks/" + entity.getContentKey() + "/" + entity.getLanguage() + "/document";
    }

    private List<String> readItems(String itemsJson) {
        if (itemsJson == null || itemsJson.isBlank()) {
            return List.of();
        }

        try {
            return objectMapper.readValue(itemsJson, STRING_LIST);
        } catch (Exception exception) {
            throw new IllegalArgumentException("Unable to parse public content items", exception);
        }
    }

    private String writeItems(List<String> items) {
        try {
            return objectMapper.writeValueAsString(
                items.stream()
                    .map(String::trim)
                    .filter(item -> !item.isBlank())
                    .toList());
        } catch (Exception exception) {
            throw new IllegalArgumentException("Unable to serialize public content items", exception);
        }
    }
}
