package com.fernandogferreyra.portfolio.backend.service;

import com.fernandogferreyra.portfolio.backend.domain.documents.model.DocumentDownload;
import com.fernandogferreyra.portfolio.backend.dto.projects.ProjectAdminResponse;
import com.fernandogferreyra.portfolio.backend.dto.projects.ProjectAdminUpdateRequest;
import com.fernandogferreyra.portfolio.backend.dto.projects.ProjectSummaryResponse;
import java.util.List;
import java.util.UUID;

public interface ProjectService {

    List<ProjectSummaryResponse> getPublicProjects();

    List<ProjectAdminResponse> getAdminProjects();

    ProjectAdminResponse createProject();

    ProjectAdminResponse updateProject(UUID id, ProjectAdminUpdateRequest request);

    void deleteProject(UUID id);

    DocumentDownload downloadPublishedProjectIcon(String slug);

    DocumentDownload downloadPublishedProjectDocument(String slug, UUID documentId);
}
