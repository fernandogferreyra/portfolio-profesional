package com.fernandogferreyra.portfolio.backend.service;

import com.fernandogferreyra.portfolio.backend.domain.budgetbuilder.model.ConfigurationSnapshot;

public interface BudgetConfigurationService {

    ConfigurationSnapshot getActiveConfiguration();
}
