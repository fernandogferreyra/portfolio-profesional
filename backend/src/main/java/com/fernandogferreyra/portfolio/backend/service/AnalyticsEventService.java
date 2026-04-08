package com.fernandogferreyra.portfolio.backend.service;

import com.fernandogferreyra.portfolio.backend.dto.analytics.AnalyticsEventRequest;
import com.fernandogferreyra.portfolio.backend.dto.analytics.AnalyticsEventResponse;

public interface AnalyticsEventService {

    AnalyticsEventResponse track(AnalyticsEventRequest request);
}

