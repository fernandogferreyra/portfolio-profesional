package com.fernandogferreyra.portfolio.backend.controller;

import com.fernandogferreyra.portfolio.backend.dto.ApiResponse;
import com.fernandogferreyra.portfolio.backend.dto.analytics.AnalyticsEventRequest;
import com.fernandogferreyra.portfolio.backend.dto.analytics.AnalyticsEventResponse;
import com.fernandogferreyra.portfolio.backend.service.AnalyticsEventService;
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

