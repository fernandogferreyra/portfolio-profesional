package com.fernandogferreyra.portfolio.backend.controller.admin;

import com.fernandogferreyra.portfolio.backend.dto.ApiResponse;
import com.fernandogferreyra.portfolio.backend.dto.budgetbuilder.BudgetAdminDetailResponse;
import com.fernandogferreyra.portfolio.backend.dto.budgetbuilder.BudgetAdminSummaryResponse;
import com.fernandogferreyra.portfolio.backend.dto.budgetbuilder.BudgetConfigurationResponse;
import com.fernandogferreyra.portfolio.backend.dto.budgetbuilder.BudgetPreviewRequest;
import com.fernandogferreyra.portfolio.backend.dto.budgetbuilder.BudgetPreviewResponse;
import com.fernandogferreyra.portfolio.backend.dto.budgetbuilder.BudgetSaveRequest;
import com.fernandogferreyra.portfolio.backend.dto.budgetbuilder.BudgetSaveResponse;
import com.fernandogferreyra.portfolio.backend.service.BudgetBuilderService;
import com.fernandogferreyra.portfolio.backend.util.ApiPaths;
import jakarta.validation.Valid;
import java.util.List;
import java.util.UUID;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(ApiPaths.API_BASE + "/admin/budget-builder")
@RequiredArgsConstructor
public class BudgetBuilderAdminController {

    private final BudgetBuilderService budgetBuilderService;

    @PostMapping("/preview")
    public ApiResponse<BudgetPreviewResponse> preview(@Valid @RequestBody BudgetPreviewRequest request) {
        return ApiResponse.success("Budget preview generated successfully", budgetBuilderService.preview(request));
    }

    @PostMapping
    public ApiResponse<BudgetSaveResponse> save(@Valid @RequestBody BudgetSaveRequest request) {
        return ApiResponse.success("Budget saved successfully", budgetBuilderService.save(request));
    }

    @GetMapping
    public ApiResponse<List<BudgetAdminSummaryResponse>> listBudgets() {
        return ApiResponse.success("Budgets retrieved", budgetBuilderService.getBudgets());
    }

    @GetMapping("/configuration/active")
    public ApiResponse<BudgetConfigurationResponse> getActiveConfiguration() {
        return ApiResponse.success("Budget configuration retrieved", budgetBuilderService.getActiveConfiguration());
    }

    @GetMapping("/{id}")
    public ApiResponse<BudgetAdminDetailResponse> getBudget(@PathVariable UUID id) {
        return ApiResponse.success("Budget retrieved", budgetBuilderService.getBudgetById(id));
    }
}
