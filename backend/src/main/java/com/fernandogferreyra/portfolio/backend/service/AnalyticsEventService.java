package com.fernandogferreyra.portfolio.backend.service;

import com.fernandogferreyra.portfolio.backend.dto.analytics.AnalyticsEventRequest;
import com.fernandogferreyra.portfolio.backend.dto.analytics.AnalyticsEventAdminResponse;
import com.fernandogferreyra.portfolio.backend.dto.analytics.AnalyticsEventResponse;
import java.util.List;

public interface AnalyticsEventService {

    AnalyticsEventResponse track(AnalyticsEventRequest request);

    List<AnalyticsEventAdminResponse> getRecentEvents(int limit);
}

