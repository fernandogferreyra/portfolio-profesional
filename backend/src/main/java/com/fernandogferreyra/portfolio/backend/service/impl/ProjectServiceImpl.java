package com.fernandogferreyra.portfolio.backend.service.impl;

import com.fernandogferreyra.portfolio.backend.dto.projects.ProjectAdminResponse;
import com.fernandogferreyra.portfolio.backend.dto.projects.ProjectAdminUpdateRequest;
import com.fernandogferreyra.portfolio.backend.dto.projects.ProjectSummaryResponse;
import com.fernandogferreyra.portfolio.backend.domain.projects.entity.ProjectEntity;
import com.fernandogferreyra.portfolio.backend.mapper.projects.ProjectMapper;
import com.fernandogferreyra.portfolio.backend.repository.projects.ProjectRepository;
import com.fernandogferreyra.portfolio.backend.service.ProjectService;
import java.util.List;
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
    private final ProjectRepository projectRepository;

    @Override
    @Transactional(readOnly = true)
    public List<ProjectSummaryResponse> getPublicProjects() {
        return projectRepository.findByPublishedTrueOrderByDisplayOrderAsc()
            .stream()
            .map(projectMapper::toResponse)
            .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<ProjectAdminResponse> getAdminProjects() {
        return projectRepository.findAllByOrderByDisplayOrderAsc()
            .stream()
            .map(projectMapper::toAdminResponse)
            .toList();
    }

    @Override
    @Transactional
    public ProjectAdminResponse updateProject(UUID id, ProjectAdminUpdateRequest request) {
        ProjectEntity entity = projectRepository.findById(id)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Project not found"));

        projectMapper.applyUpdate(entity, request);
        return projectMapper.toAdminResponse(projectRepository.save(entity));
    }
}
