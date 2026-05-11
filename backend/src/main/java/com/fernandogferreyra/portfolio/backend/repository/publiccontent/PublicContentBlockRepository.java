package com.fernandogferreyra.portfolio.backend.repository.publiccontent;

import com.fernandogferreyra.portfolio.backend.domain.publiccontent.entity.PublicContentBlockEntity;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PublicContentBlockRepository extends JpaRepository<PublicContentBlockEntity, UUID> {

    List<PublicContentBlockEntity> findAllByOrderByDisplayOrderAscContentKeyAscLanguageAsc();

    List<PublicContentBlockEntity> findByPublishedTrueOrderByDisplayOrderAscContentKeyAscLanguageAsc();

    Optional<PublicContentBlockEntity> findByContentKeyAndLanguageAndPublishedTrue(String contentKey, String language);
}
