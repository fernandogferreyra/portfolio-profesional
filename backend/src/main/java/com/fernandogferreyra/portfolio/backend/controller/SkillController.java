package com.fernandogferreyra.portfolio.backend.controller;

import com.fernandogferreyra.portfolio.backend.dto.ApiResponse;
import com.fernandogferreyra.portfolio.backend.dto.skills.SkillCategoryResponse;
import com.fernandogferreyra.portfolio.backend.service.SkillCatalogService;
import com.fernandogferreyra.portfolio.backend.util.ApiPaths;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(ApiPaths.API_BASE + "/skills")
@RequiredArgsConstructor
public class SkillController {

    private final SkillCatalogService skillCatalogService;

    @GetMapping
    public ApiResponse<List<SkillCategoryResponse>> listSkills(@RequestParam(defaultValue = "es") String language) {
        return ApiResponse.success("Skills retrieved", skillCatalogService.getPublicCatalog(language));
    }
}
