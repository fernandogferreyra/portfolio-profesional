package com.fernandogferreyra.portfolio.backend.domain.documents.entity;

import com.fernandogferreyra.portfolio.backend.domain.entity.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "document_contents")
public class DocumentContentEntity extends BaseEntity {

    @Column(nullable = false, columnDefinition = "BYTEA")
    private byte[] content;
}
