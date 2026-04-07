package com.fernandogferreyra.portfolio.backend.module.auth.service.impl;

import com.fernandogferreyra.portfolio.backend.module.auth.domain.dto.LoginRequest;
import com.fernandogferreyra.portfolio.backend.module.auth.domain.dto.LoginResponse;
import com.fernandogferreyra.portfolio.backend.module.auth.domain.entity.AppUser;
import com.fernandogferreyra.portfolio.backend.module.auth.repository.AppUserRepository;
import com.fernandogferreyra.portfolio.backend.module.auth.service.AuthService;
import com.fernandogferreyra.portfolio.backend.security.JwtTokenService;
import java.util.List;
import java.util.Locale;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AuthServiceImpl implements AuthService {

    private final AppUserRepository appUserRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenService jwtTokenService;

    @Override
    public LoginResponse login(LoginRequest request) {
        AppUser appUser = appUserRepository.findByUsername(normalizeUsername(request.username()))
            .filter(AppUser::isEnabled)
            .orElseThrow(this::invalidCredentials);

        if (!passwordEncoder.matches(request.password(), appUser.getPasswordHash())) {
            throw invalidCredentials();
        }

        JwtTokenService.IssuedJwt issuedJwt = jwtTokenService.issueToken(
            appUser.getId(),
            appUser.getUsername(),
            List.of(appUser.getRole().name()));

        return new LoginResponse(
            issuedJwt.token(),
            "Bearer",
            issuedJwt.expiresAt(),
            appUser.getUsername(),
            appUser.getRole());
    }

    private ResponseStatusException invalidCredentials() {
        return new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid credentials");
    }

    private String normalizeUsername(String username) {
        return username.trim().toLowerCase(Locale.ROOT);
    }
}
