package com.fernandogferreyra.portfolio.backend.domain.skills.entity;

import com.fernandogferreyra.portfolio.backend.domain.entity.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import java.util.UUID;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(
    name = "skills",
    uniqueConstraints = @UniqueConstraint(name = "uk_skills_language_slug", columnNames = {"language", "slug"})
)
public class SkillEntity extends BaseEntity {

    @Column(nullable = false, length = 8)
    private String language;

    @Column(nullable = false, length = 120)
    private String slug;

    @Column(nullable = false, length = 160)
    private String name;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String description;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id")
    private SkillCategoryEntity category;

    @Column(nullable = false, length = 80)
    private String icon;

    @Column(name = "icon_document_id")
    private UUID iconDocumentId;

    @Column(name = "accent_color", nullable = false, length = 32)
    private String accentColor;

    @Column(nullable = false, length = 40)
    private String level;

    @Column(name = "tags_json", nullable = false, columnDefinition = "TEXT")
    private String tagsJson;

    @Column(name = "show_level", nullable = false)
    private boolean showLevel;

    @Column(nullable = false)
    private boolean published;

    @Column(name = "display_order", nullable = false)
    private int displayOrder;
}
