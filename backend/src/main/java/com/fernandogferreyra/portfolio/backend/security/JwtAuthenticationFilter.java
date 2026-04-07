package com.fernandogferreyra.portfolio.backend.security;

import io.jsonwebtoken.JwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private static final String BEARER_PREFIX = "Bearer ";

    private final JwtTokenService jwtTokenService;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
        throws ServletException, IOException {

        String authorizationHeader = request.getHeader(HttpHeaders.AUTHORIZATION);
        if (authorizationHeader == null || !authorizationHeader.startsWith(BEARER_PREFIX)) {
            filterChain.doFilter(request, response);
            return;
        }

        String token = authorizationHeader.substring(BEARER_PREFIX.length());

        try {
            if (SecurityContextHolder.getContext().getAuthentication() == null) {
                JwtTokenService.AuthenticatedJwt authenticatedJwt = jwtTokenService.parseAuthentication(token);

                UsernamePasswordAuthenticationToken authenticationToken =
                    UsernamePasswordAuthenticationToken.authenticated(
                        authenticatedJwt.username(),
                        token,
                        authenticatedJwt.authorities());
                authenticationToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(authenticationToken);
            }
        } catch (JwtException | IllegalArgumentException exception) {
            throw new BadCredentialsException("Invalid JWT token", exception);
        }

        filterChain.doFilter(request, response);
    }
}

