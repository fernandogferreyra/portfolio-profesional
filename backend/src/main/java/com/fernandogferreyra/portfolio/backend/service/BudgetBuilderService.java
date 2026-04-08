package com.fernandogferreyra.portfolio.backend.service;

import com.fernandogferreyra.portfolio.backend.dto.budgetbuilder.BudgetPreviewRequest;
import com.fernandogferreyra.portfolio.backend.dto.budgetbuilder.BudgetPreviewResponse;

public interface BudgetBuilderService {

    BudgetPreviewResponse preview(BudgetPreviewRequest request);
}
