package com.fernandogferreyra.portfolio.backend.controller.admin;

import com.fernandogferreyra.portfolio.backend.dto.ApiResponse;
import com.fernandogferreyra.portfolio.backend.dto.skills.SkillCategoryCreateRequest;
import com.fernandogferreyra.portfolio.backend.dto.skills.SkillCategoryResponse;
import com.fernandogferreyra.portfolio.backend.dto.skills.SkillCategoryUpdateRequest;
import com.fernandogferreyra.portfolio.backend.service.SkillCatalogService;
import com.fernandogferreyra.portfolio.backend.util.ApiPaths;
import jakarta.validation.Valid;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(ApiPaths.API_BASE + "/admin/skill-categories")
@RequiredArgsConstructor
public class SkillCategoryAdminController {

    private final SkillCatalogService skillCatalogService;

    @PostMapping
    public ApiResponse<SkillCategoryResponse> createCategory(@Valid @RequestBody SkillCategoryCreateRequest request) {
        return ApiResponse.success("Skill category created", skillCatalogService.createCategory(request));
    }

    @PatchMapping("/{id}")
    public ApiResponse<SkillCategoryResponse> updateCategory(
        @PathVariable UUID id,
        @Valid @RequestBody SkillCategoryUpdateRequest request
    ) {
        return ApiResponse.success("Skill category updated", skillCatalogService.updateCategory(id, request));
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Void> deleteCategory(@PathVariable UUID id) {
        skillCatalogService.deleteCategory(id);
        return ApiResponse.success("Skill category deleted", null);
    }
}
