package com.fernandogferreyra.portfolio.backend.domain.budgetbuilder.engine;

import com.fernandogferreyra.portfolio.backend.domain.budgetbuilder.enums.BudgetModuleSelectionMode;
import com.fernandogferreyra.portfolio.backend.domain.budgetbuilder.model.BudgetProject;
import com.fernandogferreyra.portfolio.backend.domain.budgetbuilder.model.ConfigurationSnapshot;
import com.fernandogferreyra.portfolio.backend.domain.budgetbuilder.model.EstimateModule;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ResponseStatusException;

@Component
public class BudgetModuleResolver {

    public List<EstimateModule> resolveModules(
        BudgetProject project,
        ConfigurationSnapshot configuration
    ) {
        List<String> moduleIds = resolveModuleIds(project, configuration);

        return moduleIds.stream()
            .map(moduleId -> findModule(moduleId, configuration))
            .map(this::cloneModule)
            .toList();
    }

    private List<String> resolveModuleIds(BudgetProject project, ConfigurationSnapshot configuration) {
        if (!project.selectedModuleIds().isEmpty()) {
            return deduplicate(project.selectedModuleIds());
        }

        if (project.moduleSelectionMode() == BudgetModuleSelectionMode.EXPLICIT) {
            return List.of();
        }

        return configuration.projectTypeDefaults().stream()
            .filter(rule -> rule.projectType().equals(project.projectType()))
            .findFirst()
            .map(ConfigurationSnapshot.ProjectTypeDefaultRule::defaultModuleIds)
            .map(this::deduplicate)
            .orElse(List.of());
    }

    private EstimateModule findModule(String moduleId, ConfigurationSnapshot configuration) {
        return configuration.moduleCatalog().stream()
            .filter(module -> module.id().equals(moduleId))
            .findFirst()
            .orElseThrow(() -> new ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "Unsupported module: " + moduleId));
    }

    private EstimateModule cloneModule(EstimateModule module) {
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
            null
        );
    }

    private List<String> deduplicate(List<String> items) {
        Set<String> unique = new LinkedHashSet<>(items);
        return List.copyOf(unique);
    }
}
