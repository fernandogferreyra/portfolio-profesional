import { HttpErrorResponse } from '@angular/common/http';
import { Component, DestroyRef, OnInit, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder } from '@angular/forms';
import { finalize } from 'rxjs';

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
import { QuotePreviewService } from '../../services/quote-preview.service';
import { QuoteService } from '../../services/quote.service';
import { SiteActivityService } from '../../services/site-activity.service';

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
  private readonly quotePreviewService = inject(QuotePreviewService);
  private readonly quoteService = inject(QuoteService);
  private readonly siteActivityService = inject(SiteActivityService);

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
          eyebrow: 'Estimador',
          title: 'Estimacion tecnica conectada al backend',
          lead:
            'Herramienta tecnica para anticipar horas, esfuerzo por modulos y tiempo aproximado antes de planificar ejecucion.',
          workflowNote:
            'El preview tecnico replica las reglas activas. Guardar crea un snapshot util para planificacion y referencia.',
          formTitle: 'Modelar esfuerzo tecnico',
          formLead:
            'Selecciona tipo de proyecto, complejidad y modulos para estimar alcance, horas y tiempos de trabajo.',
          projectTypeLabel: 'Tipo de proyecto',
          complexityLabel: 'Complejidad tecnica',
          modulesLabel: 'Modulos estimados',
          selectedModulesLabel: 'seleccionados',
          modulesCountLabel: 'Modulos',
          calculateLabel: 'Calcular estimacion',
          previewReadyLabel: 'Preview tecnico listo',
          calculatingLabel: 'Estimando...',
          saveLabel: 'Guardar estimacion',
          savingLabel: 'Guardando...',
          newLabel: 'Nueva estimacion',
          discardLabel: 'Descartar',
          previewStatusLabel: 'Preview tecnico',
          savedStatusLabel: 'Snapshot guardado',
          resultTitle: 'Resultado tecnico',
          resultLead: 'Lectura tecnica del esfuerzo antes de pasar a presupuesto comercial.',
          resultEmpty: 'Calcula una estimacion para revisar horas, esfuerzo y tiempo aproximado.',
          resultLoading: 'Calculando horas, esfuerzo y timeline tecnico...',
          resultProjectLabel: 'Proyecto',
          resultComplexityLabel: 'Complejidad',
          resultEffortLabel: 'Esfuerzo',
          resultTotalHoursLabel: 'Horas totales',
          resultModulesLabel: 'Modulos',
          resultTimelineLabel: 'Tiempo aprox.',
          breakdownTitle: 'Esfuerzo por modulo',
          effortShareLabel: 'del esfuerzo',
          historyTitle: 'Historial tecnico',
          historyLead: 'Snapshots tecnicos guardados para comparar decisiones de alcance y esfuerzo.',
          historyEmpty: 'Todavia no hay estimaciones guardadas.',
          historyLoading: 'Cargando historial tecnico...',
          historyDetailTitle: 'Detalle tecnico guardado',
          historyDetailLoading: 'Cargando detalle tecnico...',
          historyDetailEmpty: 'Selecciona una estimacion guardada para revisar su desglose.',
          saveSuccess: 'Estimacion tecnica guardada correctamente.',
          moduleValidationMessage: 'Selecciona al menos un modulo para estimar el esfuerzo.',
          genericSaveError: 'No se pudo guardar la estimacion. Intenta nuevamente.',
          genericHistoryError: 'No se pudo cargar el historial tecnico.',
          genericHistoryDetailError: 'No se pudo cargar el detalle tecnico seleccionado.',
        }
      : {
          eyebrow: 'Estimator',
          title: 'Technical estimation connected to the backend',
          lead:
            'Technical tool to anticipate hours, module effort, and approximate timeline before planning execution.',
          workflowNote:
            'The technical preview mirrors active rules. Saving stores a snapshot for planning and reference.',
          formTitle: 'Model technical effort',
          formLead:
            'Select project type, complexity, and modules to estimate scope, hours, and delivery timing.',
          projectTypeLabel: 'Project type',
          complexityLabel: 'Technical complexity',
          modulesLabel: 'Estimated modules',
          selectedModulesLabel: 'selected',
          modulesCountLabel: 'Modules',
          calculateLabel: 'Calculate estimate',
          previewReadyLabel: 'Technical preview ready',
          calculatingLabel: 'Estimating...',
          saveLabel: 'Save estimate',
          savingLabel: 'Saving...',
          newLabel: 'New estimate',
          discardLabel: 'Discard',
          previewStatusLabel: 'Technical preview',
          savedStatusLabel: 'Snapshot stored',
          resultTitle: 'Technical result',
          resultLead: 'Technical reading of effort before moving into commercial pricing.',
          resultEmpty: 'Calculate an estimate to review hours, effort, and approximate timing.',
          resultLoading: 'Calculating hours, effort, and technical timeline...',
          resultProjectLabel: 'Project',
          resultComplexityLabel: 'Complexity',
          resultEffortLabel: 'Effort',
          resultTotalHoursLabel: 'Total hours',
          resultModulesLabel: 'Modules',
          resultTimelineLabel: 'Approx. time',
          breakdownTitle: 'Module effort',
          effortShareLabel: 'of effort',
          historyTitle: 'Technical history',
          historyLead: 'Stored technical snapshots to compare scope and effort decisions.',
          historyEmpty: 'There are no saved estimates yet.',
          historyLoading: 'Loading technical history...',
          historyDetailTitle: 'Stored technical detail',
          historyDetailLoading: 'Loading stored technical detail...',
          historyDetailEmpty: 'Select a saved estimate to review its breakdown.',
          saveSuccess: 'Technical estimate saved successfully.',
          moduleValidationMessage: 'Select at least one module to estimate effort.',
          genericSaveError: 'The estimate could not be saved. Try again.',
          genericHistoryError: 'The technical history could not be loaded.',
          genericHistoryDetailError: 'The selected technical detail could not be loaded.',
        },
  );

  readonly projectOptions = computed(() =>
    QUOTE_PROJECT_TYPE_OPTIONS.map((option) => ({
      code: option.code,
      label: localizeQuoteText(option.label, this.currentLanguage()),
      description: localizeQuoteText(option.description, this.currentLanguage()),
    })),
  );
  readonly complexityOptions = computed(() =>
    QUOTE_COMPLEXITY_OPTIONS.map((option) => ({
      code: option.code,
      label: localizeQuoteText(option.label, this.currentLanguage()),
      description: localizeQuoteText(option.description, this.currentLanguage()),
    })),
  );
  readonly moduleOptions = computed(() =>
    QUOTE_MODULE_OPTIONS.map((option) => ({
      code: option.code,
      label: localizeQuoteText(option.label, this.currentLanguage()),
      note: localizeQuoteText(option.note, this.currentLanguage()),
    })),
  );
  readonly selectedModulesCount = computed(() => this.getSelectedModules().length);
  readonly recentHistory = computed(() => this.history().slice(0, 6));
  readonly selectedHistoryResult = computed(() => this.selectedHistoryDetail()?.resultJson ?? null);
  readonly selectedProjectHint = computed(() => {
    const selectedProject = this.projectOptions().find(
      (option) => option.code === this.estimatorForm.controls.projectType.value,
    );
    return selectedProject?.description ?? '';
  });
  readonly hasPreview = computed(() => Boolean(this.previewPayload() && this.previewResult()));
  readonly canSavePreview = computed(
    () => this.hasPreview() && !this.previewSaved() && !this.saving(),
  );
  readonly isBuilderLocked = computed(() => this.hasPreview());
  readonly previewStatus = computed(() =>
    this.previewSaved() ? this.content().savedStatusLabel : this.content().previewStatusLabel,
  );

  ngOnInit(): void {
    this.loadHistory(true);
  }

  submitEstimate(): void {
    const payload = this.buildPayload();

    if (payload.modules.length === 0) {
      this.formError.set(this.content().moduleValidationMessage);
      return;
    }

    this.formError.set(null);
    this.saveFeedback.set(null);
    this.calculating.set(true);

    try {
      const preview = this.quotePreviewService.previewQuote(payload);
      this.previewPayload.set(payload);
      this.previewResult.set(preview);
      this.previewSaved.set(false);
      this.lockBuilder();
      this.siteActivityService.trackEstimatorPreview();
    } finally {
      this.calculating.set(false);
    }
  }

  saveEstimate(): void {
    const payload = this.previewPayload();

    if (!payload || this.previewSaved()) {
      return;
    }

    this.formError.set(null);
    this.saveFeedback.set(null);
    this.saving.set(true);

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

  startNewEstimate(): void {
    this.resetFormState([]);
    this.previewPayload.set(null);
    this.previewResult.set(null);
    this.previewSaved.set(false);
    this.formError.set(null);
    this.saveFeedback.set(null);
    this.unlockBuilder();
    this.siteActivityService.trackEstimatorReset();
  }

  discardPreview(): void {
    this.previewPayload.set(null);
    this.previewResult.set(null);
    this.previewSaved.set(false);
    this.formError.set(null);
    this.saveFeedback.set(null);
    this.unlockBuilder();
    this.siteActivityService.trackEstimatorDiscard();
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

  isModuleSelected(moduleCode: string): boolean {
    return Boolean(this.moduleSelection.get(moduleCode)?.value);
  }

  getProjectLabel(projectType: string): string {
    return (
      this.projectOptions().find((option) => option.code === projectType)?.label ??
      projectType.replaceAll('_', ' ')
    );
  }

  getComplexityLabel(complexity: string | null | undefined): string {
    return (
      this.complexityOptions().find((option) => option.code === complexity)?.label ?? complexity ?? ''
    );
  }

  getTimelineLabel(totalHours: number | null | undefined): string {
    if (typeof totalHours !== 'number' || Number.isNaN(totalHours)) {
      return '';
    }

    const weeks = totalHours / 32;
    const roundedWeeks = Math.max(1, Math.round(weeks * 10) / 10);

    if (this.currentLanguage() === 'es') {
      return `${roundedWeeks} semanas`;
    }

    return `${roundedWeeks} weeks`;
  }

  getEffortLabel(totalHours: number | null | undefined): string {
    if (typeof totalHours !== 'number' || Number.isNaN(totalHours)) {
      return '';
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

  trackByCode(_: number, item: { code: string }): string {
    return item.code;
  }

  trackById(_: number, item: QuoteAdminSummary): string {
    return item.id;
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

          const selectedHistoryId = this.selectedHistoryId();
          const activeId =
            selectLatest || !selectedHistoryId || !quotes.some((quote) => quote.id === selectedHistoryId)
              ? quotes[0].id
              : selectedHistoryId;

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

  private resetFormState(selectedModules: QuoteModuleCode[]): void {
    this.estimatorForm.reset(
      {
        projectType: DEFAULT_QUOTE_PROJECT_TYPE,
        complexity: DEFAULT_QUOTE_COMPLEXITY,
      },
      { emitEvent: false },
    );

    for (const module of QUOTE_MODULE_OPTIONS) {
      this.moduleSelection.get(module.code)?.setValue(
        selectedModules.includes(module.code),
        { emitEvent: false },
      );
    }
  }

  private lockBuilder(): void {
    this.estimatorForm.disable({ emitEvent: false });
    this.moduleSelection.disable({ emitEvent: false });
  }

  private unlockBuilder(): void {
    this.estimatorForm.enable({ emitEvent: false });
    this.moduleSelection.enable({ emitEvent: false });
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
