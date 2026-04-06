package com.fernandogferreyra.portfolio.backend.module.analytics.controller;

import com.fernandogferreyra.portfolio.backend.domain.dto.ApiResponse;
import com.fernandogferreyra.portfolio.backend.module.analytics.domain.dto.AnalyticsEventRequest;
import com.fernandogferreyra.portfolio.backend.module.analytics.domain.dto.AnalyticsEventResponse;
import com.fernandogferreyra.portfolio.backend.module.analytics.service.AnalyticsEventService;
import com.fernandogferreyra.portfolio.backend.util.ApiPaths;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(ApiPaths.API_BASE)
@RequiredArgsConstructor
public class EventController {

    private final AnalyticsEventService analyticsEventService;

    @PostMapping("/events")
    public ApiResponse<AnalyticsEventResponse> track(@Valid @RequestBody AnalyticsEventRequest request) {
        return ApiResponse.success("Event accepted", analyticsEventService.track(request));
    }
}

