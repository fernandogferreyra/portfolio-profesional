import {
  BudgetProject,
  CommercialBudget,
  ConfigurationSnapshot,
  EstimateModule,
  TechnicalEstimate,
} from '../models/budget-builder.models';
import { generateBasicModules } from './basic-module.factory';
import { buildCommercialBudget } from './commercial-pricer';
import { calculateTechnicalEstimate } from './technical-estimator';

export interface BudgetPipelineResult {
  modules: EstimateModule[];
  technicalEstimate: TechnicalEstimate;
  commercialBudget: CommercialBudget;
}

export function runBudgetBuilderPipeline(
  project: BudgetProject,
  configuration: ConfigurationSnapshot,
): BudgetPipelineResult {
  const modules = generateBasicModules(project, configuration);
  const technicalEstimate = calculateTechnicalEstimate(project, configuration, modules);
  const commercialBudget = buildCommercialBudget(project, configuration, technicalEstimate);

  return {
    modules,
    technicalEstimate,
    commercialBudget,
  };
}
