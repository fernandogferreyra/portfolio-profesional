package com.fernandogferreyra.portfolio.backend.mapper.projects;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fernandogferreyra.portfolio.backend.dto.projects.ProjectSummaryResponse;
import com.fernandogferreyra.portfolio.backend.domain.projects.entity.ProjectEntity;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class ProjectMapper {

    private static final TypeReference<List<String>> STRING_LIST = new TypeReference<>() {
    };

    private final ObjectMapper objectMapper;

    public ProjectSummaryResponse toResponse(ProjectEntity entity) {
        return new ProjectSummaryResponse(
            entity.getSlug(),
            entity.getName(),
            entity.getProjectYear(),
            entity.getCategory().value(),
            entity.getSummary(),
            readStack(entity.getStackJson()),
            entity.isFeatured(),
            entity.getRepositoryUrl());
    }

    private List<String> readStack(String stackJson) {
        if (stackJson == null || stackJson.isBlank()) {
            return List.of();
        }

        try {
            return objectMapper.readValue(stackJson, STRING_LIST);
        } catch (Exception exception) {
            throw new IllegalArgumentException("Unable to parse project stack configuration", exception);
        }
    }
}
