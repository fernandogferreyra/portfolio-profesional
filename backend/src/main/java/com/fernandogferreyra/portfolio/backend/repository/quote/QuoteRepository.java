package com.fernandogferreyra.portfolio.backend.repository.quote;

import com.fernandogferreyra.portfolio.backend.domain.quote.entity.QuoteEntity;
import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface QuoteRepository extends JpaRepository<QuoteEntity, UUID> {

    List<QuoteEntity> findAllByOrderByCreatedAtDesc();
}
