import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

import {
  BillingCadence,
  BudgetBuilderPreviewResult,
  BudgetComplexity,
  BudgetPricingMode,
  BudgetUrgency,
  ExplanationStage,
  ProjectTypeDefaultRule,
} from '../models/budget-builder.models';
import {
  MOCK_BUDGET_PROJECT,
  MOCK_CONFIGURATION_SNAPSHOT,
} from '../mocks/budget-builder.mock-data';

type UiLanguage = 'es' | 'en';

type BudgetModuleSelectionMode = 'EXPLICIT' | 'PROJECT_DEFAULTS';

type PricingAdjustmentMode = 'FIXED' | 'PERCENTAGE';

type ApiResponse<T> = {
  success: boolean;
  message: string;
  data: T;
};

type BudgetPreviewApiRequest = {
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
  hourlyRateOverride: number;
  manualDiscount: {
    label: string;
    reason: string;
    mode: PricingAdjustmentMode;
    value: number;
    cadence: 'ONE_TIME' | 'MONTHLY';
  } | null;
  activeClients: number | null;
  userScaleTierId: string | null;
  notes: string[];
};

type BudgetPreviewApiResponse = {
  configurationSnapshotId: string;
  previewHash: string;
  totalHours: number;
  totalWeeks: number;
  baseAmount: number;
  oneTimeSubtotal: number;
  monthlySubtotal: number;
  finalOneTimeTotal: number;
  finalMonthlyTotal: number;
  modules: Array<{
    id: string;
    category: string;
    name: string;
    description: string;
    estimatedHours: number;
  }>;
  surcharges: Array<{
    code: string;
    label: string;
    reason: string;
    cadence: string;
    amount: number;
  }>;
  discounts: Array<{
    code: string;
    label: string;
    reason: string;
    cadence: string;
    amount: number;
  }>;
  explanation: Array<{
    stage: string;
    title: string;
    description: string;
    amountDelta: number;
    tone: string;
  }>;
};

const DISCOVERY_MODULE_ID = 'DISCOVERY';
const DEFAULT_PRICING_MODE: BudgetPricingMode = 'PROJECT';
const DEFAULT_COMPLEXITY: BudgetComplexity = 'MEDIUM';
const DEFAULT_URGENCY: BudgetUrgency = 'STANDARD';
const DEFAULT_EXPLANATION_STAGE: ExplanationStage = 'COMMERCIAL';
const DEFAULT_EXPLANATION_TONE: 'INFO' | 'UP' | 'DOWN' = 'INFO';

const MODULE_TOGGLE_IDS = {
  includeFrontend: 'FRONTEND_APP',
  includeBackend: 'CORE_BACKEND',
  includeDatabase: 'DATABASE_LAYER',
} as const;

export interface BudgetBuilderUiOption {
  id: string;
  label: string;
  description: string;
}

export interface BudgetBuilderUiFormValue {
  budgetName: string;
  projectType: string;
  includeFrontend: boolean;
  includeBackend: boolean;
  includeDatabase: boolean;
  hourlyRate: number;
  supportEnabled: boolean;
  manualDiscount: number;
  desiredStackId: string;
}

function sanitizeNonNegativeNumber(value: number): number {
  return Number.isFinite(value) ? Math.max(value, 0) : 0;
}

function toCadence(value: string | null | undefined): BillingCadence {
  return value === 'MONTHLY' ? 'monthly' : 'one_time';
}

function toExplanationStage(value: string | null | undefined): ExplanationStage {
  switch (value) {
    case 'INPUT':
    case 'TECHNICAL':
    case 'COMMERCIAL':
    case 'NEGOTIATION':
      return value;
    default:
      return DEFAULT_EXPLANATION_STAGE;
  }
}

function toExplanationTone(value: string | null | undefined): 'INFO' | 'UP' | 'DOWN' {
  switch (value) {
    case 'UP':
    case 'DOWN':
    case 'INFO':
      return value;
    default:
      return DEFAULT_EXPLANATION_TONE;
  }
}

function localizeProjectType(projectType: string, language: UiLanguage): BudgetBuilderUiOption {
  const catalog: Record<string, BudgetBuilderUiOption> = {
    standard_project:
      language === 'es'
        ? {
            id: 'standard_project',
            label: 'Proyecto estandar',
            description: 'Base comercial general para proyectos a medida.',
          }
        : {
            id: 'standard_project',
            label: 'Standard project',
            description: 'General commercial baseline for custom delivery projects.',
          },
  };

  return (
    catalog[projectType] ??
    (language === 'es'
      ? {
          id: projectType,
          label: projectType.replaceAll('_', ' '),
          description: 'Tipo de proyecto configurable desde el snapshot activo.',
        }
      : {
          id: projectType,
          label: projectType.replaceAll('_', ' '),
          description: 'Project type configured from the active snapshot.',
        })
  );
}

function localizeTechnology(
  technologyId: string,
  fallbackLabel: string,
  language: UiLanguage,
): BudgetBuilderUiOption {
  const catalog: Record<string, BudgetBuilderUiOption> = {
    default_web_stack:
      language === 'es'
        ? {
            id: 'default_web_stack',
            label: 'Stack principal',
            description: 'Usa el stack principal sin recargo adicional.',
          }
        : {
            id: 'default_web_stack',
            label: 'Primary stack',
            description: 'Uses the primary stack without extra surcharge.',
          },
    outside_primary_stack:
      language === 'es'
        ? {
            id: 'outside_primary_stack',
            label: 'Tecnologia fuera de stack',
            description: 'Aplica recargo comercial por stack fuera del catalogo principal.',
          }
        : {
            id: 'outside_primary_stack',
            label: 'Outside stack technology',
            description: 'Applies a commercial surcharge for a stack outside the main catalog.',
          },
  };

  return (
    catalog[technologyId] ??
    (language === 'es'
      ? {
          id: technologyId,
          label: fallbackLabel,
          description: 'Tecnologia disponible en el snapshot activo.',
        }
      : {
          id: technologyId,
          label: fallbackLabel,
          description: 'Technology available in the active snapshot.',
        })
  );
}

@Injectable({
  providedIn: 'root',
})
export class BudgetBuilderUiFacade {
  private readonly http = inject(HttpClient);

  readonly currency = MOCK_CONFIGURATION_SNAPSHOT.currency;

  createInitialFormValue(): BudgetBuilderUiFormValue {
    return {
      budgetName: MOCK_BUDGET_PROJECT.name,
      projectType: MOCK_BUDGET_PROJECT.projectType,
      includeFrontend: false,
      includeBackend: true,
      includeDatabase: false,
      hourlyRate: MOCK_CONFIGURATION_SNAPSHOT.hourlyRate.base,
      supportEnabled: MOCK_BUDGET_PROJECT.supportEnabled !== false,
      manualDiscount: 0,
      desiredStackId: MOCK_BUDGET_PROJECT.desiredStackId,
    };
  }

  getProjectTypeOptions(language: UiLanguage): BudgetBuilderUiOption[] {
    const projectTypes = MOCK_CONFIGURATION_SNAPSHOT.projectTypeDefaults.map((rule) => rule.projectType);

    return [...new Set(projectTypes)].map((projectType) =>
      localizeProjectType(projectType, language),
    );
  }

  getTechnologyOptions(language: UiLanguage): BudgetBuilderUiOption[] {
    return MOCK_CONFIGURATION_SNAPSHOT.technologyCatalog.map((technology) =>
      localizeTechnology(technology.id, technology.label, language),
    );
  }

  calculateBudget(formValue: BudgetBuilderUiFormValue): Observable<BudgetBuilderPreviewResult> {
    const request = this.buildRequest(formValue);

    return this.http
      .post<ApiResponse<BudgetPreviewApiResponse>>('/api/admin/budget-builder/preview', request)
      .pipe(map((response) => this.toPreviewResult(response.data)));
  }

  private buildRequest(formValue: BudgetBuilderUiFormValue): BudgetPreviewApiRequest {
    const selectedModuleIds = this.resolveSelectedModuleIds(formValue);
    const projectDefaults = this.resolveProjectDefaults(formValue.projectType);
    const hasSelectedWork = selectedModuleIds.length > 0;
    const manualDiscount = sanitizeNonNegativeNumber(formValue.manualDiscount);

    return {
      budgetName: formValue.budgetName.trim() || 'Budget Builder MVP',
      projectType: formValue.projectType,
      pricingMode: DEFAULT_PRICING_MODE,
      desiredStackId: formValue.desiredStackId,
      complexity: DEFAULT_COMPLEXITY,
      urgency: DEFAULT_URGENCY,
      selectedModuleIds,
      moduleSelectionMode: 'EXPLICIT',
      selectedSurchargeRuleIds: hasSelectedWork
        ? [...(projectDefaults?.defaultSurchargeRuleIds ?? [])]
        : [],
      supportEnabled: hasSelectedWork ? formValue.supportEnabled : false,
      supportPlanId:
        hasSelectedWork && formValue.supportEnabled
          ? projectDefaults?.defaultSupportRuleId ?? null
          : null,
      maintenancePlanId: null,
      hourlyRateOverride: sanitizeNonNegativeNumber(formValue.hourlyRate),
      manualDiscount:
        manualDiscount > 0
          ? {
              label: 'Manual discount',
              reason: 'UI negotiation adjustment',
              mode: 'FIXED',
              value: manualDiscount,
              cadence: 'ONE_TIME',
            }
          : null,
      activeClients: null,
      userScaleTierId: null,
      notes: [],
    };
  }

  private toPreviewResult(response: BudgetPreviewApiResponse): BudgetBuilderPreviewResult {
    return {
      configurationSnapshotId: response.configurationSnapshotId,
      previewHash: response.previewHash,
      modules: response.modules.map((module) => ({
        id: module.id,
        category: module.category,
        name: module.name,
        description: module.description,
        estimatedHours: sanitizeNonNegativeNumber(module.estimatedHours),
      })),
      technicalEstimate: {
        totalHours: sanitizeNonNegativeNumber(response.totalHours),
        totalWeeks: sanitizeNonNegativeNumber(response.totalWeeks),
      },
      commercialBudget: {
        currency: this.currency,
        baseAmount: sanitizeNonNegativeNumber(response.baseAmount),
        oneTimeSubtotal: sanitizeNonNegativeNumber(response.oneTimeSubtotal),
        monthlySubtotal: sanitizeNonNegativeNumber(response.monthlySubtotal),
        surchargeItems: response.surcharges.map((item, index) => ({
          id: `surcharge-${index}-${item.code}`,
          code: item.code,
          label: item.label,
          reason: item.reason,
          cadence: toCadence(item.cadence),
          amount: sanitizeNonNegativeNumber(item.amount),
        })),
        discountItems: response.discounts.map((item, index) => ({
          id: `discount-${index}-${item.code}`,
          code: item.code,
          label: item.label,
          reason: item.reason,
          cadence: toCadence(item.cadence),
          amount: sanitizeNonNegativeNumber(item.amount),
        })),
        finalOneTimeTotal: sanitizeNonNegativeNumber(response.finalOneTimeTotal),
        finalMonthlyTotal: sanitizeNonNegativeNumber(response.finalMonthlyTotal),
        pricingExplanation: response.explanation.map((item, index) => ({
          id: `explanation-${index}`,
          stage: toExplanationStage(item.stage),
          title: item.title,
          description: item.description,
          amountDelta: Number.isFinite(item.amountDelta) ? item.amountDelta : 0,
          tone: toExplanationTone(item.tone),
        })),
      },
    };
  }

  private resolveSelectedModuleIds(formValue: BudgetBuilderUiFormValue): string[] {
    const deliveryModules = Object.entries(MODULE_TOGGLE_IDS)
      .filter(([controlName]) => formValue[controlName as keyof typeof MODULE_TOGGLE_IDS])
      .map(([, moduleId]) => moduleId);

    if (deliveryModules.length === 0) {
      return [];
    }

    return [DISCOVERY_MODULE_ID, ...deliveryModules];
  }

  private resolveProjectDefaults(projectType: string): ProjectTypeDefaultRule | null {
    return (
      MOCK_CONFIGURATION_SNAPSHOT.projectTypeDefaults.find(
        (rule) => rule.projectType === projectType,
      ) ?? null
    );
  }
}
