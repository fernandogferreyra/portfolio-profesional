import { HttpErrorResponse } from '@angular/common/http';
import { Component, DestroyRef, OnInit, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder } from '@angular/forms';
import { debounceTime, finalize, merge } from 'rxjs';

import { LanguageService } from '../../services/language.service';
import {
  BudgetBuilderConfigModule,
  BudgetBuilderConfigMaintenancePlan,
  BudgetBuilderConfigSupportPlan,
  BudgetBuilderConfigSurchargeRule,
  BudgetBuilderConfigUserScaleTier,
  BudgetBuilderConfigView,
  BudgetBuilderDetail,
  BudgetBuilderPreviewRequestPayload,
  BudgetBuilderPreviewResult,
  BudgetBuilderSaveRequestPayload,
  BudgetBuilderSummary,
  BudgetComplexity,
  BudgetModuleSelectionMode,
  BudgetPricingMode,
  BudgetUrgency,
} from '../control-center/budget-builder/models/budget-builder.models';
import {
  BudgetBuilderUiFacade,
  BudgetBuilderUiFormValue,
} from '../control-center/budget-builder/services/budget-builder-ui.facade';

type ChoiceCard = {
  id: string;
  title: string;
  description: string;
  impact: string;
  selected: boolean;
};

type BudgetBuilderStepId = 'scenario' | 'pricing' | 'continuity' | 'scope';

function safeNumber(value: number | null | undefined): number {
  return typeof value === 'number' && Number.isFinite(value) ? value : 0;
}

@Component({
  selector: 'app-control-center-budget-builder',
  standalone: false,
  templateUrl: './control-center-budget-builder.component.html',
  styleUrl: './control-center-budget-builder.component.scss',
})
export class ControlCenterBudgetBuilderComponent implements OnInit {
  private readonly destroyRef = inject(DestroyRef);
  private readonly formBuilder = inject(FormBuilder);
  private readonly languageService = inject(LanguageService);
  private readonly budgetBuilderUiFacade = inject(BudgetBuilderUiFacade);

  private previewRequestVersion = 0;
  private lastPreviewSignature: string | null = null;

  readonly currentLanguage = this.languageService.language;
  readonly budgetForm = this.formBuilder.nonNullable.group({
    clientName: this.formBuilder.nonNullable.control(''),
    companyName: this.formBuilder.nonNullable.control(''),
    budgetName: this.formBuilder.nonNullable.control(''),
    projectType: this.formBuilder.nonNullable.control(''),
    pricingMode: this.formBuilder.nonNullable.control<BudgetPricingMode>('PROJECT'),
    desiredStackId: this.formBuilder.nonNullable.control(''),
    complexity: this.formBuilder.nonNullable.control<BudgetComplexity>('MEDIUM'),
    urgency: this.formBuilder.nonNullable.control<BudgetUrgency>('STANDARD'),
    supportEnabled: this.formBuilder.nonNullable.control(true),
    supportPlanId: this.formBuilder.control<string | null>(null),
    maintenancePlanId: this.formBuilder.control<string | null>(null),
    hourlyRate: this.formBuilder.nonNullable.control(0),
    manualDiscount: this.formBuilder.nonNullable.control(0),
    activeClients: this.formBuilder.nonNullable.control(10),
    userScaleTierId: this.formBuilder.control<string | null>(null),
    extraMonthlyHours: this.formBuilder.nonNullable.control(0),
  });
  readonly moduleSelection = this.formBuilder.record({});
  readonly extraSelection = this.formBuilder.record({});

  readonly configuration = signal<BudgetBuilderConfigView | null>(null);
  readonly loadingConfiguration = signal(true);
  readonly calculating = signal(false);
  readonly saving = signal(false);
  readonly loadingHistory = signal(false);
  readonly loadingHistoryDetail = signal(false);
  readonly formError = signal<string | null>(null);
  readonly previewHint = signal<string | null>(null);
  readonly saveFeedback = signal<string | null>(null);
  readonly historyError = signal<string | null>(null);
  readonly historyDetailError = signal<string | null>(null);
  readonly previewPayload = signal<BudgetBuilderPreviewRequestPayload | null>(null);
  readonly calculationResult = signal<BudgetBuilderPreviewResult | null>(null);
  readonly previewSaved = signal(false);
  readonly history = signal<BudgetBuilderSummary[]>([]);
  readonly selectedHistoryId = signal<string | null>(null);
  readonly selectedHistoryDetail = signal<BudgetBuilderDetail | null>(null);
  readonly currentStep = signal<BudgetBuilderStepId>('scenario');

  readonly content = computed(() =>
    this.currentLanguage() === 'es'
        ? {
          eyebrow: 'Presupuesto',
          title: 'Cotizador privado',
          lead:
            'Completa cliente, requerimientos y arquitectura para cotizar sin salir del mismo flujo.',
          note:
            'La estimacion tecnica queda integrada como calculadora auxiliar. El backend sigue siendo la fuente oficial.',
          configurationLoading: 'Cargando configuracion activa...',
          liveSync: 'Sincronizando preview...',
          previewReady: 'Preview sincronizado',
          empty:
            'Completa un escenario valido para ver subtotal, recargos, descuentos, horas y total final en vivo.',
          scenarioTitle: 'Escenario',
          leversTitle: 'Palancas del calculo',
          continuityTitle: 'Continuidad y SaaS',
          scopeTitle: 'Bloques del alcance',
          detailsTitle: 'Detalle del calculo',
          detailsLead:
            'Aca se ve formula tecnica, breakdown comercial, explicacion aplicada y dependencias del alcance.',
          summaryTitle: 'Resumen vivo',
          summaryLead:
            'Usa este lateral para negociar rapido: total, mensualidad, horas, contexto y acciones.',
          activeRulesTitle: 'Reglas activas',
          historyTitle: 'Snapshots guardados',
          historyLead: 'Ultimos presupuestos persistidos para volver a una decision comercial.',
          historyEmpty: 'Todavia no hay presupuestos guardados.',
          historyLoading: 'Cargando historial...',
          historyDetailTitle: 'Detalle guardado',
          historyDetailLoading: 'Cargando detalle guardado...',
          historyDetailEmpty: 'Selecciona un snapshot para revisar el resultado persistido.',
          clientNameLabel: 'Cliente',
          companyNameLabel: 'Empresa',
          budgetNameLabel: 'Nombre del presupuesto',
          projectTypeLabel: 'Tipo de proyecto',
          pricingModeLabel: 'Modelo comercial',
          stackLabel: 'Stack / tecnologia',
          complexityLabel: 'Complejidad',
          urgencyLabel: 'Urgencia',
          hourlyRateLabel: 'Tarifa manual',
          discountLabel: 'Descuento manual',
          supportLabel: 'Soporte',
          maintenanceLabel: 'Mantenimiento',
          supportPlanLabel: 'Plan de soporte',
          maintenancePlanLabel: 'Plan de mantenimiento',
          extrasLabel: 'Extras comerciales',
          activeClientsLabel: 'Clientes activos',
          userScaleLabel: 'Tier de usuarios',
          extraHoursLabel: 'Horas extra mensuales',
          selectedModulesLabel: 'bloques activos',
          projectMode: 'Proyecto',
          saasMode: 'SaaS',
          oneTimeTotal: 'Total inicial',
          monthlyTotal: 'Mensual',
          totalHours: 'Horas',
          timeline: 'Timeline',
          technicalFormula: 'Formula tecnica',
          commercialBreakdown: 'Breakdown comercial',
          explanation: 'Explicacion aplicada',
          calculatedModules: 'Bloques calculados',
          surcharges: 'Recargos',
          discounts: 'Descuentos',
          save: 'Guardar snapshot',
          saving: 'Guardando...',
          reset: 'Reiniciar workspace',
          clearNegotiation: 'Limpiar negociacion',
          saveSuccess: 'Presupuesto guardado correctamente.',
          genericPreviewError: 'No se pudo recalcular el presupuesto comercial.',
          genericSaveError: 'No se pudo guardar el presupuesto.',
          genericHistoryError: 'No se pudo cargar el historial comercial.',
          genericHistoryDetailError: 'No se pudo cargar el detalle seleccionado.',
          moduleValidation: 'Selecciona al menos un bloque para calcular el presupuesto.',
          saasValidation: 'Para modo SaaS define clientes activos y un tier de usuarios.',
          noMonthly: 'Sin mensualidad',
          noSurcharges: 'No hay recargos aplicados.',
          noDiscounts: 'No hay descuentos aplicados.',
          noExplanation: 'No hay notas adicionales del motor para este escenario.',
          noModulesDetail: 'Todavia no hay bloques calculados.',
          supportOn: 'Con soporte',
          supportOff: 'Sin soporte',
          noMaintenance: 'Sin mantenimiento',
          stepScenario: 'Escenario',
          stepPricing: 'Precio y stack',
          stepContinuity: 'Continuidad',
          stepScope: 'Alcance',
          stepBack: 'Anterior',
          stepNext: 'Siguiente',
          riskBuffer: 'Buffer riesgo',
        }
        : {
          eyebrow: 'Budget',
          title: 'Private quoting workspace',
          lead:
            'Complete client, requirements, and architecture to quote inside a single guided flow.',
          note:
            'Technical estimation stays integrated as an auxiliary calculator. The backend remains the official source.',
          configurationLoading: 'Loading active configuration...',
          liveSync: 'Syncing preview...',
          previewReady: 'Preview synced',
          empty:
            'Complete a valid scenario to see subtotal, surcharges, discounts, hours, and final total live.',
          scenarioTitle: 'Scenario',
          leversTitle: 'Calculation levers',
          continuityTitle: 'Continuity and SaaS',
          scopeTitle: 'Scope blocks',
          detailsTitle: 'Calculation detail',
          detailsLead:
            'This panel shows the technical formula, the commercial breakdown, the applied explanation, and scope dependencies.',
          summaryTitle: 'Live summary',
          summaryLead:
            'Use this rail to negotiate fast: total, monthly billing, hours, context, and key actions.',
          activeRulesTitle: 'Active rules',
          historyTitle: 'Stored snapshots',
          historyLead: 'Latest persisted budgets to return to a commercial decision.',
          historyEmpty: 'There are no stored budgets yet.',
          historyLoading: 'Loading history...',
          historyDetailTitle: 'Stored detail',
          historyDetailLoading: 'Loading stored detail...',
          historyDetailEmpty: 'Select a snapshot to review the persisted result.',
          clientNameLabel: 'Client',
          companyNameLabel: 'Company',
          budgetNameLabel: 'Budget name',
          projectTypeLabel: 'Project type',
          pricingModeLabel: 'Commercial model',
          stackLabel: 'Stack / technology',
          complexityLabel: 'Complexity',
          urgencyLabel: 'Urgency',
          hourlyRateLabel: 'Manual rate',
          discountLabel: 'Manual discount',
          supportLabel: 'Support',
          maintenanceLabel: 'Maintenance',
          supportPlanLabel: 'Support plan',
          maintenancePlanLabel: 'Maintenance plan',
          extrasLabel: 'Commercial extras',
          activeClientsLabel: 'Active clients',
          userScaleLabel: 'User tier',
          extraHoursLabel: 'Extra monthly hours',
          selectedModulesLabel: 'active blocks',
          projectMode: 'Project',
          saasMode: 'SaaS',
          oneTimeTotal: 'One-time total',
          monthlyTotal: 'Monthly',
          totalHours: 'Hours',
          timeline: 'Timeline',
          technicalFormula: 'Technical formula',
          commercialBreakdown: 'Commercial breakdown',
          explanation: 'Applied explanation',
          calculatedModules: 'Calculated blocks',
          surcharges: 'Surcharges',
          discounts: 'Discounts',
          save: 'Save snapshot',
          saving: 'Saving...',
          reset: 'Reset workspace',
          clearNegotiation: 'Clear negotiation',
          saveSuccess: 'Budget saved successfully.',
          genericPreviewError: 'The commercial budget could not be recalculated.',
          genericSaveError: 'The budget could not be saved.',
          genericHistoryError: 'The commercial history could not be loaded.',
          genericHistoryDetailError: 'The selected detail could not be loaded.',
          moduleValidation: 'Select at least one block to calculate the budget.',
          saasValidation: 'For SaaS mode define active clients and a user tier.',
          noMonthly: 'No monthly billing',
          noSurcharges: 'There are no surcharges applied.',
          noDiscounts: 'There are no discounts applied.',
          noExplanation: 'There are no extra engine notes for this scenario.',
          noModulesDetail: 'There are no calculated blocks yet.',
          supportOn: 'Support enabled',
          supportOff: 'No support',
          noMaintenance: 'No maintenance',
          stepScenario: 'Scenario',
          stepPricing: 'Pricing and stack',
          stepContinuity: 'Continuity',
          stepScope: 'Scope',
          stepBack: 'Back',
          stepNext: 'Next',
          riskBuffer: 'Risk buffer',
        },
  );

  readonly projectTypeOptions = computed(() => {
    const configuration = this.configuration();
    return configuration
      ? this.budgetBuilderUiFacade.getProjectTypeOptions(configuration, this.currentLanguage())
      : [];
  });
  readonly technologyOptions = computed(() => {
    const configuration = this.configuration();
    return configuration
      ? this.budgetBuilderUiFacade.getTechnologyOptions(configuration, this.currentLanguage())
      : [];
  });
  readonly moduleOptions = computed(() => this.configuration()?.modules ?? []);
  readonly selectableSurchargeOptions = computed(() =>
    this.getSelectableSurchargeRules(this.configuration()).map((rule) => ({
      id: rule.id,
      title: rule.label,
      description: rule.reason,
      impact: this.getExtraImpact(rule),
      selected: this.isExtraSelected(rule.id),
    })),
  );
  readonly supportPlanOptions = computed(() => this.configuration()?.supportPlans ?? []);
  readonly maintenancePlanOptions = computed(() => this.configuration()?.maintenancePlans ?? []);
  readonly userScaleOptions = computed(() => this.configuration()?.userScaleTiers ?? []);
  readonly categoryOptions = computed(() => this.configuration()?.categories ?? []);
  readonly complexityOptions = computed(
    () => this.configuration()?.complexityOptions ?? (['LOW', 'MEDIUM', 'HIGH'] as BudgetComplexity[]),
  );
  readonly selectedModulesCount = computed(() => this.getSelectedModuleIds().length);
  readonly selectedExtrasCount = computed(
    () => this.getSelectableSurchargeRules(this.configuration()).filter((rule) => this.isExtraSelected(rule.id)).length,
  );
  readonly isSaasPricing = computed(() => this.budgetForm.controls.pricingMode.value === 'SAAS');
  readonly currentCurrency = computed(
    () => this.calculationResult()?.commercialBudget.currency ?? this.configuration()?.currency ?? 'USD',
  );
  readonly hasPreview = computed(() => Boolean(this.previewPayload() && this.calculationResult()));
  readonly canSavePreview = computed(() => this.hasPreview() && !this.saving() && !this.calculating());
  readonly recentHistory = computed(() => this.history().slice(0, 6));
  readonly selectedHistoryResult = computed(() => this.selectedHistoryDetail()?.resultJson ?? null);
  readonly previewStatus = computed(() => {
    if (this.loadingConfiguration()) {
      return this.content().configurationLoading;
    }

    if (this.calculating()) {
      return this.content().liveSync;
    }

    if (this.formError()) {
      return this.formError();
    }

    if (this.previewHint()) {
      return this.previewHint();
    }

    return this.hasPreview() ? this.content().previewReady : this.content().empty;
  });

  ngOnInit(): void {
    this.observeProjectTypeChanges();
    this.observeLiveChanges();
    this.loadConfiguration();
    this.loadHistory(true);
  }

  readonly selectedSupportPlan = computed(
    () => this.supportPlanOptions().find((plan) => plan.id === this.budgetForm.controls.supportPlanId.value) ?? null,
  );
  readonly selectedMaintenancePlan = computed(
    () =>
      this.maintenancePlanOptions().find(
        (plan) => plan.id === this.budgetForm.controls.maintenancePlanId.value,
      ) ?? null,
  );
  readonly selectedUserScale = computed(
    () => this.userScaleOptions().find((tier) => tier.id === this.budgetForm.controls.userScaleTierId.value) ?? null,
  );
  readonly selectedTechnology = computed(
    () => this.technologyOptions().find((item) => item.id === this.budgetForm.controls.desiredStackId.value) ?? null,
  );
  readonly projectCards = computed<ChoiceCard[]>(() =>
    this.projectTypeOptions().map((option) => ({
      id: option.id,
      title: option.label,
      description: option.description,
      impact: this.getProjectImpact(option.id),
      selected: option.id === this.budgetForm.controls.projectType.value,
    })),
  );
  readonly pricingCards = computed<ChoiceCard[]>(() => [
    {
      id: 'PROJECT',
      title: this.content().projectMode,
      description:
        this.currentLanguage() === 'es'
          ? 'Entrega one-shot con cobro inicial y mensualidad solo si sumas continuidad.'
          : 'One-shot delivery with upfront billing and monthly charges only when continuity is enabled.',
      impact:
        this.currentLanguage() === 'es'
          ? 'Formula: base tecnica + recargos - descuentos = total inicial.'
          : 'Formula: technical base + surcharges - discounts = one-time total.',
      selected: this.budgetForm.controls.pricingMode.value === 'PROJECT',
    },
    {
      id: 'SAAS',
      title: this.content().saasMode,
      description:
        this.currentLanguage() === 'es'
          ? 'Recupera desarrollo por mes y suma infraestructura, soporte, tier y horas extra.'
          : 'Recovers development monthly and adds infrastructure, support, tier, and extra hours.',
      impact:
        this.currentLanguage() === 'es'
          ? 'Formula: recupero + infraestructura + soporte + tier usuarios + extras.'
          : 'Formula: recovery + infrastructure + support + user tier + extras.',
      selected: this.budgetForm.controls.pricingMode.value === 'SAAS',
    },
  ]);
  readonly complexityCards = computed<ChoiceCard[]>(() =>
    this.complexityOptions().map((complexity) => ({
      id: complexity,
      title: this.getComplexityLabel(complexity),
      description: this.getComplexityDescription(complexity),
      impact: this.getComplexityImpact(complexity),
      selected: complexity === this.budgetForm.controls.complexity.value,
    })),
  );
  readonly workflowSteps = computed<ChoiceCard[]>(() => [
    {
      id: 'scenario',
      title: this.content().stepScenario,
      description:
        this.currentLanguage() === 'es'
          ? 'Define preset comercial y modo de venta.'
          : 'Define the commercial preset and selling mode.',
      impact: this.getProjectTypeLabel(this.budgetForm.controls.projectType.value),
      selected: this.currentStep() === 'scenario',
    },
    {
      id: 'pricing',
      title: this.content().stepPricing,
      description:
        this.currentLanguage() === 'es'
          ? 'Elegi stack, extras y ajuste comercial.'
          : 'Choose stack, extras, and commercial adjustments.',
      impact: this.getTechnologyLabel(this.budgetForm.controls.desiredStackId.value),
      selected: this.currentStep() === 'pricing',
    },
    {
      id: 'continuity',
      title: this.content().stepContinuity,
      description:
        this.currentLanguage() === 'es'
          ? 'Configura soporte, mantenimiento y SaaS.'
          : 'Configure support, maintenance, and SaaS continuity.',
      impact: this.getSupportSummary(),
      selected: this.currentStep() === 'continuity',
    },
    {
      id: 'scope',
      title: this.content().stepScope,
      description:
        this.currentLanguage() === 'es'
          ? 'Ajusta bloques activos y dependencias.'
          : 'Adjust active blocks and dependencies.',
      impact: `${this.selectedModulesCount()} ${this.content().selectedModulesLabel}`,
      selected: this.currentStep() === 'scope',
    },
  ]);
  readonly summaryMetrics = computed(() => {
    const result = this.calculationResult();
    const currency = this.currentCurrency();
    return [
      {
        id: 'one-time',
        label: this.content().oneTimeTotal,
        value: this.formatCurrency(result?.commercialBudget.finalOneTimeTotal ?? 0, currency),
        note: this.hasPreview() ? this.content().previewReady : this.previewStatus(),
      },
      {
        id: 'monthly',
        label: this.content().monthlyTotal,
        value:
          result && result.commercialBudget.finalMonthlyTotal > 0
            ? this.formatCurrency(result.commercialBudget.finalMonthlyTotal, currency)
            : this.content().noMonthly,
        note: this.getSupportSummary(),
      },
      {
        id: 'hours',
        label: this.content().totalHours,
        value: `${safeNumber(result?.technicalEstimate.totalHours).toFixed(2)} h`,
        note: `${this.selectedModulesCount()} ${this.content().selectedModulesLabel}`,
      },
      {
        id: 'timeline',
        label: this.content().timeline,
        value: result ? `${safeNumber(result.technicalEstimate.totalWeeks).toFixed(2)} sem` : '--',
        note: this.getUrgencyImpact(this.budgetForm.controls.urgency.value),
      },
    ];
  });
  readonly technicalRows = computed(() => {
    const configuration = this.configuration();
    const result = this.calculationResult();
    if (!configuration || !result) {
      return [];
    }

    const moduleHours = result.modules.reduce((sum, module) => sum + safeNumber(module.estimatedHours), 0);
    const risk = Math.max(
      safeNumber(configuration.riskBufferHours),
      safeNumber(result.technicalEstimate.totalHours) - moduleHours,
    );

    return [
      {
        id: 'modules',
        label: this.currentLanguage() === 'es' ? 'Horas por bloques' : 'Block hours',
        value: `${moduleHours.toFixed(2)} h`,
        note:
          this.currentLanguage() === 'es'
            ? 'Suma de los bloques seleccionados usando PERT.'
            : 'Sum of selected blocks using PERT.',
      },
      {
        id: 'risk',
        label: this.content().riskBuffer,
        value: `${risk.toFixed(2)} h`,
        note:
          this.currentLanguage() === 'es'
            ? 'Se agrega una sola vez para cubrir incertidumbre de entrega.'
            : 'Added once to cover delivery uncertainty.',
      },
      {
        id: 'total',
        label: this.content().totalHours,
        value: `${safeNumber(result.technicalEstimate.totalHours).toFixed(2)} h`,
        note:
          this.currentLanguage() === 'es'
            ? `${safeNumber(result.technicalEstimate.totalWeeks).toFixed(2)} semanas con la configuracion activa.`
            : `${safeNumber(result.technicalEstimate.totalWeeks).toFixed(2)} weeks with the active configuration.`,
      },
    ];
  });
  readonly commercialRows = computed(() => {
    const result = this.calculationResult();
    if (!result) {
      return [];
    }

    const surchargeTotal = result.commercialBudget.surchargeItems.reduce(
      (sum, item) => sum + safeNumber(item.amount),
      0,
    );
    const discountTotal = result.commercialBudget.discountItems.reduce(
      (sum, item) => sum + safeNumber(item.amount),
      0,
    );

    return [
      {
        id: 'base',
        label: this.currentLanguage() === 'es' ? 'Base tecnica' : 'Technical base',
        amount: safeNumber(result.commercialBudget.baseAmount),
        note:
          this.currentLanguage() === 'es'
            ? 'Horas valorizadas por categoria activa.'
            : 'Hours valued by active category.',
      },
      {
        id: 'surcharge',
        label: this.content().surcharges,
        amount: surchargeTotal,
        note:
          this.currentLanguage() === 'es'
            ? 'Suma de recargos activos por stack, hosting, soporte y otras reglas.'
            : 'Sum of active surcharges from stack, hosting, support, and other rules.',
      },
      {
        id: 'discount',
        label: this.content().discounts,
        amount: discountTotal * -1,
        note:
          this.currentLanguage() === 'es'
            ? 'Ajustes negociados aplicados al escenario actual.'
            : 'Negotiated adjustments applied to the current scenario.',
      },
      {
        id: 'one-time-subtotal',
        label: this.currentLanguage() === 'es' ? 'Subtotal inicial' : 'One-time subtotal',
        amount: safeNumber(result.commercialBudget.oneTimeSubtotal),
        note:
          this.currentLanguage() === 'es'
            ? 'Lectura previa al cierre final del total inicial.'
            : 'Reading before the final one-time closing total.',
      },
      {
        id: 'monthly-subtotal',
        label: this.currentLanguage() === 'es' ? 'Subtotal mensual' : 'Monthly subtotal',
        amount: safeNumber(result.commercialBudget.monthlySubtotal),
        note:
          this.currentLanguage() === 'es'
            ? 'Base recurrente para SaaS, soporte y extras.'
            : 'Recurring base for SaaS, support, and extras.',
      },
      {
        id: 'one-time-total',
        label: this.content().oneTimeTotal,
        amount: safeNumber(result.commercialBudget.finalOneTimeTotal),
        note:
          this.currentLanguage() === 'es'
            ? 'Total inicial listo para negociar o guardar.'
            : 'One-time total ready to negotiate or save.',
        highlight: true,
      },
      {
        id: 'monthly-total',
        label: this.content().monthlyTotal,
        amount: safeNumber(result.commercialBudget.finalMonthlyTotal),
        note:
          result.commercialBudget.finalMonthlyTotal > 0
            ? this.currentLanguage() === 'es'
              ? 'Mensualidad final del escenario activo.'
              : 'Final monthly billing for the active scenario.'
            : this.content().noMonthly,
        highlight: true,
      },
    ];
  });

  selectProjectType(projectType: string): void {
    this.budgetForm.controls.projectType.setValue(projectType);
  }

  goToStep(step: BudgetBuilderStepId): void {
    this.currentStep.set(step);
  }

  goToPreviousStep(): void {
    const order: BudgetBuilderStepId[] = ['scenario', 'pricing', 'continuity', 'scope'];
    const currentIndex = order.indexOf(this.currentStep());
    this.currentStep.set(order[Math.max(currentIndex - 1, 0)]);
  }

  goToNextStep(): void {
    const order: BudgetBuilderStepId[] = ['scenario', 'pricing', 'continuity', 'scope'];
    const currentIndex = order.indexOf(this.currentStep());
    this.currentStep.set(order[Math.min(currentIndex + 1, order.length - 1)]);
  }

  isFirstStep(): boolean {
    return this.currentStep() === 'scenario';
  }

  isLastStep(): boolean {
    return this.currentStep() === 'scope';
  }

  selectPricingMode(mode: BudgetPricingMode): void {
    this.budgetForm.controls.pricingMode.setValue(mode);
  }

  selectComplexity(complexity: BudgetComplexity): void {
    this.budgetForm.controls.complexity.setValue(complexity);
  }

  toggleModule(moduleId: string): void {
    const control = this.moduleSelection.get(moduleId);
    if (!control) {
      return;
    }

    control.setValue(!control.value);
  }

  toggleExtra(ruleId: string): void {
    const control = this.extraSelection.get(ruleId);
    if (!control) {
      return;
    }

    control.setValue(!control.value);
  }

  saveBudget(): void {
    const payload = this.previewPayload();
    const preview = this.calculationResult();

    if (!payload || !preview) {
      return;
    }

    this.saving.set(true);
    this.formError.set(null);
    this.saveFeedback.set(null);

    const savePayload: BudgetBuilderSaveRequestPayload = {
      input: payload,
      expectedConfigurationSnapshotId: preview.configurationSnapshotId,
      expectedPreviewHash: preview.previewHash,
    };

    this.budgetBuilderUiFacade
      .saveBudget(savePayload)
      .pipe(
        finalize(() => this.saving.set(false)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: () => {
          this.previewSaved.set(true);
          this.saveFeedback.set(this.content().saveSuccess);
          this.loadHistory(true);
        },
        error: (error) => {
          this.formError.set(this.resolveErrorMessage(error, this.content().genericSaveError));
        },
      });
  }

  resetWorkspace(): void {
    const configuration = this.configuration();
    if (!configuration) {
      return;
    }

    this.initializeBuilder(configuration);
    this.refreshPreview(true);
  }

  clearNegotiationAdjustments(): void {
    const configuration = this.configuration();
    if (!configuration) {
      return;
    }

    this.budgetForm.patchValue({
      hourlyRate: safeNumber(configuration.defaultHourlyRate),
      manualDiscount: 0,
      extraMonthlyHours: 0,
    });
  }

  selectHistoryItem(budgetId: string): void {
    if (this.selectedHistoryId() === budgetId && this.selectedHistoryDetail()?.id === budgetId) {
      return;
    }

    this.selectedHistoryId.set(budgetId);
    this.historyDetailError.set(null);
    this.loadingHistoryDetail.set(true);

    this.budgetBuilderUiFacade
      .getBudgetById(budgetId)
      .pipe(
        finalize(() => this.loadingHistoryDetail.set(false)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: (detail) => {
          this.selectedHistoryDetail.set(detail);
        },
        error: (error) => {
          this.historyDetailError.set(
            this.resolveErrorMessage(error, this.content().genericHistoryDetailError),
          );
        },
      });
  }

  isModuleSelected(moduleId: string): boolean {
    return Boolean(this.moduleSelection.get(moduleId)?.value);
  }

  getProjectTypeLabel(projectType: string): string {
    return this.projectTypeOptions().find((option) => option.id === projectType)?.label ?? projectType;
  }

  getTechnologyLabel(stackId: string): string {
    return this.technologyOptions().find((option) => option.id === stackId)?.label ?? stackId;
  }

  getComplexityLabel(complexity: string): string {
    const catalog: Record<string, string> =
      this.currentLanguage() === 'es'
        ? { LOW: 'Baja', MEDIUM: 'Media', HIGH: 'Alta' }
        : { LOW: 'Low', MEDIUM: 'Medium', HIGH: 'High' };

    return catalog[complexity] ?? complexity;
  }

  getComplexityDescription(complexity: BudgetComplexity): string {
    if (complexity === 'LOW') {
      return this.currentLanguage() === 'es'
        ? 'Escenario acotado y mas previsible.'
        : 'Reduced and more predictable scenario.';
    }

    if (complexity === 'HIGH') {
      return this.currentLanguage() === 'es'
        ? 'Mas integraciones, validaciones y decisiones.'
        : 'More integrations, validations, and decisions.';
    }

    return this.currentLanguage() === 'es'
      ? 'Equilibrio entre velocidad, capas y negocio.'
      : 'Balanced speed, layers, and business scope.';
  }

  getComplexityImpact(complexity: BudgetComplexity): string {
    if (complexity === 'LOW') {
      return this.currentLanguage() === 'es'
        ? 'Contiene el esfuerzo tecnico y mantiene el costo base mas liviano.'
        : 'Keeps technical effort and base cost lighter.';
    }

    if (complexity === 'HIGH') {
      return this.currentLanguage() === 'es'
        ? 'Empuja horas y amplifica el impacto de stack, soporte y riesgos.'
        : 'Pushes hours up and amplifies stack, support, and risk impact.';
    }

    return this.currentLanguage() === 'es'
      ? 'Referencia equilibrada para una lectura base.'
      : 'Balanced reference for a baseline reading.';
  }

  getUrgencyLabel(urgency: string): string {
    const catalog =
      this.currentLanguage() === 'es'
        ? { STANDARD: 'Estandar', PRIORITY: 'Prioritaria', EXPRESS: 'Express' }
        : { STANDARD: 'Standard', PRIORITY: 'Priority', EXPRESS: 'Express' };

    return catalog[urgency as keyof typeof catalog] ?? urgency;
  }

  getUrgencyImpact(urgency: BudgetUrgency): string {
    if (urgency === 'EXPRESS') {
      return this.currentLanguage() === 'es'
        ? 'Presiona el timeline y la lectura comercial.'
        : 'Pushes the timeline and the commercial reading.';
    }

    if (urgency === 'PRIORITY') {
      return this.currentLanguage() === 'es'
        ? 'Mantiene prioridad alta sin ir a modo express.'
        : 'Keeps high priority without going full express.';
    }

    return this.currentLanguage() === 'es'
      ? 'Flujo normal de entrega.'
      : 'Standard delivery flow.';
  }

  getSupportSummary(): string {
    if (!this.budgetForm.controls.supportEnabled.value) {
      return this.content().supportOff;
    }

    return this.selectedSupportPlan()?.label ?? this.content().supportOn;
  }

  getMaintenanceSummary(): string {
    return this.selectedMaintenancePlan()?.label ?? this.content().noMaintenance;
  }

  getSupportImpact(): string {
    if (!this.budgetForm.controls.supportEnabled.value) {
      return this.currentLanguage() === 'es'
        ? 'No suma mensualidad de soporte.'
        : 'Does not add support billing.';
    }

    return this.getSupportPlanImpact(this.selectedSupportPlan());
  }

  getSupportPlanImpact(plan: BudgetBuilderConfigSupportPlan | null): string {
    if (!plan) {
      return this.currentLanguage() === 'es'
        ? 'Elige un plan para sumar horas incluidas y monto mensual.'
        : 'Select a plan to add included hours and monthly amount.';
    }

    const monthly = safeNumber(plan.monthlyAmount);
    const hours = safeNumber(plan.includedHours);
    if (this.currentLanguage() === 'es') {
      return `${hours.toFixed(0)} h incluidas${monthly > 0 ? ` y ${this.formatCurrency(monthly, this.currentCurrency())} por mes.` : '.'}`;
    }

    return `${hours.toFixed(0)} h included${monthly > 0 ? ` and ${this.formatCurrency(monthly, this.currentCurrency())} per month.` : '.'}`;
  }

  getMaintenanceImpact(
    plan: BudgetBuilderConfigMaintenancePlan | null = this.selectedMaintenancePlan(),
  ): string {
    if (!plan) {
      return this.currentLanguage() === 'es'
        ? 'Sin retainer de mantenimiento en el escenario actual.'
        : 'No maintenance retainer in the current scenario.';
    }

    return this.currentLanguage() === 'es'
      ? `${this.formatCurrency(safeNumber(plan.monthlyAmount), this.currentCurrency())} por mes para continuidad evolutiva.`
      : `${this.formatCurrency(safeNumber(plan.monthlyAmount), this.currentCurrency())} per month for evolutionary continuity.`;
  }

  getUserScaleImpact(tier: BudgetBuilderConfigUserScaleTier | null = this.selectedUserScale()): string {
    if (!this.isSaasPricing()) {
      return this.currentLanguage() === 'es'
        ? 'No aplica fuera de modo SaaS.'
        : 'Does not apply outside SaaS mode.';
    }

    if (!tier) {
      return this.content().saasValidation;
    }

    if (this.currentLanguage() === 'es') {
      return `${tier.label}: ${tier.mode === 'FIXED' ? this.formatCurrency(safeNumber(tier.value), this.currentCurrency()) : `${safeNumber(tier.value)}%`} recurrente.`;
    }

    return `${tier.label}: ${tier.mode === 'FIXED' ? this.formatCurrency(safeNumber(tier.value), this.currentCurrency()) : `${safeNumber(tier.value)}%`} recurring.`;
  }

  getProjectImpact(projectType: string): string {
    const configuration = this.configuration();
    const defaults =
      configuration && this.budgetBuilderUiFacade.resolveProjectDefaults(configuration, projectType);
    const moduleCount = defaults?.defaultModuleIds.length ?? 0;
    if (this.currentLanguage() === 'es') {
      return `${moduleCount} bloques por defecto${defaults?.defaultSupportRuleId ? ' y soporte sugerido' : ''}.`;
    }

    return `${moduleCount} default blocks${defaults?.defaultSupportRuleId ? ' plus suggested support' : ''}.`;
  }

  isExtraSelected(ruleId: string): boolean {
    return Boolean(this.extraSelection.get(ruleId)?.value);
  }

  getTechnologyImpact(stackId: string): string {
    const configuration = this.configuration();
    const technology = configuration?.technologies.find((item) => item.id === stackId) ?? null;
    if (!technology) {
      return '';
    }

    if (technology.surchargeRuleId) {
      return this.currentLanguage() === 'es'
        ? 'Activa un recargo comercial fuera del stack principal.'
        : 'Triggers a commercial surcharge outside the primary stack.';
    }

    return this.currentLanguage() === 'es'
      ? 'No agrega recargo comercial extra.'
      : 'Adds no extra commercial surcharge.';
  }

  getCategoryLabel(categoryId: string): string {
    return this.categoryOptions().find((category) => category.id === categoryId)?.label ?? categoryId;
  }

  getModuleFormula(module: BudgetBuilderConfigModule): string {
    return `PERT ${safeNumber(module.optimisticHours).toFixed(0)} / ${safeNumber(module.probableHours).toFixed(0)} / ${safeNumber(module.pessimisticHours).toFixed(0)} h`;
  }

  getModuleDependencies(module: BudgetBuilderConfigModule): string {
    if (!module.dependencyIds.length) {
      return this.currentLanguage() === 'es' ? 'Sin dependencias previas.' : 'No prior dependencies.';
    }

    const names = module.dependencyIds.map((dependencyId) => this.getModuleName(dependencyId)).join(' -> ');
    return this.currentLanguage() === 'es'
      ? `Depende de ${names}.`
      : `Depends on ${names}.`;
  }

  getModuleName(moduleId: string): string {
    return this.moduleOptions().find((module) => module.id === moduleId)?.name ?? moduleId;
  }

  getStageLabel(stage: string): string {
    const catalog =
      this.currentLanguage() === 'es'
        ? { INPUT: 'Entrada', TECHNICAL: 'Tecnico', COMMERCIAL: 'Comercial', NEGOTIATION: 'Negociacion' }
        : { INPUT: 'Input', TECHNICAL: 'Technical', COMMERCIAL: 'Commercial', NEGOTIATION: 'Negotiation' };

    return catalog[stage as keyof typeof catalog] ?? stage;
  }

  formatCurrency(amount: number, currency: string): string {
    return new Intl.NumberFormat(this.currentLanguage() === 'es' ? 'es-AR' : 'en-US', {
      style: 'currency',
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  }

  trackById(_: number, item: { id: string }): string {
    return item.id;
  }

  trackByValue(_: number, item: string): string {
    return item;
  }

  private loadConfiguration(): void {
    this.loadingConfiguration.set(true);
    this.formError.set(null);

    this.budgetBuilderUiFacade
      .getActiveConfiguration()
      .pipe(
        finalize(() => this.loadingConfiguration.set(false)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: (configuration) => {
          this.configuration.set(configuration);
          this.initializeBuilder(configuration);
          this.refreshPreview(true);
        },
        error: (error) => {
          this.formError.set(this.resolveErrorMessage(error, this.content().genericPreviewError));
        },
      });
  }

  private loadHistory(selectLatest: boolean): void {
    this.loadingHistory.set(true);
    this.historyError.set(null);

    this.budgetBuilderUiFacade
      .getBudgets()
      .pipe(
        finalize(() => this.loadingHistory.set(false)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: (budgets) => {
          this.history.set(budgets);

          if (budgets.length === 0) {
            this.selectedHistoryId.set(null);
            this.selectedHistoryDetail.set(null);
            return;
          }

          const selectedId = this.selectedHistoryId();
          const activeId =
            selectLatest || !selectedId || !budgets.some((budget) => budget.id === selectedId)
              ? budgets[0].id
              : selectedId;

          this.selectHistoryItem(activeId);
        },
        error: (error) => {
          this.historyError.set(this.resolveErrorMessage(error, this.content().genericHistoryError));
        },
      });
  }

  private initializeBuilder(configuration: BudgetBuilderConfigView): void {
    const initialValue = this.budgetBuilderUiFacade.createInitialFormValue(configuration);
    this.syncModuleControls(configuration.modules.map((module) => module.id));
    this.syncExtraControls(this.getSelectableSurchargeRules(configuration).map((rule) => rule.id));

    this.budgetForm.reset(
      {
        clientName: '',
        companyName: '',
        budgetName: initialValue.budgetName,
        projectType: initialValue.projectType,
        pricingMode: initialValue.pricingMode,
        desiredStackId: initialValue.desiredStackId,
        complexity: initialValue.complexity,
        urgency: initialValue.urgency,
        supportEnabled: initialValue.supportEnabled,
        supportPlanId: initialValue.supportPlanId,
        maintenancePlanId: initialValue.maintenancePlanId,
        hourlyRate: initialValue.hourlyRate,
        manualDiscount: initialValue.manualDiscount,
        activeClients: initialValue.activeClients,
        userScaleTierId: initialValue.userScaleTierId,
        extraMonthlyHours: initialValue.extraMonthlyHours,
      },
      { emitEvent: false },
    );

    this.applyProjectDefaults(initialValue.projectType);
    this.previewSaved.set(false);
    this.previewHint.set(null);
    this.formError.set(null);
    this.saveFeedback.set(null);
    this.lastPreviewSignature = null;
    this.currentStep.set('scenario');
  }

  private observeProjectTypeChanges(): void {
    this.budgetForm.controls.projectType.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((projectType) => {
        if (!projectType || this.loadingConfiguration()) {
          return;
        }

        this.applyProjectDefaults(projectType);
      });
  }

  private observeLiveChanges(): void {
    merge(this.budgetForm.valueChanges, this.moduleSelection.valueChanges, this.extraSelection.valueChanges)
      .pipe(
        debounceTime(260),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe(() => {
        if (!this.configuration() || this.loadingConfiguration()) {
          return;
        }

        this.previewSaved.set(false);
        this.saveFeedback.set(null);
        this.refreshPreview();
      });
  }

  private applyProjectDefaults(projectType: string): void {
    const configuration = this.configuration();
    if (!configuration) {
      return;
    }

    const defaults = this.budgetBuilderUiFacade.resolveProjectDefaults(configuration, projectType);
    const selectedModuleIds = new Set(defaults?.defaultModuleIds ?? []);
    const isSaasProject = projectType.toLowerCase().includes('saas');

    for (const module of configuration.modules) {
      this.moduleSelection.get(module.id)?.setValue(selectedModuleIds.has(module.id), {
        emitEvent: false,
      });
    }

    this.budgetForm.patchValue(
      {
        pricingMode: isSaasProject ? 'SAAS' : this.budgetForm.controls.pricingMode.value,
        supportPlanId: defaults?.defaultSupportRuleId ?? this.supportPlanOptions()[0]?.id ?? null,
        maintenancePlanId: defaults?.defaultMaintenanceRuleId ?? null,
        userScaleTierId: this.userScaleOptions()[0]?.id ?? null,
      },
      { emitEvent: false },
    );

    for (const extraRule of this.getSelectableSurchargeRules(configuration)) {
      this.extraSelection.get(extraRule.id)?.setValue(false, { emitEvent: false });
    }
  }

  private syncModuleControls(moduleIds: string[]): void {
    const activeIds = new Set(moduleIds);

    for (const moduleId of moduleIds) {
      if (!this.moduleSelection.contains(moduleId)) {
        this.moduleSelection.addControl(moduleId, this.formBuilder.nonNullable.control(false));
      }
    }

    for (const currentId of Object.keys(this.moduleSelection.controls)) {
      if (!activeIds.has(currentId)) {
        this.moduleSelection.removeControl(currentId);
      }
    }
  }

  private syncExtraControls(ruleIds: string[]): void {
    const activeIds = new Set(ruleIds);

    for (const ruleId of ruleIds) {
      if (!this.extraSelection.contains(ruleId)) {
        this.extraSelection.addControl(ruleId, this.formBuilder.nonNullable.control(false));
      }
    }

    for (const currentId of Object.keys(this.extraSelection.controls)) {
      if (!activeIds.has(currentId)) {
        this.extraSelection.removeControl(currentId);
      }
    }
  }

  private refreshPreview(force = false): void {
    const configuration = this.configuration();
    if (!configuration) {
      return;
    }

    const selectedModuleIds = this.getSelectedModuleIds();
    const prepared = this.preparePreviewPayload(configuration, selectedModuleIds);

    if (!prepared.payload) {
      this.previewPayload.set(null);
      this.calculationResult.set(null);
      this.previewHint.set(prepared.validationMessage);
      this.formError.set(null);
      this.calculating.set(false);
      this.lastPreviewSignature = null;
      return;
    }

    const signature = JSON.stringify(prepared.payload);
    if (!force && signature === this.lastPreviewSignature) {
      return;
    }

    this.previewRequestVersion += 1;
    const requestVersion = this.previewRequestVersion;

    this.previewHint.set(null);
    this.formError.set(null);
    this.calculating.set(true);

    this.budgetBuilderUiFacade
      .previewBudget(prepared.payload)
      .pipe(
        finalize(() => {
          if (requestVersion === this.previewRequestVersion) {
            this.calculating.set(false);
          }
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: (result) => {
          if (requestVersion !== this.previewRequestVersion) {
            return;
          }

          this.previewPayload.set(prepared.payload);
          this.calculationResult.set(result);
          this.lastPreviewSignature = signature;
        },
        error: (error) => {
          if (requestVersion !== this.previewRequestVersion) {
            return;
          }

          this.previewPayload.set(null);
          this.calculationResult.set(null);
          this.formError.set(this.resolveErrorMessage(error, this.content().genericPreviewError));
        },
      });
  }

  private preparePreviewPayload(
    configuration: BudgetBuilderConfigView,
    selectedModuleIds: string[],
  ): { payload: BudgetBuilderPreviewRequestPayload | null; validationMessage: string | null } {
    if (selectedModuleIds.length === 0) {
      return { payload: null, validationMessage: this.content().moduleValidation };
    }

    const formValue = this.budgetForm.getRawValue() as BudgetBuilderUiFormValue;
    if (
      formValue.pricingMode === 'SAAS' &&
      (formValue.activeClients <= 0 || !formValue.userScaleTierId)
    ) {
      return { payload: null, validationMessage: this.content().saasValidation };
    }

    const projectDefaults =
      this.budgetBuilderUiFacade.resolveProjectDefaults(configuration, formValue.projectType) ?? null;
    const selectedExtraRuleIds = this.getSelectableSurchargeRules(configuration)
      .map((rule) => rule.id)
      .filter((ruleId) => this.isExtraSelected(ruleId));
    const manualDiscount = Math.max(formValue.manualDiscount, 0);
    const isSaas = formValue.pricingMode === 'SAAS';

    return {
      validationMessage: null,
      payload: {
        budgetName: formValue.budgetName.trim() || 'Budget Builder',
        projectType: formValue.projectType,
        pricingMode: formValue.pricingMode,
        desiredStackId: formValue.desiredStackId,
        complexity: formValue.complexity,
        urgency: formValue.urgency,
        selectedModuleIds,
        moduleSelectionMode: 'EXPLICIT' as BudgetModuleSelectionMode,
        selectedSurchargeRuleIds: [
          ...(projectDefaults?.defaultSurchargeRuleIds ?? []),
          ...selectedExtraRuleIds,
        ],
        supportEnabled: formValue.supportEnabled,
        supportPlanId: formValue.supportEnabled ? formValue.supportPlanId : null,
        maintenancePlanId: formValue.maintenancePlanId,
        hourlyRateOverride: Math.max(formValue.hourlyRate, 0),
        manualDiscount:
          manualDiscount > 0
            ? {
                label: 'Manual discount',
                reason: 'Dashboard negotiation adjustment',
                mode: 'FIXED',
                value: manualDiscount,
                cadence: 'ONE_TIME',
              }
            : null,
        activeClients: isSaas ? Math.max(formValue.activeClients, 0) : null,
        userScaleTierId: isSaas ? formValue.userScaleTierId : null,
        extraMonthlyHours: isSaas ? Math.max(formValue.extraMonthlyHours, 0) : null,
        notes: [],
      },
    };
  }

  private getSelectedModuleIds(): string[] {
    return this.moduleOptions()
      .map((module) => module.id)
      .filter((moduleId) => this.moduleSelection.get(moduleId)?.value);
  }

  private getSelectableSurchargeRules(
    configuration: BudgetBuilderConfigView | null,
  ): BudgetBuilderConfigSurchargeRule[] {
    if (!configuration) {
      return [];
    }

    return configuration.surchargeRules.filter(
      (rule) => !rule.enabledByDefault && rule.id !== 'outside-stack-surcharge' && rule.appliesTo === 'ONE_TIME',
    );
  }

  private getExtraImpact(rule: BudgetBuilderConfigSurchargeRule): string {
    return `${this.formatCurrency(safeNumber(rule.value), this.currentCurrency())} one-shot.`;
  }

  private resolveErrorMessage(error: unknown, fallback: string): string {
    if (
      error instanceof HttpErrorResponse &&
      error.error &&
      typeof error.error.message === 'string' &&
      error.error.message.trim().length > 0
    ) {
      return error.error.message;
    }

    return fallback;
  }
}
