package com.fernandogferreyra.portfolio.backend.domain.skills.entity;

import com.fernandogferreyra.portfolio.backend.domain.entity.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(
    name = "skill_categories",
    uniqueConstraints = @UniqueConstraint(name = "uk_skill_categories_language_slug", columnNames = {"language", "slug"})
)
public class SkillCategoryEntity extends BaseEntity {

    @Column(nullable = false, length = 8)
    private String language;

    @Column(nullable = false, length = 120)
    private String slug;

    @Column(nullable = false, length = 160)
    private String label;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false)
    private boolean published;

    @Column(name = "display_order", nullable = false)
    private int displayOrder;
}
