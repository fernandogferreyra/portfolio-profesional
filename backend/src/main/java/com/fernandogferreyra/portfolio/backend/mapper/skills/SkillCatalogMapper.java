package com.fernandogferreyra.portfolio.backend.mapper.skills;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fernandogferreyra.portfolio.backend.domain.skills.entity.SkillCategoryEntity;
import com.fernandogferreyra.portfolio.backend.domain.skills.entity.SkillEntity;
import com.fernandogferreyra.portfolio.backend.dto.skills.SkillCategoryResponse;
import com.fernandogferreyra.portfolio.backend.dto.skills.SkillResponse;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class SkillCatalogMapper {

    private static final TypeReference<List<String>> STRING_LIST = new TypeReference<>() {
    };

    private final ObjectMapper objectMapper;

    public SkillCategoryResponse toCategoryResponse(SkillCategoryEntity category, List<SkillResponse> skills) {
        return new SkillCategoryResponse(
            category.getId(),
            category.getLanguage(),
            category.getSlug(),
            category.getLabel(),
            category.getDescription(),
            category.isPublished(),
            category.getDisplayOrder(),
            skills);
    }

    public SkillResponse toSkillResponse(SkillEntity skill) {
        SkillCategoryEntity category = skill.getCategory();
        return new SkillResponse(
            skill.getId(),
            skill.getLanguage(),
            skill.getSlug(),
            skill.getName(),
            skill.getDescription(),
            category == null ? null : category.getId(),
            category == null ? null : category.getSlug(),
            skill.getIcon(),
            skill.getLevel(),
            readTags(skill.getTagsJson()),
            skill.isShowLevel(),
            skill.isPublished(),
            skill.getDisplayOrder());
    }

    public List<String> readTags(String tagsJson) {
        if (tagsJson == null || tagsJson.isBlank()) {
            return List.of();
        }

        try {
            return objectMapper.readValue(tagsJson, STRING_LIST);
        } catch (Exception exception) {
            throw new IllegalArgumentException("Unable to parse skill tags", exception);
        }
    }

    public String writeTags(List<String> tags) {
        try {
            return objectMapper.writeValueAsString(tags == null ? List.of() : tags.stream()
                .map(String::trim)
                .filter(tag -> !tag.isBlank())
                .toList());
        } catch (Exception exception) {
            throw new IllegalArgumentException("Unable to serialize skill tags", exception);
        }
    }
}
