package com.fernandogferreyra.portfolio.backend.domain.budgetbuilder.engine;

import com.fernandogferreyra.portfolio.backend.domain.budgetbuilder.model.BudgetProject;
import com.fernandogferreyra.portfolio.backend.domain.budgetbuilder.model.ConfigurationSnapshot;
import com.fernandogferreyra.portfolio.backend.domain.budgetbuilder.model.EstimateModule;
import com.fernandogferreyra.portfolio.backend.domain.budgetbuilder.model.TechnicalEstimate;
import java.math.BigDecimal;
import java.util.List;
import org.springframework.stereotype.Component;

@Component
public class BudgetTechnicalEstimator {

    public TechnicalEstimate calculate(
        BudgetProject project,
        ConfigurationSnapshot configuration,
        List<EstimateModule> modules
    ) {
        List<EstimateModule> estimatedModules = modules.stream()
            .map(module -> enrichModule(module, project, configuration))
            .toList();

        BigDecimal rawTotalHours = estimatedModules.stream()
            .map(module -> BudgetCalculationUtils.safe(module.estimatedHours()))
            .reduce(BigDecimal.ZERO, BigDecimal::add);
        BigDecimal riskBufferHours = estimatedModules.isEmpty()
            ? BigDecimal.ZERO
            : BudgetCalculationUtils.roundCurrency(BudgetCalculationUtils.safe(configuration.riskBufferHours()));
        BigDecimal totalHours = BudgetCalculationUtils.roundTechnicalHours(
            rawTotalHours.add(riskBufferHours),
            configuration.roundingRules().technical());
        BigDecimal totalWeeks = configuration.workingHoursPerWeek() > 0
            ? BudgetCalculationUtils.roundCurrency(
                totalHours.divide(BigDecimal.valueOf(configuration.workingHoursPerWeek()), 2, java.math.RoundingMode.HALF_UP))
            : BigDecimal.ZERO;
        BigDecimal complexityScore = estimatedModules.isEmpty()
            ? BigDecimal.ZERO
            : BudgetCalculationUtils.roundCurrency(
                estimatedModules.stream()
                    .map(module -> BudgetCalculationUtils.safe(module.complexityWeight()))
                    .reduce(BigDecimal.ZERO, BigDecimal::add)
                    .divide(BigDecimal.valueOf(estimatedModules.size()), 2, java.math.RoundingMode.HALF_UP));

        return new TechnicalEstimate(
            project.id() + "-technical-estimate",
            project.id(),
            configuration.id(),
            estimatedModules,
            totalHours,
            totalWeeks,
            complexityScore,
            riskBufferHours,
            BigDecimal.ZERO,
            List.of(
                "PERT is applied when optimistic, probable, and pessimistic hours are available for the module.",
                "Project, stack, and complexity multipliers come from the active ConfigurationSnapshot."
            ),
            List.of(
                "Dependency blockers are informative and do not yet shift the calendar automatically.",
                "Support and SaaS pricing are calculated in the commercial stage, not in the technical estimate."
            ),
            configuration.createdAt()
        );
    }

    private EstimateModule enrichModule(
        EstimateModule module,
        BudgetProject project,
        ConfigurationSnapshot configuration
    ) {
        BigDecimal projectMultiplier = configuration.projectMultipliers()
            .getOrDefault(project.projectType(), BigDecimal.ONE);
        BigDecimal stackMultiplier = configuration.stackMultipliers()
            .getOrDefault(project.desiredStackId(), BigDecimal.ONE);
        BigDecimal complexityMultiplier = configuration.complexityMultipliers()
            .getOrDefault(project.complexity(), BigDecimal.ONE);
        BigDecimal moduleBaseHours = resolveModuleBaseHours(module);
        BigDecimal moduleHours = BudgetCalculationUtils.roundCurrency(
            moduleBaseHours
                .multiply(BigDecimal.valueOf(Math.max(module.quantity(), 0)))
                .multiply(BudgetCalculationUtils.safe(module.moduleMultiplier()))
                .multiply(BudgetCalculationUtils.safe(module.complexityWeight()))
                .multiply(projectMultiplier)
                .multiply(stackMultiplier)
                .multiply(complexityMultiplier)
        );

        return new EstimateModule(
            module.id(),
            module.category(),
            module.name(),
            module.description(),
            module.quantity(),
            module.tier(),
            module.baseHours(),
            module.optimisticHours(),
            module.probableHours(),
            module.pessimisticHours(),
            module.complexityWeight(),
            module.moduleMultiplier(),
            List.copyOf(module.dependencyIds()),
            module.blockingNote(),
            module.optional(),
            moduleHours
        );
    }

    private BigDecimal resolveModuleBaseHours(EstimateModule module) {
        BigDecimal optimistic = BudgetCalculationUtils.safe(module.optimisticHours());
        BigDecimal probable = BudgetCalculationUtils.safe(module.probableHours());
        BigDecimal pessimistic = BudgetCalculationUtils.safe(module.pessimisticHours());

        if (optimistic.signum() > 0 && probable.signum() > 0 && pessimistic.signum() > 0) {
            return BudgetCalculationUtils.roundCurrency(
                optimistic
                    .add(probable.multiply(BigDecimal.valueOf(4)))
                    .add(pessimistic)
                    .divide(BigDecimal.valueOf(6), 4, java.math.RoundingMode.HALF_UP)
            );
        }

        return BudgetCalculationUtils.safe(module.baseHours());
    }
}
