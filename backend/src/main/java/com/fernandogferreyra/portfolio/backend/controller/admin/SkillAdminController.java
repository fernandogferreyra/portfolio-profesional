package com.fernandogferreyra.portfolio.backend.controller.admin;

import com.fernandogferreyra.portfolio.backend.dto.ApiResponse;
import com.fernandogferreyra.portfolio.backend.dto.skills.SkillCategoryResponse;
import com.fernandogferreyra.portfolio.backend.dto.skills.SkillCreateRequest;
import com.fernandogferreyra.portfolio.backend.dto.skills.SkillResponse;
import com.fernandogferreyra.portfolio.backend.dto.skills.SkillUpdateRequest;
import com.fernandogferreyra.portfolio.backend.service.SkillCatalogService;
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
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(ApiPaths.API_BASE + "/admin/skills")
@RequiredArgsConstructor
public class SkillAdminController {

    private final SkillCatalogService skillCatalogService;

    @GetMapping
    public ApiResponse<List<SkillCategoryResponse>> listSkills(@RequestParam(defaultValue = "es") String language) {
        return ApiResponse.success("Admin skills retrieved", skillCatalogService.getAdminCatalog(language));
    }

    @PostMapping
    public ApiResponse<SkillResponse> createSkill(@Valid @RequestBody SkillCreateRequest request) {
        return ApiResponse.success("Skill created", skillCatalogService.createSkill(request));
    }

    @PatchMapping("/{id}")
    public ApiResponse<SkillResponse> updateSkill(@PathVariable UUID id, @Valid @RequestBody SkillUpdateRequest request) {
        return ApiResponse.success("Skill updated", skillCatalogService.updateSkill(id, request));
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Void> deleteSkill(@PathVariable UUID id) {
        skillCatalogService.deleteSkill(id);
        return ApiResponse.success("Skill deleted", null);
    }
}
