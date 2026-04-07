package com.fernandogferreyra.portfolio.backend.security;

import com.fernandogferreyra.portfolio.backend.domain.enums.UserRole;
import com.fernandogferreyra.portfolio.backend.module.auth.domain.entity.AppUser;
import com.fernandogferreyra.portfolio.backend.module.auth.repository.AppUserRepository;
import java.util.Locale;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

@Component
@RequiredArgsConstructor
public class AdminBootstrapInitializer implements ApplicationRunner {

    private final BootstrapAdminProperties bootstrapAdminProperties;
    private final AppUserRepository appUserRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public void run(ApplicationArguments args) {
        if (!bootstrapAdminProperties.enabled()
            || !StringUtils.hasText(bootstrapAdminProperties.username())
            || !StringUtils.hasText(bootstrapAdminProperties.password())) {
            return;
        }

        String normalizedUsername = bootstrapAdminProperties.username().trim().toLowerCase(Locale.ROOT);
        AppUser appUser = appUserRepository.findByUsername(normalizedUsername)
            .orElseGet(AppUser::new);

        appUser.setUsername(normalizedUsername);
        if (!StringUtils.hasText(appUser.getPasswordHash())
            || !passwordEncoder.matches(bootstrapAdminProperties.password(), appUser.getPasswordHash())) {
            appUser.setPasswordHash(passwordEncoder.encode(bootstrapAdminProperties.password()));
        }
        appUser.setRole(UserRole.ROLE_FERCHUZ);
        appUser.setEnabled(true);

        appUserRepository.save(appUser);
    }
}
