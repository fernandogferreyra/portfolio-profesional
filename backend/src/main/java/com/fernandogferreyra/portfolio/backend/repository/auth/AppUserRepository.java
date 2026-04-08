package com.fernandogferreyra.portfolio.backend.repository.auth;

import com.fernandogferreyra.portfolio.backend.domain.auth.entity.AppUser;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AppUserRepository extends JpaRepository<AppUser, UUID> {

    Optional<AppUser> findByUsername(String username);
}
