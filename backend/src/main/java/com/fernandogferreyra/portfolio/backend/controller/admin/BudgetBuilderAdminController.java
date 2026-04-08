package com.fernandogferreyra.portfolio.backend.controller.admin;

import com.fernandogferreyra.portfolio.backend.dto.ApiResponse;
import com.fernandogferreyra.portfolio.backend.dto.budgetbuilder.BudgetPreviewRequest;
import com.fernandogferreyra.portfolio.backend.dto.budgetbuilder.BudgetPreviewResponse;
import com.fernandogferreyra.portfolio.backend.service.BudgetBuilderService;
import com.fernandogferreyra.portfolio.backend.util.ApiPaths;
import jakarta.validation.Valid;
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
}
