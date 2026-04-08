package com.fernandogferreyra.portfolio.backend.domain.budgetbuilder.engine;

import com.fernandogferreyra.portfolio.backend.domain.budgetbuilder.model.BudgetCalculationResult;
import com.fernandogferreyra.portfolio.backend.domain.budgetbuilder.model.BudgetProject;
import com.fernandogferreyra.portfolio.backend.domain.budgetbuilder.model.CommercialBudget;
import com.fernandogferreyra.portfolio.backend.domain.budgetbuilder.model.ConfigurationSnapshot;
import com.fernandogferreyra.portfolio.backend.domain.budgetbuilder.model.EstimateModule;
import com.fernandogferreyra.portfolio.backend.domain.budgetbuilder.model.TechnicalEstimate;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class BudgetBuilderPipeline {

    private final BudgetModuleResolver budgetModuleResolver;
    private final BudgetTechnicalEstimator budgetTechnicalEstimator;
    private final BudgetCommercialPricer budgetCommercialPricer;

    public BudgetCalculationResult run(
        BudgetProject project,
        ConfigurationSnapshot configuration
    ) {
        List<EstimateModule> modules = budgetModuleResolver.resolveModules(project, configuration);
        TechnicalEstimate technicalEstimate = budgetTechnicalEstimator.calculate(project, configuration, modules);
        CommercialBudget commercialBudget = budgetCommercialPricer.calculate(project, configuration, technicalEstimate);

        return new BudgetCalculationResult(modules, technicalEstimate, commercialBudget);
    }
}
