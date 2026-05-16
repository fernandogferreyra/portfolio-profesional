package com.fernandogferreyra.portfolio.backend.repository.documents;

import com.fernandogferreyra.portfolio.backend.domain.documents.entity.DocumentContentEntity;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DocumentContentRepository extends JpaRepository<DocumentContentEntity, UUID> {
}
