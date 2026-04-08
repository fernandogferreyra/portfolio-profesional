import {
  applyManualDiscounts,
  applySimpleSurcharges,
  calculateCommercialSubtotal,
} from './commercial-pricer';
import { generateBasicModules } from './basic-module.factory';
import { runBudgetBuilderPipeline } from './budget-builder.pipeline';
import { calculateTechnicalEstimate } from './technical-estimator';
import {
  MOCK_BUDGET_PROJECT,
  MOCK_CONFIGURATION_SNAPSHOT,
} from '../mocks/budget-builder.mock-data';

describe('Budget Builder MVP engine', () => {
  it('calculates total hours from the selected modules', () => {
    const modules = generateBasicModules(MOCK_BUDGET_PROJECT, MOCK_CONFIGURATION_SNAPSHOT);
    const technicalEstimate = calculateTechnicalEstimate(
      MOCK_BUDGET_PROJECT,
      MOCK_CONFIGURATION_SNAPSHOT,
      modules,
    );

    expect(technicalEstimate.totalHours).toBe(25);
  });

  it('calculates subtotal from total hours and hourly rate', () => {
    const modules = generateBasicModules(MOCK_BUDGET_PROJECT, MOCK_CONFIGURATION_SNAPSHOT);
    const technicalEstimate = calculateTechnicalEstimate(
      MOCK_BUDGET_PROJECT,
      MOCK_CONFIGURATION_SNAPSHOT,
      modules,
    );
    const subtotal = calculateCommercialSubtotal(
      technicalEstimate,
      MOCK_CONFIGURATION_SNAPSHOT,
    );

    expect(subtotal).toBe(450);
  });

  it('applies configured simple surcharges', () => {
    const surchargeItems = applySimpleSurcharges(
      450,
      MOCK_BUDGET_PROJECT,
      MOCK_CONFIGURATION_SNAPSHOT,
    );

    expect(surchargeItems.length).toBe(1);
    expect(surchargeItems[0].code).toBe('management_contingency_fixed');
    expect(surchargeItems[0].amount).toBe(300);
  });

  it('aggregates hours correctly with multiple modules', () => {
    const project = {
      ...MOCK_BUDGET_PROJECT,
      selectedModuleIds: ['DISCOVERY', 'CORE_BACKEND', 'ADMIN_PANEL'],
    };
    const result = runBudgetBuilderPipeline(project, MOCK_CONFIGURATION_SNAPSHOT);

    expect(result.modules.length).toBe(3);
    expect(result.technicalEstimate.totalHours).toBe(39);
    expect(result.commercialBudget.baseAmount).toBe(702);
  });

  it('does not apply support when it is explicitly disabled', () => {
    const project = {
      ...MOCK_BUDGET_PROJECT,
      supportEnabled: false,
      supportPlanId: null,
    };
    const result = runBudgetBuilderPipeline(project, MOCK_CONFIGURATION_SNAPSHOT);

    expect(result.commercialBudget.appliedSupportRuleId).toBeNull();
    expect(result.commercialBudget.finalMonthlyTotal).toBe(0);
  });

  it('applies manual discounts over the negotiated one-time total', () => {
    const project = {
      ...MOCK_BUDGET_PROJECT,
      manualDiscounts: [
        {
          code: 'manual_project_discount',
          label: 'Manual discount',
          reason: 'Commercial negotiation',
          mode: 'FIXED' as const,
          value: 100,
          cadence: 'one_time' as const,
        },
      ],
    };
    const result = runBudgetBuilderPipeline(project, MOCK_CONFIGURATION_SNAPSHOT);
    const discountItems = applyManualDiscounts(
      750,
      24,
      project,
    );

    expect(discountItems.length).toBe(1);
    expect(discountItems[0].amount).toBe(100);
    expect(result.commercialBudget.discountItems.length).toBe(1);
    expect(result.commercialBudget.finalOneTimeTotal).toBe(650);
  });

  it('applies the technology surcharge when the selected stack is outside the primary catalog', () => {
    const project = {
      ...MOCK_BUDGET_PROJECT,
      selectedSurchargeRuleIds: [],
      desiredStackId: 'outside_primary_stack',
    };
    const result = runBudgetBuilderPipeline(project, MOCK_CONFIGURATION_SNAPSHOT);

    expect(result.commercialBudget.surchargeItems.length).toBe(1);
    expect(result.commercialBudget.surchargeItems[0].code).toBe('outside_stack_surcharge');
    expect(result.commercialBudget.surchargeItems[0].amount).toBe(45);
    expect(result.commercialBudget.finalOneTimeTotal).toBe(495);
  });

  it('handles empty or zero-value inputs without producing invalid totals', () => {
    const configuration = {
      ...MOCK_CONFIGURATION_SNAPSHOT,
      hourlyRate: {
        ...MOCK_CONFIGURATION_SNAPSHOT.hourlyRate,
        base: 0,
      },
      projectTypeDefaults: [],
      minimumBudget: 0,
    };
    const project = {
      ...MOCK_BUDGET_PROJECT,
      projectType: 'unknown_project',
      selectedModuleIds: [],
      selectedSurchargeRuleIds: [],
      supportEnabled: false,
      supportPlanId: null,
      manualDiscounts: [
        {
          code: 'empty-discount',
          label: 'Empty discount',
          reason: 'Zero-value edge case',
          mode: 'PERCENTAGE' as const,
          value: 0,
          cadence: 'one_time' as const,
        },
      ],
    };
    const result = runBudgetBuilderPipeline(project, configuration);

    expect(result.modules.length).toBe(0);
    expect(result.technicalEstimate.totalHours).toBe(0);
    expect(result.commercialBudget.baseAmount).toBe(0);
    expect(result.commercialBudget.finalOneTimeTotal).toBe(0);
    expect(result.commercialBudget.finalMonthlyTotal).toBe(0);
  });

  it('calculates the final one-time and monthly totals', () => {
    const result = runBudgetBuilderPipeline(
      MOCK_BUDGET_PROJECT,
      MOCK_CONFIGURATION_SNAPSHOT,
    );

    expect(result.commercialBudget.finalOneTimeTotal).toBe(750);
    expect(result.commercialBudget.finalMonthlyTotal).toBe(24);
    expect(result.commercialBudget.appliedSupportRuleId).toBe('support-basic');
  });
});
