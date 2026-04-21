package com.fernandogferreyra.portfolio.backend.repository.projects;

import com.fernandogferreyra.portfolio.backend.domain.projects.entity.ProjectEntity;
import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProjectRepository extends JpaRepository<ProjectEntity, UUID> {

    List<ProjectEntity> findAllByOrderByDisplayOrderAsc();

    List<ProjectEntity> findByPublishedTrueOrderByDisplayOrderAsc();
}
