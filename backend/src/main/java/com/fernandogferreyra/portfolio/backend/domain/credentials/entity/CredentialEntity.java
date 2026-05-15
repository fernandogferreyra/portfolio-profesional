package com.fernandogferreyra.portfolio.backend.domain.credentials.entity;

import com.fernandogferreyra.portfolio.backend.domain.entity.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import java.util.UUID;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "credentials")
public class CredentialEntity extends BaseEntity {

    @Column(nullable = false, length = 8)
    private String language;

    @Column(name = "credential_type", nullable = false, length = 80)
    private String type;

    @Column(nullable = false, length = 220)
    private String title;

    @Column(nullable = false, length = 180)
    private String institution;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String description;

    @Column(name = "document_id")
    private UUID documentId;

    @Column(nullable = false)
    private boolean published;

    @Column(name = "display_order", nullable = false)
    private int displayOrder;
}
