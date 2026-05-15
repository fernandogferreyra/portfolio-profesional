package com.fernandogferreyra.portfolio.backend.service;

import com.fernandogferreyra.portfolio.backend.dto.skills.SkillCategoryCreateRequest;
import com.fernandogferreyra.portfolio.backend.dto.skills.SkillCategoryResponse;
import com.fernandogferreyra.portfolio.backend.dto.skills.SkillCategoryUpdateRequest;
import com.fernandogferreyra.portfolio.backend.dto.skills.SkillCreateRequest;
import com.fernandogferreyra.portfolio.backend.dto.skills.SkillResponse;
import com.fernandogferreyra.portfolio.backend.dto.skills.SkillUpdateRequest;
import java.util.List;
import java.util.UUID;

public interface SkillCatalogService {

    List<SkillCategoryResponse> getPublicCatalog(String language);

    List<SkillCategoryResponse> getAdminCatalog(String language);

    SkillResponse createSkill(SkillCreateRequest request);

    SkillResponse updateSkill(UUID id, SkillUpdateRequest request);

    SkillCategoryResponse createCategory(SkillCategoryCreateRequest request);

    SkillCategoryResponse updateCategory(UUID id, SkillCategoryUpdateRequest request);

    void deleteCategory(UUID id);
}
