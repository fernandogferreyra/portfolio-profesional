export type BudgetComplexity = 'LOW' | 'MEDIUM' | 'HIGH';

export type BudgetUrgency = 'STANDARD' | 'PRIORITY' | 'EXPRESS';

export type BudgetPricingMode = 'PROJECT' | 'SAAS';

export type PricingAdjustmentMode = 'FIXED' | 'PERCENTAGE';

export type ExplanationStage = 'INPUT' | 'TECHNICAL' | 'COMMERCIAL' | 'NEGOTIATION';

export type BillingCadence = 'one_time' | 'monthly';

export type CategoryBillingType = 'TIME_BASED' | 'FIXED_AMOUNT' | 'MONTHLY_FIXED';

export type BudgetModuleSelectionMode = 'PROJECT_DEFAULTS' | 'EXPLICIT';

export interface ManualDiscountInput {
  code: string;
  label: string;
  reason: string;
  mode: PricingAdjustmentMode;
  value: number;
  cadence: BillingCadence;
}

export interface BudgetProject {
  id: string;
  name: string;
  clientName: string;
  projectType: string;
  pricingMode: BudgetPricingMode;
  businessGoal: string;
  targetAudience: string;
  desiredStackId: string;
  complexity: BudgetComplexity;
  urgency: BudgetUrgency;
  selectedModuleIds: string[];
  moduleSelectionMode?: BudgetModuleSelectionMode;
  selectedSurchargeRuleIds: string[];
  supportEnabled?: boolean;
  supportPlanId: string | null;
  maintenancePlanId: string | null;
  manualDiscounts?: ManualDiscountInput[];
  activeClients: number | null;
  userScaleTierId: string | null;
  extraMonthlyHours?: number | null;
  notes: string[];
}

export interface EstimateModule {
  id: string;
  category: string;
  name: string;
  description: string;
  quantity: number;
  tier: 'LITE' | 'STANDARD' | 'ADVANCED';
  baseHours: number;
  optimisticHours?: number;
  probableHours?: number;
  pessimisticHours?: number;
  complexityWeight: number;
  moduleMultiplier: number;
  dependencyIds: string[];
  blockingNote?: string | null;
  optional: boolean;
  estimatedHours?: number;
}

export interface HourlyRateConfig {
  base: number;
  categoryOverrides: Record<string, number>;
  supportHourlyRate: number;
  extraHourRate: number;
}

export interface TechnologyRule {
  id: string;
  label: string;
  description: string;
  multiplier: number;
  surchargeRuleId: string | null;
  supportedProjectTypes: string[];
}

export interface CategoryRule {
  id: string;
  label: string;
  billingType: CategoryBillingType;
  rate: number;
  cadence?: 'ONE_TIME' | 'MONTHLY';
}

export interface SurchargeRule {
  id: string;
  code: string;
  label: string;
  reason: string;
  mode: PricingAdjustmentMode;
  value: number;
  appliesTo: BillingCadence;
  stage: 'COMMERCIAL' | 'NEGOTIATION';
  enabledByDefault: boolean;
}

export interface SupportRule {
  id: string;
  label: string;
  cadence: 'monthly';
  includedHours: number;
  hourlyRate: number;
  monthlyAmount?: number;
  enabledByDefault: boolean;
}

export interface MaintenanceRule {
  id: string;
  label: string;
  cadence: 'monthly';
  monthlyAmount: number;
  enabledByDefault: boolean;
}

export interface UserScaleRule {
  id: string;
  label: string;
  minUsers: number;
  maxUsers: number | null;
  mode: PricingAdjustmentMode;
  value: number;
}

export interface ProjectTypeDefaultRule {
  projectType: string;
  label: string;
  description: string;
  defaultModuleIds: string[];
  defaultSurchargeRuleIds: string[];
  defaultSupportRuleId: string | null;
  defaultMaintenanceRuleId: string | null;
}

export interface ConfigurationSnapshot {
  id: string;
  version: string;
  source: 'seed' | 'excel_reference' | 'manual';
  currency: string;
  estimationMethod: 'PERT' | 'FIXED';
  createdAt: string;
  workingHoursPerWeek: number;
  riskBufferHours?: number;
  hourlyRate: HourlyRateConfig;
  commercialMultiplier: number;
  minimumBudget: number;
  roundingRules: {
    technical: 'ROUND_NEAREST_HOUR' | 'NONE';
    commercial: 'ROUND_UP_INTEGER' | 'ROUND_2_DECIMALS' | 'NONE';
  };
  moduleCatalog: EstimateModule[];
  technologyCatalog: TechnologyRule[];
  categoryRules: CategoryRule[];
  surchargeRules: SurchargeRule[];
  supportRules: SupportRule[];
  maintenanceRules: MaintenanceRule[];
  userScaleRules: UserScaleRule[];
  projectTypeDefaults: ProjectTypeDefaultRule[];
  projectMultipliers: Record<string, number>;
  stackMultipliers: Record<string, number>;
  complexityMultipliers: Record<BudgetComplexity, number>;
}

export interface TechnicalEstimate {
  id: string;
  projectId: string;
  configurationSnapshotId: string;
  modules: EstimateModule[];
  totalHours: number;
  totalWeeks: number;
  complexityScore: number;
  riskBufferHours: number;
  coordinationBufferHours: number;
  assumptions: string[];
  exclusions: string[];
  generatedAt: string;
}

export interface SurchargeItem {
  id: string;
  code: string;
  label: string;
  reason: string;
  mode: PricingAdjustmentMode;
  value: number;
  amount: number;
  cadence: BillingCadence;
  stage: 'COMMERCIAL' | 'NEGOTIATION';
  removable: boolean;
}

export interface DiscountItem {
  id: string;
  code: string;
  label: string;
  reason: string;
  mode: PricingAdjustmentMode;
  value: number;
  amount: number;
  cadence: BillingCadence;
  stage: 'COMMERCIAL' | 'NEGOTIATION';
  requiresReason: boolean;
  maxAllowedAmount?: number;
}

export interface PricingExplanationItem {
  id: string;
  stage: ExplanationStage;
  title: string;
  description: string;
  amountDelta: number;
  relatedCodes: string[];
  tone: 'INFO' | 'UP' | 'DOWN';
}

export interface CommercialBudget {
  id: string;
  projectId: string;
  configurationSnapshotId: string;
  technicalEstimateId: string | null;
  currency: string;
  totalHours: number;
  baseAmount: number;
  oneTimeSubtotal: number;
  monthlySubtotal: number;
  surchargeItems: SurchargeItem[];
  discountItems: DiscountItem[];
  finalOneTimeTotal: number;
  finalMonthlyTotal: number;
  appliedSupportRuleId: string | null;
  pricingExplanation: PricingExplanationItem[];
  generatedAt: string;
}

export interface BudgetPreviewModuleView {
  id: string;
  category: string;
  name: string;
  description: string;
  dependencyIds: string[];
  blockingNote?: string | null;
  estimatedHours: number;
}

export interface BudgetPreviewAdjustmentView {
  id: string;
  code: string;
  label: string;
  reason: string;
  cadence: BillingCadence;
  amount: number;
}

export interface BudgetPreviewExplanationView {
  id: string;
  stage: ExplanationStage;
  title: string;
  description: string;
  amountDelta: number;
  tone: 'INFO' | 'UP' | 'DOWN';
}

export interface BudgetBuilderPreviewResult {
  configurationSnapshotId: string;
  previewHash: string;
  modules: BudgetPreviewModuleView[];
  technicalEstimate: {
    totalHours: number;
    totalWeeks: number;
  };
  commercialBudget: {
    currency: string;
    baseAmount: number;
    oneTimeSubtotal: number;
    monthlySubtotal: number;
    surchargeItems: BudgetPreviewAdjustmentView[];
    discountItems: BudgetPreviewAdjustmentView[];
    finalOneTimeTotal: number;
    finalMonthlyTotal: number;
    pricingExplanation: BudgetPreviewExplanationView[];
  };
}

export interface BudgetBuilderConfigView {
  configurationSnapshotId: string;
  version: string;
  source: string;
  currency: string;
  createdAt: string;
  workingHoursPerWeek: number;
  defaultHourlyRate: number;
  supportHourlyRate: number;
  extraHourRate: number;
  riskBufferHours: number;
  projectTypeDefaults: ProjectTypeDefaultRule[];
  modules: BudgetBuilderConfigModule[];
  categories: BudgetBuilderConfigCategory[];
  technologies: BudgetBuilderConfigTechnology[];
  surchargeRules: BudgetBuilderConfigSurchargeRule[];
  supportPlans: BudgetBuilderConfigSupportPlan[];
  maintenancePlans: BudgetBuilderConfigMaintenancePlan[];
  userScaleTiers: BudgetBuilderConfigUserScaleTier[];
  complexityOptions: BudgetComplexity[];
}

export interface BudgetBuilderConfigModule {
  id: string;
  category: string;
  name: string;
  description: string;
  baseHours: number;
  optimisticHours: number;
  probableHours: number;
  pessimisticHours: number;
  dependencyIds: string[];
  blockingNote: string | null;
  optional: boolean;
}

export interface BudgetBuilderConfigCategory {
  id: string;
  label: string;
  billingType: CategoryBillingType;
  rate: number;
  cadence: 'ONE_TIME' | 'MONTHLY';
}

export interface BudgetBuilderConfigTechnology {
  id: string;
  label: string;
  description: string;
  surchargeRuleId: string | null;
  supportedProjectTypes: string[];
}

export interface BudgetBuilderConfigSurchargeRule {
  id: string;
  code: string;
  label: string;
  reason: string;
  mode: PricingAdjustmentMode;
  appliesTo: 'ONE_TIME' | 'MONTHLY';
  value: number;
  enabledByDefault: boolean;
}

export interface BudgetBuilderConfigSupportPlan {
  id: string;
  label: string;
  cadence: 'ONE_TIME' | 'MONTHLY';
  includedHours: number;
  hourlyRate: number;
  monthlyAmount: number;
}

export interface BudgetBuilderConfigMaintenancePlan {
  id: string;
  label: string;
  cadence: 'ONE_TIME' | 'MONTHLY';
  monthlyAmount: number;
}

export interface BudgetBuilderConfigUserScaleTier {
  id: string;
  label: string;
  minUsers: number;
  maxUsers: number | null;
  mode: PricingAdjustmentMode;
  value: number;
}

export interface BudgetBuilderPreviewRequestPayload {
  budgetName: string;
  projectType: string;
  pricingMode: BudgetPricingMode;
  desiredStackId: string;
  complexity: BudgetComplexity;
  urgency: BudgetUrgency;
  selectedModuleIds: string[];
  moduleSelectionMode: BudgetModuleSelectionMode;
  selectedSurchargeRuleIds: string[];
  supportEnabled: boolean;
  supportPlanId: string | null;
  maintenancePlanId: string | null;
  hourlyRateOverride: number | null;
  manualDiscount: {
    label: string;
    reason: string;
    mode: PricingAdjustmentMode;
    value: number;
    cadence: 'ONE_TIME' | 'MONTHLY';
  } | null;
  activeClients: number | null;
  userScaleTierId: string | null;
  extraMonthlyHours: number | null;
  notes: string[];
}

export interface BudgetBuilderSaveRequestPayload {
  input: BudgetBuilderPreviewRequestPayload;
  expectedConfigurationSnapshotId: string;
  expectedPreviewHash: string;
}

export interface BudgetBuilderSaveResponse {
  id: string;
  budgetName: string;
  configurationSnapshotId: string;
  finalOneTimeTotal: number;
  finalMonthlyTotal: number;
  createdAt: string;
}

export interface BudgetBuilderSummary {
  id: string;
  budgetName: string;
  projectType: string;
  pricingMode: BudgetPricingMode;
  desiredStackId: string;
  totalHours: number;
  finalOneTimeTotal: number;
  finalMonthlyTotal: number;
  currency: string;
  createdAt: string;
}

export interface BudgetBuilderDetail extends BudgetBuilderSummary {
  configurationSnapshotId: string;
  previewHash: string;
  requestJson: BudgetBuilderPreviewRequestPayload | null;
  resultJson: BudgetBuilderPreviewResult | null;
}
