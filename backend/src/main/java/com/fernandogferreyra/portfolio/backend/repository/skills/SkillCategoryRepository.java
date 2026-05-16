package com.fernandogferreyra.portfolio.backend.repository.skills;

import com.fernandogferreyra.portfolio.backend.domain.skills.entity.SkillCategoryEntity;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SkillCategoryRepository extends JpaRepository<SkillCategoryEntity, UUID> {

    List<SkillCategoryEntity> findByLanguageOrderByDisplayOrderAscLabelAsc(String language);

    List<SkillCategoryEntity> findByLanguageAndPublishedTrueOrderByDisplayOrderAscLabelAsc(String language);

    Optional<SkillCategoryEntity> findByLanguageAndSlug(String language, String slug);

    boolean existsByLanguageAndSlug(String language, String slug);
}
