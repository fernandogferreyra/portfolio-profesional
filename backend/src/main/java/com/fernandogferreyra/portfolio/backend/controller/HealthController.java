package com.fernandogferreyra.portfolio.backend.controller;

import com.fernandogferreyra.portfolio.backend.domain.dto.ApiResponse;
import com.fernandogferreyra.portfolio.backend.domain.dto.HealthResponse;
import com.fernandogferreyra.portfolio.backend.util.ApiPaths;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(ApiPaths.API_BASE)
public class HealthController {

    @GetMapping("/health")
    public ApiResponse<HealthResponse> health() {
        return ApiResponse.success(
            "Portfolio backend is available",
            new HealthResponse("ok", "portfolio-backend", "v1"));
    }
}

