package com.fernandogferreyra.portfolio.backend.mapper.analytics;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fernandogferreyra.portfolio.backend.dto.analytics.AnalyticsEventAdminResponse;
import com.fernandogferreyra.portfolio.backend.dto.analytics.AnalyticsEventRequest;
import com.fernandogferreyra.portfolio.backend.dto.analytics.AnalyticsEventResponse;
import com.fernandogferreyra.portfolio.backend.domain.analytics.entity.EventLog;
import java.time.Clock;
import java.time.OffsetDateTime;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class AnalyticsEventMapper {

    private static final TypeReference<Map<String, String>> STRING_MAP = new TypeReference<>() {
    };

    private final ObjectMapper objectMapper;

    public EventLog toEntity(AnalyticsEventRequest request) {
        EventLog entity = new EventLog();
        entity.setEventType(request.eventType());
        entity.setSource(trim(request.source()));
        entity.setMetadataJson(writeMetadata(request));
        return entity;
    }

    public AnalyticsEventResponse toResponse(EventLog entity, Clock clock) {
        return new AnalyticsEventResponse(
            entity.getId() != null ? entity.getId() : UUID.randomUUID(),
            entity.getEventType(),
            "logged",
            entity.getCreatedAt() != null ? entity.getCreatedAt() : OffsetDateTime.now(clock));
    }

    public AnalyticsEventAdminResponse toAdminResponse(EventLog entity, Clock clock) {
        Map<String, String> metadata = readMetadata(entity.getMetadataJson());

        return new AnalyticsEventAdminResponse(
            entity.getId() != null ? entity.getId() : UUID.randomUUID(),
            entity.getEventType().value(),
            metadata.getOrDefault("action", metadata.getOrDefault("reference", entity.getEventType().value())),
            metadata.getOrDefault("label", metadata.getOrDefault("reference", entity.getEventType().value())),
            metadata.getOrDefault("route", metadata.get("path")),
            entity.getCreatedAt() != null ? entity.getCreatedAt() : OffsetDateTime.now(clock));
    }

    private String writeMetadata(AnalyticsEventRequest request) {
        Map<String, String> metadata = new LinkedHashMap<>();
        if (request.metadata() != null && !request.metadata().isEmpty()) {
            metadata.putAll(request.metadata());
        }

        if (request.path() != null && !request.path().isBlank()) {
            metadata.put("path", request.path().trim());
        }

        if (request.reference() != null && !request.reference().isBlank()) {
            metadata.put("reference", request.reference().trim());
        }

        if (metadata.isEmpty()) {
            return null;
        }

        try {
            return objectMapper.writeValueAsString(metadata);
        } catch (JsonProcessingException exception) {
            throw new IllegalArgumentException("Unable to serialize analytics metadata", exception);
        }
    }

    private String trim(String value) {
        return value == null ? null : value.trim();
    }

    private Map<String, String> readMetadata(String metadataJson) {
        if (metadataJson == null || metadataJson.isBlank()) {
            return Map.of();
        }

        try {
            return objectMapper.readValue(metadataJson, STRING_MAP);
        } catch (JsonProcessingException exception) {
            throw new IllegalArgumentException("Unable to deserialize analytics metadata", exception);
        }
    }
}
