package com.fernandogferreyra.portfolio.backend.module.analytics.service;

import com.fernandogferreyra.portfolio.backend.module.analytics.domain.dto.AnalyticsEventRequest;
import com.fernandogferreyra.portfolio.backend.module.analytics.domain.dto.AnalyticsEventResponse;

public interface AnalyticsEventService {

    AnalyticsEventResponse track(AnalyticsEventRequest request);
}

