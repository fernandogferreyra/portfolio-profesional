package com.fernandogferreyra.portfolio.backend.module.projects.repository;

import com.fernandogferreyra.portfolio.backend.module.projects.domain.entity.ProjectEntity;
import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProjectRepository extends JpaRepository<ProjectEntity, UUID> {

    List<ProjectEntity> findByPublishedTrueOrderByDisplayOrderAsc();
}

