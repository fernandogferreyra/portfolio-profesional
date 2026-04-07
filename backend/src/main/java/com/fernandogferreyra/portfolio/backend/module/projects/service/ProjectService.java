package com.fernandogferreyra.portfolio.backend.module.projects.service;

import com.fernandogferreyra.portfolio.backend.module.projects.domain.dto.ProjectSummaryResponse;
import java.util.List;

public interface ProjectService {

    List<ProjectSummaryResponse> getPublicProjects();
}

