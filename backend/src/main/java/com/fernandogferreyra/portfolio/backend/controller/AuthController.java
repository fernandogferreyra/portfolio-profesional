package com.fernandogferreyra.portfolio.backend.controller;

import com.fernandogferreyra.portfolio.backend.dto.ApiResponse;
import com.fernandogferreyra.portfolio.backend.dto.auth.LoginRequest;
import com.fernandogferreyra.portfolio.backend.dto.auth.LoginResponse;
import com.fernandogferreyra.portfolio.backend.service.AuthService;
import com.fernandogferreyra.portfolio.backend.util.ApiPaths;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(ApiPaths.API_BASE + "/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    public ApiResponse<LoginResponse> login(@Valid @RequestBody LoginRequest request) {
        return ApiResponse.success("Login successful", authService.login(request));
    }
}
