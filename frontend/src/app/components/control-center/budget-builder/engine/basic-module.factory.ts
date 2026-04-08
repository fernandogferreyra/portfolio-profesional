import {
  BudgetProject,
  ConfigurationSnapshot,
  EstimateModule,
} from '../models/budget-builder.models';

function cloneModule(module: EstimateModule): EstimateModule {
  return {
    ...module,
    dependencyIds: [...module.dependencyIds],
  };
}

function resolveModuleIds(project: BudgetProject, configuration: ConfigurationSnapshot): string[] {
  if (project.selectedModuleIds.length > 0 || project.moduleSelectionMode === 'EXPLICIT') {
    return [...new Set(project.selectedModuleIds)];
  }

  const defaults = configuration.projectTypeDefaults.find(
    (rule) => rule.projectType === project.projectType,
  );

  return defaults ? [...new Set(defaults.defaultModuleIds)] : [];
}

export function generateBasicModules(
  project: BudgetProject,
  configuration: ConfigurationSnapshot,
): EstimateModule[] {
  const requestedModuleIds = resolveModuleIds(project, configuration);

  return requestedModuleIds
    .map((moduleId) => configuration.moduleCatalog.find((module) => module.id === moduleId) ?? null)
    .filter((module): module is EstimateModule => Boolean(module))
    .map(cloneModule);
}
