package com.fernandogferreyra.portfolio.backend.service;

import com.fernandogferreyra.portfolio.backend.dto.budgetbuilder.BudgetAdminDetailResponse;
import com.fernandogferreyra.portfolio.backend.dto.budgetbuilder.BudgetAdminSummaryResponse;
import com.fernandogferreyra.portfolio.backend.dto.budgetbuilder.BudgetConfigurationResponse;
import com.fernandogferreyra.portfolio.backend.dto.budgetbuilder.BudgetPreviewRequest;
import com.fernandogferreyra.portfolio.backend.dto.budgetbuilder.BudgetPreviewResponse;
import com.fernandogferreyra.portfolio.backend.dto.budgetbuilder.BudgetSaveRequest;
import com.fernandogferreyra.portfolio.backend.dto.budgetbuilder.BudgetSaveResponse;
import java.util.List;
import java.util.UUID;

public interface BudgetBuilderService {

    BudgetPreviewResponse preview(BudgetPreviewRequest request);

    BudgetSaveResponse save(BudgetSaveRequest request);

    List<BudgetAdminSummaryResponse> getBudgets();

    BudgetAdminDetailResponse getBudgetById(UUID budgetId);

    BudgetConfigurationResponse getActiveConfiguration();
}
