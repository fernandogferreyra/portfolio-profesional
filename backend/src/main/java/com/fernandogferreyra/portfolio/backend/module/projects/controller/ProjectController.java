package com.fernandogferreyra.portfolio.backend.module.projects.controller;

import com.fernandogferreyra.portfolio.backend.domain.dto.ApiResponse;
import com.fernandogferreyra.portfolio.backend.module.projects.domain.dto.ProjectSummaryResponse;
import com.fernandogferreyra.portfolio.backend.module.projects.service.ProjectService;
import com.fernandogferreyra.portfolio.backend.util.ApiPaths;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(ApiPaths.API_BASE)
@RequiredArgsConstructor
public class ProjectController {

    private final ProjectService projectService;

    @GetMapping("/projects")
    public ApiResponse<List<ProjectSummaryResponse>> listProjects() {
        return ApiResponse.success("Projects retrieved", projectService.getPublicProjects());
    }
}

