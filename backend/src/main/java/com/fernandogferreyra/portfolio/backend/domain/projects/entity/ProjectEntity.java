package com.fernandogferreyra.portfolio.backend.domain.projects.entity;

import com.fernandogferreyra.portfolio.backend.domain.entity.BaseEntity;
import com.fernandogferreyra.portfolio.backend.domain.enums.ProjectCategory;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Table;
import java.util.UUID;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "projects")
public class ProjectEntity extends BaseEntity {

    @Column(nullable = false, unique = true, length = 120)
    private String slug;

    @Column(nullable = false, length = 180)
    private String name;

    @Column(name = "project_year", length = 4)
    private String projectYear;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 80)
    private ProjectCategory category;

    @Column(nullable = false, length = 500)
    private String summary;

    @Column(name = "repository_url", length = 400)
    private String repositoryUrl;

    @Column(name = "demo_url", length = 400)
    private String demoUrl;

    @Column(name = "monograph_url", length = 400)
    private String monographUrl;

    @Column(name = "icon_document_id")
    private UUID iconDocumentId;

    @Column(name = "stack_json", columnDefinition = "TEXT")
    private String stackJson;

    @Column(name = "metrics_json", columnDefinition = "TEXT")
    private String metricsJson;

    @Column(name = "sections_json", columnDefinition = "TEXT")
    private String sectionsJson;

    @Column(name = "features_json", columnDefinition = "TEXT")
    private String featuresJson;

    @Column(name = "documentation_document_ids_json", columnDefinition = "TEXT")
    private String documentationDocumentIdsJson;

    @Column(name = "screenshot_document_ids_json", columnDefinition = "TEXT")
    private String screenshotDocumentIdsJson;

    @Column(nullable = false)
    private boolean featured;

    @Column(nullable = false)
    private boolean published;

    @Column(name = "display_order", nullable = false)
    private int displayOrder;
}
