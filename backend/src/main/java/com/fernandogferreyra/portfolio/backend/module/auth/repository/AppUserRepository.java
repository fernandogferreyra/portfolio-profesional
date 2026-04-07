package com.fernandogferreyra.portfolio.backend.module.auth.repository;

import com.fernandogferreyra.portfolio.backend.module.auth.domain.entity.AppUser;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AppUserRepository extends JpaRepository<AppUser, UUID> {

    Optional<AppUser> findByUsername(String username);
}
