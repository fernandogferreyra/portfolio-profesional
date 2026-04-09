package com.fernandogferreyra.portfolio.backend.repository.budgetbuilder;

import com.fernandogferreyra.portfolio.backend.domain.budgetbuilder.entity.BudgetSnapshotEntity;
import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BudgetSnapshotRepository extends JpaRepository<BudgetSnapshotEntity, UUID> {

    List<BudgetSnapshotEntity> findAllByOrderByCreatedAtDesc();
}
