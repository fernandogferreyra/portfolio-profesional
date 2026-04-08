package com.fernandogferreyra.portfolio.backend.service;

import com.fernandogferreyra.portfolio.backend.dto.projects.ProjectSummaryResponse;
import java.util.List;

public interface ProjectService {

    List<ProjectSummaryResponse> getPublicProjects();
}

