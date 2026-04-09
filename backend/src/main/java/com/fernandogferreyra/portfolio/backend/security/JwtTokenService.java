package com.fernandogferreyra.portfolio.backend.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import java.nio.charset.StandardCharsets;
import java.time.Clock;
import java.time.Instant;
import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.util.Collection;
import java.util.Date;
import java.util.List;
import java.util.Objects;
import java.util.UUID;
import javax.crypto.SecretKey;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

@Service
@RequiredArgsConstructor
public class JwtTokenService {

    private final JwtProperties jwtProperties;
    private final Clock clock;

    public IssuedJwt issueToken(UUID userId, String username, Collection<String> roles) {
        Instant now = Instant.now(clock);
        Instant expiration = now.plus(jwtProperties.expiration());
        List<String> normalizedRoles = roles.stream()
            .filter(Objects::nonNull)
            .distinct()
            .toList();

        String token = Jwts.builder()
            .subject(username)
            .issuer(jwtProperties.issuer())
            .issuedAt(Date.from(now))
            .expiration(Date.from(expiration))
            .claim("uid", userId.toString())
            .claim("role", normalizedRoles.stream().findFirst().orElse(null))
            .claim("roles", normalizedRoles)
            .signWith(signingKey())
            .compact();

        return new IssuedJwt(token, OffsetDateTime.ofInstant(expiration, ZoneOffset.UTC));
    }

    public AuthenticatedJwt parseAuthentication(String token) {
        Claims claims = parseClaims(token);
        List<SimpleGrantedAuthority> authorities = extractRoles(claims)
            .stream()
            .map(SimpleGrantedAuthority::new)
            .toList();

        return new AuthenticatedJwt(
            claims.getSubject(),
            claims.get("uid", String.class),
            authorities);
    }

    private Claims parseClaims(String token) {
        return Jwts.parser()
            .verifyWith(signingKey())
            .requireIssuer(jwtProperties.issuer())
            .build()
            .parseSignedClaims(token)
            .getPayload();
    }

    private SecretKey signingKey() {
        return Keys.hmacShaKeyFor(jwtProperties.secret().getBytes(StandardCharsets.UTF_8));
    }

    private List<String> extractRoles(Claims claims) {
        Object rolesClaim = claims.get("roles");
        if (rolesClaim instanceof Collection<?> roles) {
            return roles.stream()
                .map(String::valueOf)
                .filter(StringUtils::hasText)
                .distinct()
                .toList();
        }

        String roleClaim = claims.get("role", String.class);
        if (StringUtils.hasText(roleClaim)) {
            return List.of(roleClaim);
        }

        return List.of();
    }

    public record IssuedJwt(
        String token,
        OffsetDateTime expiresAt
    ) {
    }

    public record AuthenticatedJwt(
        String username,
        String userId,
        List<SimpleGrantedAuthority> authorities
    ) {
    }
}

