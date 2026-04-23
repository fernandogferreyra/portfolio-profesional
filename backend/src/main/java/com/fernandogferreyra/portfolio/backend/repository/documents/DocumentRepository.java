package com.fernandogferreyra.portfolio.backend.repository.documents;

import com.fernandogferreyra.portfolio.backend.domain.documents.entity.DocumentEntity;
import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DocumentRepository extends JpaRepository<DocumentEntity, UUID> {

    List<DocumentEntity> findAllByOrderByCreatedAtDesc();
}
