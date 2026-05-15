package com.fernandogferreyra.portfolio.backend.controller.admin;

import com.fernandogferreyra.portfolio.backend.dto.ApiResponse;
import com.fernandogferreyra.portfolio.backend.dto.projects.ProjectAdminResponse;
import com.fernandogferreyra.portfolio.backend.dto.projects.ProjectAdminUpdateRequest;
import com.fernandogferreyra.portfolio.backend.service.ProjectService;
import com.fernandogferreyra.portfolio.backend.util.ApiPaths;
import jakarta.validation.Valid;
import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(ApiPaths.API_BASE + "/admin/projects")
@RequiredArgsConstructor
public class ProjectAdminController {

    private final ProjectService projectService;

    @GetMapping
    public ApiResponse<List<ProjectAdminResponse>> listProjects() {
        return ApiResponse.success("Admin projects retrieved", projectService.getAdminProjects());
    }

    @PostMapping
    public ApiResponse<ProjectAdminResponse> createProject() {
        return ApiResponse.success("Project created", projectService.createProject());
    }

    @PatchMapping("/{id}")
    public ApiResponse<ProjectAdminResponse> updateProject(
        @PathVariable UUID id,
        @Valid @RequestBody ProjectAdminUpdateRequest request
    ) {
        return ApiResponse.success("Project updated", projectService.updateProject(id, request));
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Void> deleteProject(@PathVariable UUID id) {
        projectService.deleteProject(id);
        return ApiResponse.success("Project deleted", null);
    }
}
