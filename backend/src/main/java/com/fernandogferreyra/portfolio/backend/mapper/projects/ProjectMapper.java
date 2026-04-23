package com.fernandogferreyra.portfolio.backend.mapper.projects;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fernandogferreyra.portfolio.backend.domain.enums.ProjectCategory;
import com.fernandogferreyra.portfolio.backend.dto.projects.ProjectAdminResponse;
import com.fernandogferreyra.portfolio.backend.dto.projects.ProjectAdminUpdateRequest;
import com.fernandogferreyra.portfolio.backend.dto.projects.ProjectSummaryResponse;
import com.fernandogferreyra.portfolio.backend.domain.projects.entity.ProjectEntity;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;

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

    public ProjectAdminResponse toAdminResponse(ProjectEntity entity) {
        return new ProjectAdminResponse(
            entity.getId(),
            entity.getSlug(),
            entity.getName(),
            entity.getProjectYear(),
            entity.getCategory().value(),
            entity.getSummary(),
            readStack(entity.getStackJson()),
            entity.isFeatured(),
            entity.isPublished(),
            entity.getDisplayOrder(),
            entity.getRepositoryUrl(),
            entity.getCreatedAt(),
            entity.getUpdatedAt());
    }

    public void applyUpdate(ProjectEntity entity, ProjectAdminUpdateRequest request) {
        entity.setSlug(request.slug().trim());
        entity.setName(request.name().trim());
        entity.setProjectYear(request.year().trim());
        entity.setCategory(resolveCategory(request.category()));
        entity.setSummary(request.summary().trim());
        entity.setRepositoryUrl(request.repositoryUrl() == null || request.repositoryUrl().isBlank() ? null : request.repositoryUrl().trim());
        entity.setStackJson(writeStack(request.stack()));
        entity.setFeatured(request.featured());
        entity.setPublished(request.published());
        entity.setDisplayOrder(request.displayOrder());
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

    private String writeStack(List<String> stack) {
        try {
            return objectMapper.writeValueAsString(
                stack.stream()
                    .map(String::trim)
                    .filter(item -> !item.isBlank())
                    .toList());
        } catch (Exception exception) {
            throw new IllegalArgumentException("Unable to serialize project stack configuration", exception);
        }
    }

    private ProjectCategory resolveCategory(String category) {
        return java.util.Arrays.stream(ProjectCategory.values())
            .filter(value -> value.value().equalsIgnoreCase(category.trim()))
            .findFirst()
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid project category"));
    }
}
