package com.fernandogferreyra.portfolio.backend.controller.admin;

import com.fernandogferreyra.portfolio.backend.dto.ApiResponse;
import com.fernandogferreyra.portfolio.backend.dto.analytics.AnalyticsEventAdminResponse;
import com.fernandogferreyra.portfolio.backend.service.AnalyticsEventService;
import com.fernandogferreyra.portfolio.backend.util.ApiPaths;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(ApiPaths.API_BASE + "/admin/events")
@RequiredArgsConstructor
public class AnalyticsEventAdminController {

    private final AnalyticsEventService analyticsEventService;

    @GetMapping
    public ApiResponse<List<AnalyticsEventAdminResponse>> listEvents(
        @RequestParam(defaultValue = "400") int limit
    ) {
        return ApiResponse.success("Events retrieved", analyticsEventService.getRecentEvents(limit));
    }
}
