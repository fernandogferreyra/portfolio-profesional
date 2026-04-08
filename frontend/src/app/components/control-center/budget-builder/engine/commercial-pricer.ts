import {
  BudgetProject,
  CommercialBudget,
  ConfigurationSnapshot,
  DiscountItem,
  ManualDiscountInput,
  PricingExplanationItem,
  SurchargeItem,
  SurchargeRule,
  SupportRule,
  TechnologyRule,
  TechnicalEstimate,
} from '../models/budget-builder.models';
import { clampMinimum, roundCommercialValue, roundCurrency } from './budget-builder.utils';

function resolveTechnologyRule(
  project: BudgetProject,
  configuration: ConfigurationSnapshot,
): TechnologyRule | null {
  return configuration.technologyCatalog.find((rule) => rule.id === project.desiredStackId) ?? null;
}

function resolveTechnologySurchargeRuleIds(
  project: BudgetProject,
  configuration: ConfigurationSnapshot,
): string[] {
  const technologyRule = resolveTechnologyRule(project, configuration);

  if (!technologyRule?.surchargeRuleId) {
    return [];
  }

  if (
    technologyRule.supportedProjectTypes.length > 0 &&
    !technologyRule.supportedProjectTypes.includes(project.projectType)
  ) {
    return [];
  }

  return [technologyRule.surchargeRuleId];
}

function resolveActiveSurchargeRules(
  project: BudgetProject,
  configuration: ConfigurationSnapshot,
): SurchargeRule[] {
  const selectedRuleIds = project.selectedSurchargeRuleIds;
  const technologyRuleIds = resolveTechnologySurchargeRuleIds(project, configuration);
  const activeRuleIds = [...new Set([...selectedRuleIds, ...technologyRuleIds])];

  return activeRuleIds
    .map((ruleId) => configuration.surchargeRules.find((rule) => rule.id === ruleId) ?? null)
    .filter((rule): rule is SurchargeRule => Boolean(rule))
    .filter((rule) => rule.appliesTo === 'one_time');
}

function resolveSupportRule(
  project: BudgetProject,
  configuration: ConfigurationSnapshot,
): SupportRule | null {
  if (project.supportEnabled === false) {
    return null;
  }

  const projectDefaults = configuration.projectTypeDefaults.find(
    (rule) => rule.projectType === project.projectType,
  );
  const supportRuleId = project.supportPlanId ?? projectDefaults?.defaultSupportRuleId ?? null;

  if (!supportRuleId) {
    return null;
  }

  return configuration.supportRules.find((rule) => rule.id === supportRuleId) ?? null;
}

function buildPricingExplanation(
  technicalEstimate: TechnicalEstimate,
  subtotal: number,
  surchargeItems: SurchargeItem[],
  discountItems: DiscountItem[],
  supportRule: SupportRule | null,
  supportAmount: number,
): PricingExplanationItem[] {
  const explanation: PricingExplanationItem[] = [
    {
      id: `${technicalEstimate.id}-hours`,
      stage: 'TECHNICAL',
      title: 'Technical effort',
      description: `Base estimate generated from ${technicalEstimate.modules.length} modules.`,
      amountDelta: technicalEstimate.totalHours,
      relatedCodes: technicalEstimate.modules.map((module) => module.id),
      tone: 'INFO',
    },
    {
      id: `${technicalEstimate.id}-subtotal`,
      stage: 'COMMERCIAL',
      title: 'Commercial subtotal',
      description: 'Subtotal based on total hours multiplied by the configured hourly rate.',
      amountDelta: subtotal,
      relatedCodes: ['hourly-rate-base'],
      tone: 'INFO',
    },
  ];

  for (const surchargeItem of surchargeItems) {
    explanation.push({
      id: `${technicalEstimate.id}-${surchargeItem.code}`,
      stage: surchargeItem.stage,
      title: surchargeItem.label,
      description: surchargeItem.reason,
      amountDelta: surchargeItem.amount,
      relatedCodes: [surchargeItem.code],
      tone: 'UP',
    });
  }

  for (const discountItem of discountItems) {
    explanation.push({
      id: `${technicalEstimate.id}-${discountItem.code}`,
      stage: discountItem.stage,
      title: discountItem.label,
      description: discountItem.reason,
      amountDelta: discountItem.amount,
      relatedCodes: [discountItem.code],
      tone: 'DOWN',
    });
  }

  if (supportRule && supportAmount > 0) {
    explanation.push({
      id: `${technicalEstimate.id}-${supportRule.id}`,
      stage: 'COMMERCIAL',
      title: supportRule.label,
      description: `Basic monthly support with ${supportRule.includedHours} included hours.`,
      amountDelta: supportAmount,
      relatedCodes: [supportRule.id],
      tone: 'INFO',
    });
  }

  return explanation;
}

export function calculateCommercialSubtotal(
  technicalEstimate: TechnicalEstimate,
  configuration: ConfigurationSnapshot,
): number {
  const hourlyRate = Number.isFinite(configuration.hourlyRate.base)
    ? Math.max(configuration.hourlyRate.base, 0)
    : 0;

  return roundCurrency(technicalEstimate.totalHours * hourlyRate);
}

export function applySimpleSurcharges(
  subtotal: number,
  project: BudgetProject,
  configuration: ConfigurationSnapshot,
): SurchargeItem[] {
  const activeRules = resolveActiveSurchargeRules(project, configuration);

  return activeRules.map((rule) => ({
    id: `${project.id}-${rule.id}`,
    code: rule.code,
    label: rule.label,
    reason: rule.reason,
    mode: rule.mode,
    value: rule.value,
    amount:
      rule.mode === 'FIXED' ? roundCurrency(rule.value) : roundCurrency(subtotal * rule.value),
    cadence: rule.appliesTo,
    stage: rule.stage,
    removable: true,
  }));
}

function buildDiscountItem(
  projectId: string,
  discount: ManualDiscountInput,
  baseAmount: number,
): DiscountItem {
  const amount =
    discount.mode === 'FIXED'
      ? roundCurrency(Math.max(discount.value, 0))
      : roundCurrency(baseAmount * Math.max(discount.value, 0));

  return {
    id: `${projectId}-${discount.code}`,
    code: discount.code,
    label: discount.label,
    reason: discount.reason,
    mode: discount.mode,
    value: discount.value,
    amount,
    cadence: discount.cadence,
    stage: 'NEGOTIATION',
    requiresReason: true,
  };
}

export function applyManualDiscounts(
  oneTimeBaseAmount: number,
  monthlyBaseAmount: number,
  project: BudgetProject,
): DiscountItem[] {
  const discounts = project.manualDiscounts ?? [];

  return discounts.map((discount) =>
    buildDiscountItem(
      project.id,
      discount,
      discount.cadence === 'monthly' ? monthlyBaseAmount : oneTimeBaseAmount,
    ),
  );
}

export function applyBasicSupport(
  project: BudgetProject,
  configuration: ConfigurationSnapshot,
): { supportRule: SupportRule | null; monthlyAmount: number } {
  const supportRule = resolveSupportRule(project, configuration);

  if (!supportRule) {
    return { supportRule: null, monthlyAmount: 0 };
  }

  const supportAmount =
    typeof supportRule.monthlyAmount === 'number'
      ? supportRule.monthlyAmount
      : supportRule.includedHours * supportRule.hourlyRate;

  return {
    supportRule,
    monthlyAmount: roundCommercialValue(
      supportAmount,
      configuration.roundingRules.commercial,
    ),
  };
}

export function buildCommercialBudget(
  project: BudgetProject,
  configuration: ConfigurationSnapshot,
  technicalEstimate: TechnicalEstimate,
): CommercialBudget {
  const subtotal = calculateCommercialSubtotal(technicalEstimate, configuration);
  const surchargeItems = applySimpleSurcharges(subtotal, project, configuration);
  const surchargeTotal = surchargeItems.reduce((sum, item) => sum + item.amount, 0);
  const { supportRule, monthlyAmount } = applyBasicSupport(project, configuration);
  const discountItems = applyManualDiscounts(
    subtotal + surchargeTotal,
    monthlyAmount,
    project,
  );
  const oneTimeDiscountTotal = discountItems
    .filter((item) => item.cadence === 'one_time')
    .reduce((sum, item) => sum + item.amount, 0);
  const monthlyDiscountTotal = discountItems
    .filter((item) => item.cadence === 'monthly')
    .reduce((sum, item) => sum + item.amount, 0);
  const oneTimeTotal = roundCommercialValue(
    clampMinimum(subtotal + surchargeTotal - oneTimeDiscountTotal, configuration.minimumBudget),
    configuration.roundingRules.commercial,
  );
  const finalMonthlyTotal = roundCommercialValue(
    Math.max(monthlyAmount - monthlyDiscountTotal, 0),
    configuration.roundingRules.commercial,
  );
  const pricingExplanation = buildPricingExplanation(
    technicalEstimate,
    subtotal,
    surchargeItems,
    discountItems,
    supportRule,
    monthlyAmount,
  );

  return {
    id: `${project.id}-commercial-budget`,
    projectId: project.id,
    configurationSnapshotId: configuration.id,
    technicalEstimateId: technicalEstimate.id,
    currency: configuration.currency,
    totalHours: technicalEstimate.totalHours,
    baseAmount: subtotal,
    oneTimeSubtotal: subtotal,
    monthlySubtotal: monthlyAmount,
    surchargeItems,
    discountItems,
    finalOneTimeTotal: oneTimeTotal,
    finalMonthlyTotal: finalMonthlyTotal,
    appliedSupportRuleId: supportRule?.id ?? null,
    pricingExplanation,
    generatedAt: configuration.createdAt,
  };
}
