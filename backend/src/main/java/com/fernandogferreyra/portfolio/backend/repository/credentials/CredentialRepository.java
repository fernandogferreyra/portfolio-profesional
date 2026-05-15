package com.fernandogferreyra.portfolio.backend.repository.credentials;

import com.fernandogferreyra.portfolio.backend.domain.credentials.entity.CredentialEntity;
import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CredentialRepository extends JpaRepository<CredentialEntity, UUID> {

    List<CredentialEntity> findAllByOrderByDisplayOrderAscTitleAscLanguageAsc();

    List<CredentialEntity> findByPublishedTrueOrderByDisplayOrderAscTitleAscLanguageAsc();

    List<CredentialEntity> findAllByDocumentId(UUID documentId);
}
