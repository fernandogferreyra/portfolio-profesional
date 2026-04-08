package com.fernandogferreyra.portfolio.backend.service.impl;

import com.fernandogferreyra.portfolio.backend.dto.projects.ProjectSummaryResponse;
import com.fernandogferreyra.portfolio.backend.mapper.projects.ProjectMapper;
import com.fernandogferreyra.portfolio.backend.repository.projects.ProjectRepository;
import com.fernandogferreyra.portfolio.backend.service.ProjectService;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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
}
