import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

import {
  BudgetBuilderConfigCategory,
  BudgetBuilderConfigMaintenancePlan,
  BudgetBuilderConfigModule,
  BudgetBuilderConfigSupportPlan,
  BudgetBuilderConfigTechnology,
  BudgetBuilderConfigUserScaleTier,
  BudgetBuilderConfigView,
  BudgetBuilderDetail,
  BudgetBuilderPreviewRequestPayload,
  BudgetBuilderPreviewResult,
  BudgetBuilderSaveRequestPayload,
  BudgetBuilderSaveResponse,
  BudgetBuilderSummary,
  BudgetComplexity,
  BillingCadence,
  ExplanationStage,
  ProjectTypeDefaultRule,
} from '../models/budget-builder.models';

type ApiResponse<T> = {
  success: boolean;
  message: string;
  data: T;
};

type BudgetPreviewApiResponse = {
  configurationSnapshotId: string;
  previewHash: string;
  currency: string;
  totalHours: number;
  totalWeeks: number;
  baseAmount: number;
  oneTimeSubtotal: number;
  monthlySubtotal: number;
  finalOneTimeTotal: number;
  finalMonthlyTotal: number;
  technicalSummary: {
    totalHours: number;
    totalWeeks: number;
    totalBaseAmount: number;
  };
  areaBreakdown: Array<{
    areaId: string;
    label: string;
    totalHours: number;
    baseAmount: number;
    moduleCount: number;
    shareOfTechnicalTotal: number;
    modules: Array<{
      id: string;
      name: string;
      estimatedHours: number;
      baseAmount: number;
    }>;
  }>;
  monthlyBreakdown: {
    developmentRecovery: number;
    infrastructure: number;
    support: number;
    maintenance: number;
    userScaleAdjustment: number;
    extraHours: number;
    margin: number;
    monthlySubtotal: number;
    finalMonthlyTotal: number;
  } | null;
  modules: Array<{
    id: string;
    category: string;
    name: string;
    description: string;
    dependencyIds: string[];
    blockingNote: string | null;
    estimatedHours: number;
    baseAmount: number;
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

type UiLanguage = 'es' | 'en';

const FALLBACK_PROJECT_TYPES: ProjectTypeDefaultRule[] = [
  {
    projectType: 'standard_project',
    label: 'Proyecto estándar',
    description: 'Proyecto one-shot con implementación inicial y continuidad opcional.',
    defaultModuleIds: ['LOGIN', 'ADMIN_PANEL', 'REPORTS'],
    defaultSurchargeRuleIds: [],
    defaultSupportRuleId: 'support-basic',
    defaultMaintenanceRuleId: 'maintenance-standard',
  },
  {
    projectType: 'saas_product',
    label: 'Producto SaaS',
    description: 'Producto con recuperación mensual, soporte y escalas de usuarios.',
    defaultModuleIds: ['LOGIN', 'ADMIN_PANEL', 'REPORTS', 'PAYMENTS', 'NOTIFICATIONS'],
    defaultSurchargeRuleIds: [],
    defaultSupportRuleId: 'support-basic',
    defaultMaintenanceRuleId: 'maintenance-standard',
  },
];

const FALLBACK_CATEGORIES: BudgetBuilderConfigCategory[] = [
  { id: 'backend', label: 'Backend', billingType: 'TIME_BASED', rate: 20, cadence: 'ONE_TIME' },
  { id: 'frontend', label: 'Frontend', billingType: 'TIME_BASED', rate: 18, cadence: 'ONE_TIME' },
  { id: 'analysis_design', label: 'Diseño', billingType: 'TIME_BASED', rate: 16, cadence: 'ONE_TIME' },
  { id: 'db', label: 'DB', billingType: 'TIME_BASED', rate: 18, cadence: 'ONE_TIME' },
];

const FALLBACK_MODULES: BudgetBuilderConfigModule[] = [
  {
    id: 'LOGIN',
    category: 'backend',
    name: 'Login',
    description: 'Acceso de usuarios, recuperación de contraseña y permisos básicos.',
    baseHours: 10,
    optimisticHours: 6,
    probableHours: 10,
    pessimisticHours: 14,
    dependencyIds: [],
    blockingNote: null,
    optional: false,
  },
  {
    id: 'ADMIN_PANEL',
    category: 'frontend',
    name: 'Panel admin',
    description: 'Gestión de entidades clave, navegación privada y operaciones internas.',
    baseHours: 16,
    optimisticHours: 10,
    probableHours: 16,
    pessimisticHours: 24,
    dependencyIds: ['LOGIN'],
    blockingNote: null,
    optional: false,
  },
  {
    id: 'REPORTS',
    category: 'analysis_design',
    name: 'Reportes',
    description: 'Vistas de seguimiento, métricas y exportes de lectura ejecutiva.',
    baseHours: 14,
    optimisticHours: 8,
    probableHours: 14,
    pessimisticHours: 20,
    dependencyIds: ['ADMIN_PANEL'],
    blockingNote: null,
    optional: false,
  },
  {
    id: 'PAYMENTS',
    category: 'backend',
    name: 'Pagos',
    description: 'Integración de pagos, validaciones y eventos de cobro.',
    baseHours: 18,
    optimisticHours: 12,
    probableHours: 18,
    pessimisticHours: 28,
    dependencyIds: ['LOGIN'],
    blockingNote: null,
    optional: true,
  },
  {
    id: 'NOTIFICATIONS',
    category: 'db',
    name: 'Notificaciones',
    description: 'Alertas internas, email transaccional y eventos automáticos.',
    baseHours: 12,
    optimisticHours: 8,
    probableHours: 12,
    pessimisticHours: 18,
    dependencyIds: ['ADMIN_PANEL'],
    blockingNote: null,
    optional: true,
  },
];

const FALLBACK_TECHNOLOGIES: BudgetBuilderConfigTechnology[] = [
  {
    id: 'default_web_stack',
    label: 'Angular + Spring',
    description: 'Stack principal recomendado para proyectos web y herramientas internas.',
    surchargeRuleId: null,
    supportedProjectTypes: ['standard_project', 'saas_product'],
  },
  {
    id: 'outside_primary_stack',
    label: 'Stack especial',
    description: 'Tecnología fuera del stack principal para escenarios excepcionales.',
    surchargeRuleId: null,
    supportedProjectTypes: ['standard_project', 'saas_product'],
  },
];

const FALLBACK_SUPPORT_PLANS: BudgetBuilderConfigSupportPlan[] = [
  {
    id: 'support-basic',
    label: 'Soporte base',
    cadence: 'MONTHLY',
    includedHours: 2,
    hourlyRate: 18,
    monthlyAmount: 24,
  },
  {
    id: 'support-growth',
    label: 'Soporte extendido',
    cadence: 'MONTHLY',
    includedHours: 6,
    hourlyRate: 18,
    monthlyAmount: 64,
  },
];

const FALLBACK_MAINTENANCE_PLANS: BudgetBuilderConfigMaintenancePlan[] = [
  {
    id: 'maintenance-standard',
    label: 'Mantenimiento estándar',
    cadence: 'MONTHLY',
    monthlyAmount: 36,
  },
  {
    id: 'maintenance-intensive',
    label: 'Mantenimiento intensivo',
    cadence: 'MONTHLY',
    monthlyAmount: 72,
  },
];

const FALLBACK_USER_SCALE_TIERS: BudgetBuilderConfigUserScaleTier[] = [
  { id: 'starter', label: 'Starter', minUsers: 1, maxUsers: 10, mode: 'FIXED', value: 10 },
  { id: 'growth', label: 'Growth', minUsers: 11, maxUsers: 50, mode: 'FIXED', value: 24 },
  { id: 'scale', label: 'Scale', minUsers: 51, maxUsers: null, mode: 'FIXED', value: 48 },
];

function fallbackWhenEmpty<T>(items: T[] | null | undefined, fallback: T[]): T[] {
  return Array.isArray(items) && items.length > 0 ? items : fallback;
}

function normalizeConfiguration(configuration: BudgetBuilderConfigView): BudgetBuilderConfigView {
  const projectTypeDefaults = fallbackWhenEmpty(configuration.projectTypeDefaults, FALLBACK_PROJECT_TYPES);
  const modules = fallbackWhenEmpty(configuration.modules, FALLBACK_MODULES);
  const categories = fallbackWhenEmpty(configuration.categories, FALLBACK_CATEGORIES);
  const technologies = fallbackWhenEmpty(configuration.technologies, FALLBACK_TECHNOLOGIES);
  const supportPlans = fallbackWhenEmpty(configuration.supportPlans, FALLBACK_SUPPORT_PLANS);
  const maintenancePlans = fallbackWhenEmpty(configuration.maintenancePlans, FALLBACK_MAINTENANCE_PLANS);
  const userScaleTiers = fallbackWhenEmpty(configuration.userScaleTiers, FALLBACK_USER_SCALE_TIERS);

  return {
    ...configuration,
    currency: configuration.currency?.trim() || 'ARS',
    complexityOptions: configuration.complexityOptions?.length
      ? configuration.complexityOptions
      : (['LOW', 'MEDIUM', 'HIGH'] as BudgetComplexity[]),
    projectTypeDefaults,
    modules,
    categories,
    technologies,
    supportPlans,
    maintenancePlans,
    userScaleTiers,
  };
}

export interface BudgetBuilderUiFormValue {
  budgetName: string;
  client?: string | null;
  presentationCurrency?: 'ARS' | 'USD';
  projectType: string;
  pricingMode: 'PROJECT' | 'SAAS';
  desiredStackId: string;
  complexity: BudgetComplexity;
  urgency: 'STANDARD' | 'PRIORITY' | 'EXPRESS';
  supportEnabled: boolean;
  supportPlanId: string | null;
  maintenancePlanId: string | null;
  hourlyRate: number;
  manualDiscount: number;
  activeClients: number;
  userScaleTierId: string | null;
  extraMonthlyHours: number;
}

export interface BudgetBuilderUiOption {
  id: string;
  label: string;
  description: string;
}

function sanitizeNonNegativeNumber(value: number | null | undefined): number {
  return typeof value === 'number' && Number.isFinite(value) ? Math.max(value, 0) : 0;
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
      return 'COMMERCIAL';
  }
}

function toExplanationTone(value: string | null | undefined): 'INFO' | 'UP' | 'DOWN' {
  switch (value) {
    case 'UP':
    case 'DOWN':
    case 'INFO':
      return value;
    default:
      return 'INFO';
  }
}

function localizeProjectType(
  projectType: string,
  language: UiLanguage,
  providedLabel?: string | null,
  providedDescription?: string | null,
): BudgetBuilderUiOption {
  const catalog: Record<string, BudgetBuilderUiOption> = {
    standard_project:
      language === 'es'
        ? {
            id: 'standard_project',
            label: 'Proyecto estandar',
            description: 'Entrega one-shot con costo de implementacion y soporte opcional.',
          }
        : {
            id: 'standard_project',
            label: 'Standard project',
            description: 'One-shot delivery with implementation cost and optional support.',
          },
    saas_product:
      language === 'es'
        ? {
            id: 'saas_product',
            label: 'Producto SaaS',
            description: 'Producto con recupero mensual, infraestructura y tier por usuarios.',
          }
        : {
            id: 'saas_product',
            label: 'SaaS product',
            description: 'Product pricing with monthly recovery, infrastructure, and user tiers.',
          },
  };

  if (catalog[projectType]) {
    return catalog[projectType];
  }

  return language === 'es'
    ? {
        id: projectType,
        label: providedLabel?.trim() || projectType.replaceAll('_', ' '),
        description:
          providedDescription?.trim() || 'Tipo de proyecto disponible desde la configuracion activa.',
      }
    : {
        id: projectType,
        label: providedLabel?.trim() || projectType.replaceAll('_', ' '),
        description:
          providedDescription?.trim() || 'Project type available from the active configuration.',
      };
}

function localizeTechnology(
  technologyId: string,
  fallbackLabel: string,
  fallbackDescription: string,
  language: UiLanguage,
): BudgetBuilderUiOption {
  const catalog: Record<string, BudgetBuilderUiOption> = {
    default_web_stack:
      language === 'es'
        ? {
            id: 'default_web_stack',
            label: 'Stack principal',
            description: 'Usa el stack principal sin recargo comercial extra.',
          }
        : {
            id: 'default_web_stack',
            label: 'Primary stack',
            description: 'Uses the primary stack without extra commercial surcharge.',
          },
    outside_primary_stack:
      language === 'es'
        ? {
            id: 'outside_primary_stack',
            label: 'Tecnologia fuera de stack',
            description: 'Activa recargo por stack fuera del catalogo principal.',
          }
        : {
            id: 'outside_primary_stack',
            label: 'Outside stack technology',
            description: 'Activates the surcharge for technology outside the main catalog.',
          },
  };

  return (
    catalog[technologyId] ??
    (language === 'es'
      ? {
          id: technologyId,
          label: fallbackLabel,
          description: fallbackDescription?.trim() || 'Tecnologia disponible en la configuracion activa.',
        }
      : {
          id: technologyId,
          label: fallbackLabel,
          description: fallbackDescription?.trim() || 'Technology available in the active configuration.',
        })
  );
}

@Injectable({
  providedIn: 'root',
})
export class BudgetBuilderUiFacade {
  private readonly http = inject(HttpClient);

  buildFallbackConfiguration(): BudgetBuilderConfigView {
    return normalizeConfiguration({
      configurationSnapshotId: 'budget-builder-fallback-v1',
      version: 'fallback-v1',
      source: 'fallback',
      currency: 'ARS',
      createdAt: new Date().toISOString(),
      workingHoursPerWeek: 32,
      defaultHourlyRate: 20,
      supportHourlyRate: 18,
      extraHourRate: 24,
      riskBufferHours: 6,
      projectTypeDefaults: [],
      modules: [],
      categories: [],
      technologies: [],
      surchargeRules: [],
      supportPlans: [],
      maintenancePlans: [],
      userScaleTiers: [],
      complexityOptions: [],
    });
  }

  getActiveConfiguration(): Observable<BudgetBuilderConfigView> {
    return this.http
      .get<ApiResponse<BudgetBuilderConfigView>>('/api/admin/budget-builder/configuration/active')
      .pipe(map((response) => normalizeConfiguration(response.data)));
  }

  previewBudget(payload: BudgetBuilderPreviewRequestPayload): Observable<BudgetBuilderPreviewResult> {
    return this.http
      .post<ApiResponse<BudgetPreviewApiResponse>>('/api/admin/budget-builder/preview', payload)
      .pipe(map((response) => this.toPreviewResult(response.data)));
  }

  saveBudget(payload: BudgetBuilderSaveRequestPayload): Observable<BudgetBuilderSaveResponse> {
    return this.http
      .post<ApiResponse<BudgetBuilderSaveResponse>>('/api/admin/budget-builder', payload)
      .pipe(map((response) => response.data));
  }

  getBudgets(): Observable<BudgetBuilderSummary[]> {
    return this.http
      .get<ApiResponse<BudgetBuilderSummary[]>>('/api/admin/budget-builder')
      .pipe(map((response) => response.data));
  }

  getBudgetById(id: string): Observable<BudgetBuilderDetail> {
    return this.http
      .get<ApiResponse<BudgetBuilderDetail>>(`/api/admin/budget-builder/${id}`)
      .pipe(map((response) => response.data));
  }

  createInitialFormValue(configuration: BudgetBuilderConfigView): BudgetBuilderUiFormValue {
    const defaultProjectType = configuration.projectTypeDefaults[0]?.projectType ?? '';
    const defaultSupportRuleId =
      configuration.projectTypeDefaults[0]?.defaultSupportRuleId ??
      configuration.supportPlans[0]?.id ??
      null;
    const defaultMaintenanceRuleId = configuration.projectTypeDefaults[0]?.defaultMaintenanceRuleId ?? null;
    const defaultTechnologyId = configuration.technologies[0]?.id ?? '';
    const defaultUserScaleTierId = configuration.userScaleTiers[0]?.id ?? null;

    return {
      budgetName: 'Operations MVP',
      client: 'ACME Corp',
      projectType: defaultProjectType,
      pricingMode: 'PROJECT',
      desiredStackId: defaultTechnologyId,
      complexity: configuration.complexityOptions.includes('MEDIUM')
        ? 'MEDIUM'
        : (configuration.complexityOptions[0] ?? 'MEDIUM'),
      urgency: 'STANDARD',
      supportEnabled: true,
      supportPlanId: defaultSupportRuleId,
      maintenancePlanId: defaultMaintenanceRuleId,
      hourlyRate: sanitizeNonNegativeNumber(configuration.defaultHourlyRate),
      manualDiscount: 0,
      activeClients: 10,
      userScaleTierId: defaultUserScaleTierId,
      extraMonthlyHours: 0,
    };
  }

  getProjectTypeOptions(configuration: BudgetBuilderConfigView, language: UiLanguage): BudgetBuilderUiOption[] {
    return configuration.projectTypeDefaults.map((rule) =>
      localizeProjectType(rule.projectType, language, rule.label, rule.description),
    );
  }

  getTechnologyOptions(configuration: BudgetBuilderConfigView, language: UiLanguage): BudgetBuilderUiOption[] {
    return configuration.technologies.map((technology) =>
      localizeTechnology(technology.id, technology.label, technology.description, language),
    );
  }

  resolveProjectDefaults(
    configuration: BudgetBuilderConfigView,
    projectType: string,
  ): ProjectTypeDefaultRule | null {
    return configuration.projectTypeDefaults.find((rule) => rule.projectType === projectType) ?? null;
  }

  private toPreviewResult(response: BudgetPreviewApiResponse): BudgetBuilderPreviewResult {
    return {
      configurationSnapshotId: response.configurationSnapshotId,
      previewHash: response.previewHash,
      technicalSummary: {
        totalHours: sanitizeNonNegativeNumber(response.technicalSummary?.totalHours),
        totalWeeks: sanitizeNonNegativeNumber(response.technicalSummary?.totalWeeks),
        totalBaseAmount: sanitizeNonNegativeNumber(response.technicalSummary?.totalBaseAmount),
      },
      areaBreakdown: (response.areaBreakdown ?? []).map((area) => ({
        areaId: area.areaId,
        label: area.label,
        totalHours: sanitizeNonNegativeNumber(area.totalHours),
        baseAmount: sanitizeNonNegativeNumber(area.baseAmount),
        moduleCount: sanitizeNonNegativeNumber(area.moduleCount),
        shareOfTechnicalTotal: Number.isFinite(area.shareOfTechnicalTotal) ? area.shareOfTechnicalTotal : 0,
        modules: area.modules.map((module) => ({
          id: module.id,
          name: module.name,
          estimatedHours: sanitizeNonNegativeNumber(module.estimatedHours),
          baseAmount: sanitizeNonNegativeNumber(module.baseAmount),
        })),
      })),
      monthlyBreakdown: response.monthlyBreakdown
        ? {
            developmentRecovery: sanitizeNonNegativeNumber(response.monthlyBreakdown.developmentRecovery),
            infrastructure: sanitizeNonNegativeNumber(response.monthlyBreakdown.infrastructure),
            support: sanitizeNonNegativeNumber(response.monthlyBreakdown.support),
            maintenance: sanitizeNonNegativeNumber(response.monthlyBreakdown.maintenance),
            userScaleAdjustment: sanitizeNonNegativeNumber(response.monthlyBreakdown.userScaleAdjustment),
            extraHours: sanitizeNonNegativeNumber(response.monthlyBreakdown.extraHours),
            margin: sanitizeNonNegativeNumber(response.monthlyBreakdown.margin),
            monthlySubtotal: sanitizeNonNegativeNumber(response.monthlyBreakdown.monthlySubtotal),
            finalMonthlyTotal: sanitizeNonNegativeNumber(response.monthlyBreakdown.finalMonthlyTotal),
          }
        : null,
      modules: response.modules.map((module) => ({
        id: module.id,
        category: module.category,
        name: module.name,
        description: module.description,
        dependencyIds: [...module.dependencyIds],
        blockingNote: module.blockingNote,
        estimatedHours: sanitizeNonNegativeNumber(module.estimatedHours),
        baseAmount: sanitizeNonNegativeNumber(module.baseAmount),
      })),
      technicalEstimate: {
        totalHours: sanitizeNonNegativeNumber(response.totalHours),
        totalWeeks: sanitizeNonNegativeNumber(response.totalWeeks),
      },
      commercialBudget: {
        currency: response.currency,
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
}
