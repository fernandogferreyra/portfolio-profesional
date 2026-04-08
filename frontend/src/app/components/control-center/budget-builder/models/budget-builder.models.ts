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
  complexityWeight: number;
  moduleMultiplier: number;
  dependencyIds: string[];
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
  multiplier: number;
  surchargeRuleId: string | null;
  supportedProjectTypes: string[];
}

export interface CategoryRule {
  id: string;
  label: string;
  billingType: CategoryBillingType;
  rate: number;
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
