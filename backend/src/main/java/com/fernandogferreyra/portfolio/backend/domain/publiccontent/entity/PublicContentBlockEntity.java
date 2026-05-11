package com.fernandogferreyra.portfolio.backend.domain.publiccontent.entity;

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
    name = "public_content_blocks",
    uniqueConstraints = @UniqueConstraint(name = "uk_public_content_blocks_key_language", columnNames = {"content_key", "language"})
)
public class PublicContentBlockEntity extends BaseEntity {

    @Column(name = "content_key", nullable = false, length = 120)
    private String contentKey;

    @Column(nullable = false, length = 8)
    private String language;

    @Column(nullable = false, length = 220)
    private String title;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String body;

    @Column(name = "items_json", columnDefinition = "TEXT")
    private String itemsJson;

    @Column(nullable = false)
    private boolean published;

    @Column(name = "display_order", nullable = false)
    private int displayOrder;
}
