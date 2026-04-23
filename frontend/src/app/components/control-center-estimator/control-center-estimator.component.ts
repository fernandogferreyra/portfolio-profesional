import { HttpErrorResponse } from '@angular/common/http';
import { Component, DestroyRef, OnInit, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder } from '@angular/forms';
import { debounceTime, finalize, merge } from 'rxjs';

import {
  DEFAULT_QUOTE_COMPLEXITY,
  DEFAULT_QUOTE_MODULES,
  DEFAULT_QUOTE_PROJECT_TYPE,
  QUOTE_COMPLEXITY_OPTIONS,
  QUOTE_MODULE_OPTIONS,
  QUOTE_PROJECT_TYPE_OPTIONS,
} from '../../data/quote.data';
import {
  QuoteAdminDetail,
  QuoteAdminSummary,
  QuoteComplexity,
  QuoteModuleCode,
  QuoteRequestPayload,
  QuoteResult,
  localizeQuoteText,
} from '../../models/quote.models';
import { LanguageService } from '../../services/language.service';
import { QuoteService } from '../../services/quote.service';
import { SiteActivityService } from '../../services/site-activity.service';

type ChoiceCard = {
  id: string;
  title: string;
  description: string;
  impact: string;
  selected: boolean;
};

function safeNumber(value: number | null | undefined): number {
  return typeof value === 'number' && Number.isFinite(value) ? value : 0;
}

@Component({
  selector: 'app-control-center-estimator',
  standalone: false,
  templateUrl: './control-center-estimator.component.html',
  styleUrl: './control-center-estimator.component.scss',
})
export class ControlCenterEstimatorComponent implements OnInit {
  private readonly destroyRef = inject(DestroyRef);
  private readonly formBuilder = inject(FormBuilder);
  private readonly languageService = inject(LanguageService);
  private readonly quoteService = inject(QuoteService);
  private readonly siteActivityService = inject(SiteActivityService);

  private previewRequestVersion = 0;
  private lastPreviewSignature: string | null = null;

  readonly currentLanguage = this.languageService.language;
  readonly moduleSelection = this.formBuilder.record(
    Object.fromEntries(
      QUOTE_MODULE_OPTIONS.map((module) => [
        module.code,
        this.formBuilder.nonNullable.control(DEFAULT_QUOTE_MODULES.includes(module.code)),
      ]),
    ),
  );
  readonly estimatorForm = this.formBuilder.nonNullable.group({
    projectType: this.formBuilder.nonNullable.control(DEFAULT_QUOTE_PROJECT_TYPE),
    complexity: this.formBuilder.nonNullable.control<QuoteComplexity>(DEFAULT_QUOTE_COMPLEXITY),
  });

  readonly calculating = signal(false);
  readonly saving = signal(false);
  readonly loadingHistory = signal(false);
  readonly loadingHistoryDetail = signal(false);
  readonly formError = signal<string | null>(null);
  readonly previewHint = signal<string | null>(null);
  readonly saveFeedback = signal<string | null>(null);
  readonly historyError = signal<string | null>(null);
  readonly historyDetailError = signal<string | null>(null);
  readonly previewPayload = signal<QuoteRequestPayload | null>(null);
  readonly previewResult = signal<QuoteResult | null>(null);
  readonly previewSaved = signal(false);
  readonly history = signal<QuoteAdminSummary[]>([]);
  readonly selectedHistoryId = signal<string | null>(null);
  readonly selectedHistoryDetail = signal<QuoteAdminDetail | null>(null);

  readonly content = computed(() =>
    this.currentLanguage() === 'es'
      ? {
          eyebrow: 'Estimador tecnico',
          title: 'Workspace de estimacion tecnica',
          lead:
            'Herramienta viva para leer horas, riesgo, timeline y dependencias antes de convertir alcance en presupuesto comercial.',
          note:
            'Cada cambio recalcula el preview tecnico desde backend. No hay motor local visible en este flujo.',
          empty:
            'Selecciona proyecto, complejidad y modulos para ver horas, buffer de riesgo y timeline en vivo.',
          syncing: 'Sincronizando estimacion tecnica...',
          ready: 'Preview tecnico sincronizado',
          scenarioTitle: 'Escenario tecnico',
          modulesTitle: 'Bloques a estimar',
          detailsTitle: 'Lectura tecnica',
          detailsLead:
            'Formula, supuestos, timeline y desglose por modulo para entender de inmediato donde se va el esfuerzo.',
          summaryTitle: 'Resumen vivo',
          summaryLead:
            'Usa este lateral para leer rapido total, riesgo, timeline, guardar snapshot y revisar historial.',
          historyTitle: 'Snapshots tecnicos',
          historyLead: 'Ultimas estimaciones persistidas para comparar decisiones de alcance.',
          historyEmpty: 'Todavia no hay estimaciones guardadas.',
          historyLoading: 'Cargando historial tecnico...',
          historyDetailTitle: 'Detalle guardado',
          historyDetailLoading: 'Cargando detalle tecnico...',
          historyDetailEmpty: 'Selecciona una estimacion guardada para revisar el resultado.',
          projectTypeLabel: 'Tipo de proyecto',
          complexityLabel: 'Complejidad',
          modulesLabel: 'Modulos',
          totalHours: 'Horas totales',
          baseHours: 'Base PERT',
          riskBuffer: 'Buffer riesgo',
          timeline: 'Timeline',
          effort: 'Perfil esfuerzo',
          assumptions: 'Supuestos activos',
          moduleBreakdown: 'Desglose por modulo',
          save: 'Guardar snapshot',
          saving: 'Guardando...',
          reset: 'Reiniciar workspace',
          saveSuccess: 'Estimacion guardada correctamente.',
          genericPreviewError: 'No se pudo recalcular la estimacion.',
          genericSaveError: 'No se pudo guardar la estimacion.',
          genericHistoryError: 'No se pudo cargar el historial tecnico.',
          genericHistoryDetailError: 'No se pudo cargar el detalle tecnico seleccionado.',
          moduleValidation: 'Selecciona al menos un modulo para estimar el esfuerzo.',
        }
      : {
          eyebrow: 'Technical estimator',
          title: 'Technical estimation workspace',
          lead:
            'Live tool to read hours, risk, timeline, and dependencies before turning scope into a commercial budget.',
          note:
            'Every change recalculates the technical preview from backend. There is no visible local engine in this flow.',
          empty:
            'Select project, complexity, and modules to see hours, risk buffer, and timeline live.',
          syncing: 'Syncing technical estimate...',
          ready: 'Technical preview synced',
          scenarioTitle: 'Technical scenario',
          modulesTitle: 'Blocks to estimate',
          detailsTitle: 'Technical readout',
          detailsLead:
            'Formula, assumptions, timeline, and per-module breakdown to understand instantly where the effort goes.',
          summaryTitle: 'Live summary',
          summaryLead:
            'Use this rail to read total, risk, timeline, save the snapshot, and review history.',
          historyTitle: 'Technical snapshots',
          historyLead: 'Latest persisted estimates to compare scope decisions.',
          historyEmpty: 'There are no stored estimates yet.',
          historyLoading: 'Loading technical history...',
          historyDetailTitle: 'Stored detail',
          historyDetailLoading: 'Loading stored technical detail...',
          historyDetailEmpty: 'Select a stored estimate to review the result.',
          projectTypeLabel: 'Project type',
          complexityLabel: 'Complexity',
          modulesLabel: 'Modules',
          totalHours: 'Total hours',
          baseHours: 'PERT base',
          riskBuffer: 'Risk buffer',
          timeline: 'Timeline',
          effort: 'Effort profile',
          assumptions: 'Active assumptions',
          moduleBreakdown: 'Module breakdown',
          save: 'Save snapshot',
          saving: 'Saving...',
          reset: 'Reset workspace',
          saveSuccess: 'Estimate saved successfully.',
          genericPreviewError: 'The estimate could not be recalculated.',
          genericSaveError: 'The estimate could not be saved.',
          genericHistoryError: 'The technical history could not be loaded.',
          genericHistoryDetailError: 'The selected technical detail could not be loaded.',
          moduleValidation: 'Select at least one module to estimate effort.',
        },
  );

  readonly projectCards = computed<ChoiceCard[]>(() =>
    QUOTE_PROJECT_TYPE_OPTIONS.map((option) => ({
      id: option.code,
      title: localizeQuoteText(option.label, this.currentLanguage()),
      description: localizeQuoteText(option.description, this.currentLanguage()),
      impact: this.getProjectImpact(option.code),
      selected: option.code === this.estimatorForm.controls.projectType.value,
    })),
  );
  readonly complexityCards = computed<ChoiceCard[]>(() =>
    QUOTE_COMPLEXITY_OPTIONS.map((option) => ({
      id: option.code,
      title: localizeQuoteText(option.label, this.currentLanguage()),
      description: localizeQuoteText(option.description, this.currentLanguage()),
      impact: this.getComplexityImpact(option.code),
      selected: option.code === this.estimatorForm.controls.complexity.value,
    })),
  );
  readonly moduleCards = computed(() =>
    QUOTE_MODULE_OPTIONS.map((option) => ({
      code: option.code,
      label: localizeQuoteText(option.label, this.currentLanguage()),
      note: localizeQuoteText(option.note, this.currentLanguage()),
      selected: Boolean(this.moduleSelection.get(option.code)?.value),
    })),
  );
  readonly selectedModulesCount = computed(() => this.getSelectedModules().length);
  readonly hasPreview = computed(() => Boolean(this.previewPayload() && this.previewResult()));
  readonly canSavePreview = computed(() => this.hasPreview() && !this.saving() && !this.calculating());
  readonly recentHistory = computed(() => this.history().slice(0, 6));
  readonly selectedHistoryResult = computed(() => this.selectedHistoryDetail()?.resultJson ?? null);
  readonly previewStatus = computed(() => {
    if (this.calculating()) {
      return this.content().syncing;
    }

    if (this.formError()) {
      return this.formError();
    }

    if (this.previewHint()) {
      return this.previewHint();
    }

    return this.hasPreview() ? this.content().ready : this.content().empty;
  });
  readonly summaryMetrics = computed(() => {
    const result = this.previewResult();
    return [
      {
        id: 'hours',
        label: this.content().totalHours,
        value: `${safeNumber(result?.totalHours).toFixed(2)} h`,
        note: this.hasPreview() ? this.content().ready : this.previewStatus(),
      },
      {
        id: 'risk',
        label: this.content().riskBuffer,
        value: `${safeNumber(result?.riskBufferHours).toFixed(2)} h`,
        note:
          this.currentLanguage() === 'es'
            ? 'Se agrega una sola vez sobre la base PERT.'
            : 'Added once on top of the PERT base.',
      },
      {
        id: 'timeline',
        label: this.content().timeline,
        value: result ? this.getTimelineLabel(result.totalWeeks, result.totalHours) : '--',
        note: this.getProjectImpact(this.estimatorForm.controls.projectType.value),
      },
      {
        id: 'effort',
        label: this.content().effort,
        value: this.getEffortLabel(result?.totalHours),
        note: `${this.selectedModulesCount()} ${this.content().modulesLabel.toLowerCase()}`,
      },
    ];
  });
  readonly formulaRows = computed(() => {
    const result = this.previewResult();
    if (!result) {
      return [];
    }

    return [
      {
        id: 'base',
        label: this.content().baseHours,
        value: `${safeNumber(result.baseHours).toFixed(2)} h`,
        note:
          this.currentLanguage() === 'es'
            ? 'Suma de modulos usando PERT por bloque.'
            : 'Sum of blocks using PERT per block.',
      },
      {
        id: 'risk',
        label: this.content().riskBuffer,
        value: `${safeNumber(result.riskBufferHours).toFixed(2)} h`,
        note:
          this.currentLanguage() === 'es'
            ? 'Cobertura fija de incertidumbre del escenario.'
            : 'Fixed uncertainty coverage for the scenario.',
      },
      {
        id: 'total',
        label: this.content().totalHours,
        value: `${safeNumber(result.totalHours).toFixed(2)} h`,
        note: result ? this.getTimelineLabel(result.totalWeeks, result.totalHours) : '--',
      },
    ];
  });

  ngOnInit(): void {
    this.observeLiveChanges();
    this.refreshPreview(true);
    this.loadHistory(true);
  }

  selectProjectType(projectType: string): void {
    this.estimatorForm.controls.projectType.setValue(projectType as QuoteRequestPayload['projectType']);
  }

  selectComplexity(complexity: QuoteComplexity): void {
    this.estimatorForm.controls.complexity.setValue(complexity);
  }

  toggleModule(moduleCode: QuoteModuleCode): void {
    const control = this.moduleSelection.get(moduleCode);
    if (!control) {
      return;
    }

    control.setValue(!control.value);
  }

  saveEstimate(): void {
    const payload = this.previewPayload();
    if (!payload) {
      return;
    }

    this.saving.set(true);
    this.formError.set(null);
    this.saveFeedback.set(null);

    this.quoteService
      .saveQuote(payload)
      .pipe(
        finalize(() => this.saving.set(false)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: () => {
          this.previewSaved.set(true);
          this.saveFeedback.set(this.content().saveSuccess);
          this.siteActivityService.trackEstimatorSave();
          this.loadHistory(true);
        },
        error: (error) => {
          this.formError.set(this.resolveErrorMessage(error, this.content().genericSaveError));
        },
      });
  }

  resetWorkspace(): void {
    this.estimatorForm.reset(
      {
        projectType: DEFAULT_QUOTE_PROJECT_TYPE,
        complexity: DEFAULT_QUOTE_COMPLEXITY,
      },
      { emitEvent: false },
    );

    for (const module of QUOTE_MODULE_OPTIONS) {
      this.moduleSelection.get(module.code)?.setValue(DEFAULT_QUOTE_MODULES.includes(module.code), {
        emitEvent: false,
      });
    }

    this.previewSaved.set(false);
    this.saveFeedback.set(null);
    this.formError.set(null);
    this.lastPreviewSignature = null;
    this.refreshPreview(true);
    this.siteActivityService.trackEstimatorReset();
  }

  selectHistoryItem(quoteId: string): void {
    if (this.selectedHistoryId() === quoteId && this.selectedHistoryDetail()?.id === quoteId) {
      return;
    }

    this.selectedHistoryId.set(quoteId);
    this.historyDetailError.set(null);
    this.loadingHistoryDetail.set(true);

    this.quoteService
      .getQuoteById(quoteId)
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

  getProjectLabel(projectType: string): string {
    return (
      this.projectCards().find((option) => option.id === projectType)?.title ??
      projectType.replaceAll('_', ' ')
    );
  }

  getComplexityLabel(complexity: string | null | undefined): string {
    return this.complexityCards().find((option) => option.id === complexity)?.title ?? complexity ?? '';
  }

  getTimelineLabel(totalWeeks: number | null | undefined, fallbackHours?: number | null | undefined): string {
    let weeks = typeof totalWeeks === 'number' && !Number.isNaN(totalWeeks) ? totalWeeks : null;
    if (weeks === null && typeof fallbackHours === 'number' && !Number.isNaN(fallbackHours)) {
      weeks = Math.max(1, Math.round((fallbackHours / 32) * 10) / 10);
    }

    if (weeks === null) {
      return '';
    }

    return this.currentLanguage() === 'es' ? `${weeks} semanas` : `${weeks} weeks`;
  }

  getEffortLabel(totalHours: number | null | undefined): string {
    if (typeof totalHours !== 'number' || Number.isNaN(totalHours)) {
      return '--';
    }

    if (this.currentLanguage() === 'es') {
      if (totalHours < 80) {
        return 'Acotado';
      }
      if (totalHours < 160) {
        return 'Medio';
      }
      return 'Intenso';
    }

    if (totalHours < 80) {
      return 'Focused';
    }
    if (totalHours < 160) {
      return 'Moderate';
    }
    return 'Intensive';
  }

  getEffortShare(hours: number | null | undefined, totalHours: number | null | undefined): string {
    if (
      typeof hours !== 'number' ||
      Number.isNaN(hours) ||
      typeof totalHours !== 'number' ||
      Number.isNaN(totalHours) ||
      totalHours <= 0
    ) {
      return '0%';
    }

    return `${Math.round((hours / totalHours) * 100)}%`;
  }

  getModulePertLabel(item: QuoteResult['items'][number]): string {
    return `PERT ${safeNumber(item.optimisticHours).toFixed(0)} / ${safeNumber(item.probableHours).toFixed(0)} / ${safeNumber(item.pessimisticHours).toFixed(0)} h`;
  }

  getProjectImpact(projectType: string): string {
    if (projectType === 'SAAS_PLATFORM') {
      return this.currentLanguage() === 'es'
        ? 'Suele combinar cuentas, paneles y continuidad operativa.'
        : 'Usually combines accounts, dashboards, and operating continuity.';
    }

    if (projectType === 'ECOMMERCE') {
      return this.currentLanguage() === 'es'
        ? 'Empuja integraciones, pagos y friccion operativa.'
        : 'Pushes integrations, payments, and operating friction.';
    }

    return this.currentLanguage() === 'es'
      ? 'Define la base del alcance tecnico.'
      : 'Defines the base of the technical scope.';
  }

  getComplexityImpact(complexity: string): string {
    if (complexity === 'HIGH') {
      return this.currentLanguage() === 'es'
        ? 'Amplifica horas, riesgo y timeline.'
        : 'Amplifies hours, risk, and timeline.';
    }

    if (complexity === 'LOW') {
      return this.currentLanguage() === 'es'
        ? 'Mantiene la lectura tecnica mas contenida.'
        : 'Keeps the technical readout more contained.';
    }

    return this.currentLanguage() === 'es'
      ? 'Referencia equilibrada para una lectura base.'
      : 'Balanced reference for the baseline readout.';
  }

  trackByCode(_: number, item: { code: string }): string {
    return item.code;
  }

  trackById(_: number, item: { id: string }): string {
    return item.id;
  }

  private observeLiveChanges(): void {
    merge(this.estimatorForm.valueChanges, this.moduleSelection.valueChanges)
      .pipe(
        debounceTime(260),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe(() => {
        this.previewSaved.set(false);
        this.saveFeedback.set(null);
        this.refreshPreview();
      });
  }

  private refreshPreview(force = false): void {
    const payload = this.buildPayload();

    if (payload.modules.length === 0) {
      this.previewPayload.set(null);
      this.previewResult.set(null);
      this.previewHint.set(this.content().moduleValidation);
      this.formError.set(null);
      this.calculating.set(false);
      this.lastPreviewSignature = null;
      return;
    }

    const signature = JSON.stringify(payload);
    if (!force && signature === this.lastPreviewSignature) {
      return;
    }

    this.previewRequestVersion += 1;
    const requestVersion = this.previewRequestVersion;

    this.previewHint.set(null);
    this.formError.set(null);
    this.calculating.set(true);

    this.quoteService
      .previewQuote(payload)
      .pipe(
        finalize(() => {
          if (requestVersion === this.previewRequestVersion) {
            this.calculating.set(false);
          }
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: (preview) => {
          if (requestVersion !== this.previewRequestVersion) {
            return;
          }

          this.previewPayload.set(payload);
          this.previewResult.set(preview);
          this.lastPreviewSignature = signature;
        },
        error: (error) => {
          if (requestVersion !== this.previewRequestVersion) {
            return;
          }

          this.previewPayload.set(null);
          this.previewResult.set(null);
          this.formError.set(this.resolveErrorMessage(error, this.content().genericPreviewError));
        },
      });
  }

  private loadHistory(selectLatest: boolean): void {
    this.loadingHistory.set(true);
    this.historyError.set(null);

    this.quoteService
      .getQuotes()
      .pipe(
        finalize(() => this.loadingHistory.set(false)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: (quotes) => {
          this.history.set(quotes);

          if (quotes.length === 0) {
            this.selectedHistoryId.set(null);
            this.selectedHistoryDetail.set(null);
            return;
          }

          const selectedId = this.selectedHistoryId();
          const activeId =
            selectLatest || !selectedId || !quotes.some((quote) => quote.id === selectedId)
              ? quotes[0].id
              : selectedId;

          this.selectHistoryItem(activeId);
        },
        error: (error) => {
          this.historyError.set(this.resolveErrorMessage(error, this.content().genericHistoryError));
        },
      });
  }

  private buildPayload(): QuoteRequestPayload {
    return {
      projectType: this.estimatorForm.controls.projectType.value,
      complexity: this.estimatorForm.controls.complexity.value,
      modules: this.getSelectedModules(),
    };
  }

  private getSelectedModules(): QuoteModuleCode[] {
    return QUOTE_MODULE_OPTIONS.map((module) => module.code).filter((moduleCode) =>
      this.moduleSelection.get(moduleCode)?.value,
    );
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
