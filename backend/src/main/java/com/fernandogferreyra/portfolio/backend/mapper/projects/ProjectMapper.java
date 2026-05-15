package com.fernandogferreyra.portfolio.backend.mapper.projects;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fernandogferreyra.portfolio.backend.domain.enums.ProjectCategory;
import com.fernandogferreyra.portfolio.backend.dto.projects.ProjectAssetResponse;
import com.fernandogferreyra.portfolio.backend.dto.projects.ProjectAdminResponse;
import com.fernandogferreyra.portfolio.backend.dto.projects.ProjectAdminUpdateRequest;
import com.fernandogferreyra.portfolio.backend.dto.projects.ProjectMetricResponse;
import com.fernandogferreyra.portfolio.backend.dto.projects.ProjectSummaryResponse;
import com.fernandogferreyra.portfolio.backend.dto.projects.ProjectSectionResponse;
import com.fernandogferreyra.portfolio.backend.domain.projects.entity.ProjectEntity;
import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;

@Component
@RequiredArgsConstructor
public class ProjectMapper {

    private static final TypeReference<List<String>> STRING_LIST = new TypeReference<>() {
    };
    private static final TypeReference<List<UUID>> UUID_LIST = new TypeReference<>() {
    };
    private static final TypeReference<List<ProjectMetricResponse>> METRIC_LIST = new TypeReference<>() {
    };
    private static final TypeReference<List<ProjectSectionResponse>> SECTION_LIST = new TypeReference<>() {
    };

    private final ObjectMapper objectMapper;

    public ProjectSummaryResponse toResponse(
        ProjectEntity entity,
        List<ProjectAssetResponse> documentation,
        List<ProjectAssetResponse> screenshots
    ) {
        return new ProjectSummaryResponse(
            entity.getSlug(),
            entity.getName(),
            entity.getProjectYear(),
            entity.getCategory().value(),
            entity.getSummary(),
            readStack(entity.getStackJson()),
            entity.isFeatured(),
            entity.getRepositoryUrl(),
            entity.getDemoUrl(),
            entity.getMonographUrl(),
            resolveIconUrl(entity),
            readMetrics(entity.getMetricsJson()),
            readSections(entity.getSectionsJson()),
            readStringList(entity.getFeaturesJson()),
            documentation,
            screenshots);
    }

    public ProjectAdminResponse toAdminResponse(
        ProjectEntity entity,
        List<ProjectAssetResponse> documentation,
        List<ProjectAssetResponse> screenshots
    ) {
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
            entity.getDemoUrl(),
            entity.getMonographUrl(),
            entity.getIconDocumentId(),
            resolveIconUrl(entity),
            readMetrics(entity.getMetricsJson()),
            readSections(entity.getSectionsJson()),
            readStringList(entity.getFeaturesJson()),
            documentation,
            screenshots,
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
        entity.setDemoUrl(request.demoUrl() == null || request.demoUrl().isBlank() ? null : request.demoUrl().trim());
        entity.setMonographUrl(request.monographUrl() == null || request.monographUrl().isBlank() ? null : request.monographUrl().trim());
        entity.setIconDocumentId(request.iconDocumentId());
        entity.setStackJson(writeStack(request.stack()));
        entity.setMetricsJson(writeJson(request.metrics().stream()
            .map(metric -> new ProjectMetricResponse(metric.value().trim(), metric.label().trim()))
            .toList()));
        entity.setSectionsJson(writeJson(request.sections().stream()
            .map(section -> new ProjectSectionResponse(
                section.title().trim(),
                section.items().stream().map(String::trim).filter(item -> !item.isBlank()).toList()))
            .toList()));
        entity.setFeaturesJson(writeStack(request.features()));
        entity.setDocumentationDocumentIdsJson(writeJson(request.documentationDocumentIds()));
        entity.setScreenshotDocumentIdsJson(writeJson(request.screenshotDocumentIds()));
        entity.setFeatured(request.featured());
        entity.setPublished(request.published());
        entity.setDisplayOrder(request.displayOrder());
    }

    private List<String> readStack(String stackJson) {
        return readStringList(stackJson);
    }

    public List<UUID> readDocumentIds(String documentIdsJson) {
        if (documentIdsJson == null || documentIdsJson.isBlank()) {
            return List.of();
        }

        try {
            return objectMapper.readValue(documentIdsJson, UUID_LIST);
        } catch (Exception exception) {
            throw new IllegalArgumentException("Unable to parse project document ids", exception);
        }
    }

    private List<String> readStringList(String stackJson) {
        if (stackJson == null || stackJson.isBlank()) {
            return List.of();
        }

        try {
            return objectMapper.readValue(stackJson, STRING_LIST);
        } catch (Exception exception) {
            throw new IllegalArgumentException("Unable to parse project stack configuration", exception);
        }
    }

    private List<ProjectMetricResponse> readMetrics(String metricsJson) {
        if (metricsJson == null || metricsJson.isBlank()) {
            return List.of();
        }

        try {
            return objectMapper.readValue(metricsJson, METRIC_LIST);
        } catch (Exception exception) {
            throw new IllegalArgumentException("Unable to parse project metrics", exception);
        }
    }

    private List<ProjectSectionResponse> readSections(String sectionsJson) {
        if (sectionsJson == null || sectionsJson.isBlank()) {
            return List.of();
        }

        try {
            return objectMapper.readValue(sectionsJson, SECTION_LIST);
        } catch (Exception exception) {
            throw new IllegalArgumentException("Unable to parse project sections", exception);
        }
    }

    private String writeStack(List<String> stack) {
        return writeJson(
            stack.stream()
                .map(String::trim)
                .filter(item -> !item.isBlank())
                .toList());
    }

    private String writeJson(Object value) {
        try {
            return objectMapper.writeValueAsString(value);
        } catch (Exception exception) {
            throw new IllegalArgumentException("Unable to serialize project configuration", exception);
        }
    }

    private ProjectCategory resolveCategory(String category) {
        return java.util.Arrays.stream(ProjectCategory.values())
            .filter(value -> value.value().equalsIgnoreCase(category.trim()))
            .findFirst()
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid project category"));
    }

    private String resolveIconUrl(ProjectEntity entity) {
        return entity.getIconDocumentId() == null ? null : "/api/projects/" + entity.getSlug() + "/icon";
    }
}
