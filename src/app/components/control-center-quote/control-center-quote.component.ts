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
  selector: 'app-control-center-quote',
  standalone: false,
  templateUrl: './control-center-quote.component.html',
  styleUrl: './control-center-quote.component.scss',
})
export class ControlCenterQuoteComponent implements OnInit {
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
  readonly quoteForm = this.formBuilder.nonNullable.group({
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
          eyebrow: 'Cotizador',
          title: 'Preview + guardado controlado',
          lead:
            'Primero calcula una vista previa. Solo se persiste cuando decides guardarla en el backend.',
          workflowNote:
            'Preview local alineado a las reglas activas. El historial solo muestra cotizaciones guardadas.',
          formTitle: 'Configurar estimacion',
          formLead: 'Selecciona tipo de proyecto, complejidad y modulos para preparar una cotizacion.',
          projectTypeLabel: 'Tipo de proyecto',
          complexityLabel: 'Complejidad',
          modulesLabel: 'Modulos incluidos',
          selectedModulesLabel: 'seleccionados',
          calculateLabel: 'Calcular preview',
          previewReadyLabel: 'Preview listo',
          calculatingLabel: 'Calculando...',
          saveLabel: 'Guardar cotizacion',
          savingLabel: 'Guardando...',
          newLabel: 'Nueva cotizacion',
          discardLabel: 'Descartar',
          previewStatusLabel: 'Preview sin guardar',
          savedStatusLabel: 'Guardada en historial',
          resultTitle: 'Resultado actual',
          resultLead: 'Revisa horas, costo y desglose antes de persistir.',
          resultEmpty: 'Calcula un preview para revisar la cotizacion antes de guardarla.',
          resultLoading: 'Preparando preview de horas y costo total...',
          resultProjectLabel: 'Proyecto',
          resultComplexityLabel: 'Complejidad',
          resultTotalHoursLabel: 'Horas totales',
          resultTotalCostLabel: 'Costo total',
          resultHourlyRateLabel: 'Tarifa',
          breakdownTitle: 'Desglose por item',
          historyTitle: 'Historial reciente',
          historyLead: 'Solo aparecen cotizaciones guardadas desde este Centro de Mando.',
          historyEmpty: 'Todavia no hay cotizaciones guardadas.',
          historyLoading: 'Cargando historial de cotizaciones...',
          historyDetailTitle: 'Detalle guardado',
          historyDetailLoading: 'Cargando detalle guardado...',
          historyDetailEmpty: 'Selecciona una cotizacion guardada para revisar su desglose.',
          saveSuccess: 'Cotizacion guardada correctamente en el historial.',
          moduleValidationMessage: 'Selecciona al menos un modulo para calcular la cotizacion.',
          genericSaveError: 'No se pudo guardar la cotizacion. Intenta nuevamente.',
          genericHistoryError: 'No se pudo cargar el historial de cotizaciones.',
          genericHistoryDetailError: 'No se pudo cargar el detalle de la cotizacion seleccionada.',
        }
      : {
          eyebrow: 'Quote Engine',
          title: 'Preview + controlled persistence',
          lead:
            'First calculate a preview. It is only persisted when you explicitly save it through the backend.',
          workflowNote:
            'Local preview aligned with the active rules. History only shows stored quotes.',
          formTitle: 'Configure estimate',
          formLead: 'Select project type, complexity, and modules to prepare a quote.',
          projectTypeLabel: 'Project type',
          complexityLabel: 'Complexity',
          modulesLabel: 'Included modules',
          selectedModulesLabel: 'selected',
          calculateLabel: 'Calculate preview',
          previewReadyLabel: 'Preview ready',
          calculatingLabel: 'Calculating...',
          saveLabel: 'Save quote',
          savingLabel: 'Saving...',
          newLabel: 'New quote',
          discardLabel: 'Discard',
          previewStatusLabel: 'Preview not saved',
          savedStatusLabel: 'Stored in history',
          resultTitle: 'Current result',
          resultLead: 'Review hours, cost, and breakdown before persisting it.',
          resultEmpty: 'Calculate a preview to review the quote before saving it.',
          resultLoading: 'Preparing preview hours and total cost...',
          resultProjectLabel: 'Project',
          resultComplexityLabel: 'Complexity',
          resultTotalHoursLabel: 'Total hours',
          resultTotalCostLabel: 'Total cost',
          resultHourlyRateLabel: 'Hourly rate',
          breakdownTitle: 'Item breakdown',
          historyTitle: 'Recent history',
          historyLead: 'Only quotes explicitly saved from this Control Center appear here.',
          historyEmpty: 'There are no stored quotes yet.',
          historyLoading: 'Loading quote history...',
          historyDetailTitle: 'Stored detail',
          historyDetailLoading: 'Loading stored quote detail...',
          historyDetailEmpty: 'Select a stored quote to review its breakdown.',
          saveSuccess: 'Quote stored successfully in history.',
          moduleValidationMessage: 'Select at least one module to calculate a quote.',
          genericSaveError: 'The quote could not be saved. Try again.',
          genericHistoryError: 'The quote history could not be loaded.',
          genericHistoryDetailError: 'The selected quote detail could not be loaded.',
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
      (option) => option.code === this.quoteForm.controls.projectType.value,
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

  submitQuote(): void {
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
      this.siteActivityService.trackQuotePreview();
    } finally {
      this.calculating.set(false);
    }
  }

  saveQuote(): void {
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
          this.siteActivityService.trackQuoteSave();
          this.loadHistory(true);
        },
        error: (error) => {
          this.formError.set(this.resolveErrorMessage(error, this.content().genericSaveError));
        },
      });
  }

  startNewQuote(): void {
    this.resetFormState([]);
    this.previewPayload.set(null);
    this.previewResult.set(null);
    this.previewSaved.set(false);
    this.formError.set(null);
    this.saveFeedback.set(null);
    this.unlockBuilder();
    this.siteActivityService.trackQuoteReset();
  }

  discardPreview(): void {
    this.previewPayload.set(null);
    this.previewResult.set(null);
    this.previewSaved.set(false);
    this.formError.set(null);
    this.saveFeedback.set(null);
    this.unlockBuilder();
    this.siteActivityService.trackQuoteDiscard();
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
      projectType: this.quoteForm.controls.projectType.value,
      complexity: this.quoteForm.controls.complexity.value,
      modules: this.getSelectedModules(),
    };
  }

  private getSelectedModules(): QuoteModuleCode[] {
    return QUOTE_MODULE_OPTIONS.map((module) => module.code).filter((moduleCode) =>
      this.moduleSelection.get(moduleCode)?.value,
    );
  }

  private resetFormState(selectedModules: QuoteModuleCode[]): void {
    this.quoteForm.reset(
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
    this.quoteForm.disable({ emitEvent: false });
    this.moduleSelection.disable({ emitEvent: false });
  }

  private unlockBuilder(): void {
    this.quoteForm.enable({ emitEvent: false });
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
