import {
  BudgetProject,
  ConfigurationSnapshot,
  EstimateModule,
  TechnicalEstimate,
} from '../models/budget-builder.models';
import { roundCurrency, roundTechnicalHours } from './budget-builder.utils';

function sanitizeNonNegativeNumber(value: number): number {
  return Number.isFinite(value) ? Math.max(value, 0) : 0;
}

function calculateModuleHours(
  module: EstimateModule,
  project: BudgetProject,
  configuration: ConfigurationSnapshot,
): number {
  const projectMultiplier = configuration.projectMultipliers[project.projectType] ?? 1;
  const stackMultiplier = configuration.stackMultipliers[project.desiredStackId] ?? 1;
  const complexityMultiplier = configuration.complexityMultipliers[project.complexity] ?? 1;
  const baseHours = sanitizeNonNegativeNumber(module.baseHours);
  const quantity = sanitizeNonNegativeNumber(module.quantity);
  const moduleMultiplier = sanitizeNonNegativeNumber(module.moduleMultiplier);
  const complexityWeight = sanitizeNonNegativeNumber(module.complexityWeight);

  return roundCurrency(
    baseHours *
      quantity *
      moduleMultiplier *
      complexityWeight *
      projectMultiplier *
      stackMultiplier *
      complexityMultiplier,
  );
}

export function calculateTechnicalEstimate(
  project: BudgetProject,
  configuration: ConfigurationSnapshot,
  modules: EstimateModule[],
): TechnicalEstimate {
  const estimatedModules = modules.map((module) => ({
    ...module,
    estimatedHours: calculateModuleHours(module, project, configuration),
    dependencyIds: [...module.dependencyIds],
  }));
  const rawTotalHours = estimatedModules.reduce(
    (sum, module) => sum + (module.estimatedHours ?? 0),
    0,
  );
  const totalHours = roundTechnicalHours(rawTotalHours, configuration.roundingRules.technical);
  const totalWeeks =
    configuration.workingHoursPerWeek > 0
      ? roundCurrency(totalHours / configuration.workingHoursPerWeek)
      : 0;
  const complexityScore = estimatedModules.length
    ? roundCurrency(
        estimatedModules.reduce((sum, module) => sum + module.complexityWeight, 0) /
          estimatedModules.length,
      )
    : 0;

  return {
    id: `${project.id}-technical-estimate`,
    projectId: project.id,
    configurationSnapshotId: configuration.id,
    modules: estimatedModules,
    totalHours,
    totalWeeks,
    complexityScore,
    riskBufferHours: 0,
    coordinationBufferHours: 0,
    assumptions: [
      'MVP without risk or coordination buffers.',
      'Project, stack, and complexity multipliers come from ConfigurationSnapshot.',
    ],
    exclusions: [
      'Advanced PERT inputs per task are pending.',
      'Maintenance and user scale rules are pending in the engine.',
    ],
    generatedAt: configuration.createdAt,
  };
}
