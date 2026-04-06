package com.fernandogferreyra.portfolio.backend.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import java.nio.charset.StandardCharsets;
import java.time.Clock;
import java.time.Instant;
import java.util.Date;
import java.util.Map;
import javax.crypto.SecretKey;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class JwtTokenService {

    private final JwtProperties jwtProperties;
    private final Clock clock;

    public String generateToken(String subject, Map<String, Object> claims) {
        Instant now = Instant.now(clock);
        Instant expiration = now.plus(jwtProperties.expiration());

        return Jwts.builder()
            .claims(claims)
            .subject(subject)
            .issuer(jwtProperties.issuer())
            .issuedAt(Date.from(now))
            .expiration(Date.from(expiration))
            .signWith(signingKey())
            .compact();
    }

    public String extractSubject(String token) {
        return parseClaims(token).getSubject();
    }

    public boolean isTokenValid(String token) {
        Claims claims = parseClaims(token);
        return claims.getExpiration().after(Date.from(Instant.now(clock)));
    }

    private Claims parseClaims(String token) {
        return Jwts.parser()
            .verifyWith(signingKey())
            .build()
            .parseSignedClaims(token)
            .getPayload();
    }

    private SecretKey signingKey() {
        return Keys.hmacShaKeyFor(jwtProperties.secret().getBytes(StandardCharsets.UTF_8));
    }
}

