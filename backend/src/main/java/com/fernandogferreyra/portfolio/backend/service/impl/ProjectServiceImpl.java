package com.fernandogferreyra.portfolio.backend.service.impl;

import com.fernandogferreyra.portfolio.backend.domain.documents.entity.DocumentEntity;
import com.fernandogferreyra.portfolio.backend.domain.documents.model.DocumentDownload;
import com.fernandogferreyra.portfolio.backend.domain.enums.ProjectCategory;
import com.fernandogferreyra.portfolio.backend.dto.projects.ProjectAssetResponse;
import com.fernandogferreyra.portfolio.backend.dto.projects.ProjectAdminResponse;
import com.fernandogferreyra.portfolio.backend.dto.projects.ProjectAdminUpdateRequest;
import com.fernandogferreyra.portfolio.backend.dto.projects.ProjectSummaryResponse;
import com.fernandogferreyra.portfolio.backend.domain.projects.entity.ProjectEntity;
import com.fernandogferreyra.portfolio.backend.mapper.projects.ProjectMapper;
import com.fernandogferreyra.portfolio.backend.repository.documents.DocumentRepository;
import com.fernandogferreyra.portfolio.backend.repository.projects.ProjectRepository;
import com.fernandogferreyra.portfolio.backend.service.DocumentFileService;
import com.fernandogferreyra.portfolio.backend.service.ProjectService;
import java.util.List;
import java.util.Set;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
@RequiredArgsConstructor
public class ProjectServiceImpl implements ProjectService {

    private final ProjectMapper projectMapper;
    private final DocumentRepository documentRepository;
    private final ProjectRepository projectRepository;
    private final DocumentFileService documentFileService;

    @Override
    @Transactional(readOnly = true)
    public List<ProjectSummaryResponse> getPublicProjects() {
        return projectRepository.findByPublishedTrueOrderByDisplayOrderAsc()
            .stream()
            .map(project -> projectMapper.toResponse(
                project,
                resolveAssets(project, project.getDocumentationDocumentIdsJson()),
                resolveAssets(project, project.getScreenshotDocumentIdsJson())))
            .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<ProjectAdminResponse> getAdminProjects() {
        return projectRepository.findAllByOrderByDisplayOrderAsc()
            .stream()
            .map(project -> projectMapper.toAdminResponse(
                project,
                resolveAssets(project, project.getDocumentationDocumentIdsJson()),
                resolveAssets(project, project.getScreenshotDocumentIdsJson())))
            .toList();
    }

    @Override
    @Transactional
    public ProjectAdminResponse createProject() {
        ProjectEntity entity = new ProjectEntity();
        entity.setSlug(resolveNewProjectSlug());
        entity.setName("Nuevo proyecto");
        entity.setProjectYear(String.valueOf(java.time.Year.now().getValue()));
        entity.setCategory(ProjectCategory.ASSET);
        entity.setSummary("Resumen del proyecto.");
        entity.setStackJson("[\"Pendiente\"]");
        entity.setMetricsJson("[]");
        entity.setSectionsJson("[]");
        entity.setFeaturesJson("[]");
        entity.setDocumentationDocumentIdsJson("[]");
        entity.setScreenshotDocumentIdsJson("[]");
        entity.setPublished(false);
        entity.setFeatured(false);
        entity.setDisplayOrder(resolveNextDisplayOrder());

        ProjectEntity saved = projectRepository.save(entity);
        return projectMapper.toAdminResponse(saved, List.of(), List.of());
    }

    @Override
    @Transactional
    public ProjectAdminResponse updateProject(UUID id, ProjectAdminUpdateRequest request) {
        ProjectEntity entity = projectRepository.findById(id)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Project not found"));

        if (request.iconDocumentId() != null && !documentRepository.existsById(request.iconDocumentId())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Linked project icon not found");
        }
        validateLinkedDocuments(request.documentationDocumentIds(), "Linked project documentation not found");
        validateLinkedDocuments(request.screenshotDocumentIds(), "Linked project screenshot not found");

        projectMapper.applyUpdate(entity, request);
        ProjectEntity saved = projectRepository.save(entity);
        return projectMapper.toAdminResponse(
            saved,
            resolveAssets(saved, saved.getDocumentationDocumentIdsJson()),
            resolveAssets(saved, saved.getScreenshotDocumentIdsJson()));
    }

    @Override
    @Transactional
    public void deleteProject(UUID id) {
        ProjectEntity entity = projectRepository.findById(id)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Project not found"));

        projectRepository.delete(entity);
    }

    @Override
    @Transactional(readOnly = true)
    public DocumentDownload downloadPublishedProjectIcon(String slug) {
        ProjectEntity project = projectRepository.findBySlugAndPublishedTrue(slug)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Project not found"));

        if (project.getIconDocumentId() == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Project has no linked icon");
        }

        DocumentEntity document = documentRepository.findById(project.getIconDocumentId())
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Linked project icon not found"));

        return documentFileService.download(document, "Linked project icon file not found");
    }

    @Override
    @Transactional(readOnly = true)
    public DocumentDownload downloadPublishedProjectDocument(String slug, UUID documentId) {
        ProjectEntity project = projectRepository.findBySlugAndPublishedTrue(slug)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Project not found"));

        Set<UUID> linkedDocumentIds = new java.util.HashSet<>();
        linkedDocumentIds.addAll(projectMapper.readDocumentIds(project.getDocumentationDocumentIdsJson()));
        linkedDocumentIds.addAll(projectMapper.readDocumentIds(project.getScreenshotDocumentIdsJson()));
        if (!linkedDocumentIds.contains(documentId)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Project document not found");
        }

        DocumentEntity document = documentRepository.findById(documentId)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Linked project document not found"));

        return documentFileService.download(document, "Linked project document file not found");
    }

    private void validateLinkedDocuments(List<UUID> documentIds, String message) {
        if (documentIds == null || documentIds.isEmpty()) {
            return;
        }

        long existingDocuments = documentRepository.findAllById(documentIds).size();
        if (existingDocuments != documentIds.stream().distinct().count()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, message);
        }
    }

    private String resolveNewProjectSlug() {
        String baseSlug = "nuevo-proyecto";
        String slug = baseSlug;
        int suffix = 2;
        while (projectRepository.existsBySlug(slug)) {
            slug = baseSlug + "-" + suffix;
            suffix++;
        }
        return slug;
    }

    private int resolveNextDisplayOrder() {
        return projectRepository.findAllByOrderByDisplayOrderAsc()
            .stream()
            .mapToInt(ProjectEntity::getDisplayOrder)
            .max()
            .orElse(0) + 10;
    }

    private List<ProjectAssetResponse> resolveAssets(ProjectEntity project, String documentIdsJson) {
        List<UUID> documentIds = projectMapper.readDocumentIds(documentIdsJson);
        if (documentIds.isEmpty()) {
            return List.of();
        }

        return documentRepository.findAllById(documentIds)
            .stream()
            .map(document -> new ProjectAssetResponse(
                document.getId(),
                document.getOriginalFilename(),
                document.getContentType(),
                "/api/projects/" + project.getSlug() + "/documents/" + document.getId()))
            .toList();
    }
}
