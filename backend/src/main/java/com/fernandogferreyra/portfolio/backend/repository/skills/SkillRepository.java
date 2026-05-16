package com.fernandogferreyra.portfolio.backend.repository.skills;

import com.fernandogferreyra.portfolio.backend.domain.skills.entity.SkillCategoryEntity;
import com.fernandogferreyra.portfolio.backend.domain.skills.entity.SkillEntity;
import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SkillRepository extends JpaRepository<SkillEntity, UUID> {

    List<SkillEntity> findByLanguageOrderByDisplayOrderAscNameAsc(String language);

    List<SkillEntity> findByLanguageAndPublishedTrueOrderByDisplayOrderAscNameAsc(String language);

    List<SkillEntity> findByCategory(SkillCategoryEntity category);

    List<SkillEntity> findAllByIconDocumentId(UUID iconDocumentId);

    boolean existsByLanguageAndSlug(String language, String slug);
}
