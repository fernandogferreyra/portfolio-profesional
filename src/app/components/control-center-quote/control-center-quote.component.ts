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
  localizeQuoteText,
} from '../../models/quote.models';
import { LanguageService } from '../../services/language.service';
import { QuoteService } from '../../services/quote.service';

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
  private readonly quoteService = inject(QuoteService);

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
  readonly loadingHistory = signal(false);
  readonly loadingHistoryDetail = signal(false);
  readonly formError = signal<string | null>(null);
  readonly historyError = signal<string | null>(null);
  readonly historyDetailError = signal<string | null>(null);
  readonly latestResult = signal<QuoteAdminDetail['resultJson']>(null);
  readonly history = signal<QuoteAdminSummary[]>([]);
  readonly selectedHistoryId = signal<string | null>(null);
  readonly selectedHistoryDetail = signal<QuoteAdminDetail | null>(null);

  readonly content = computed(() =>
    this.currentLanguage() === 'es'
      ? {
          eyebrow: 'Cotizador',
          title: 'Cotizacion privada conectada al backend',
          lead:
            'Calcula horas, costo y desglose usando el motor real de quotes. Todo queda guardado y visible en el historial del admin.',
          formTitle: 'Configurar estimacion',
          formLead: 'Selecciona tipo de proyecto, complejidad y modulos para generar una cotizacion inicial.',
          projectTypeLabel: 'Tipo de proyecto',
          complexityLabel: 'Complejidad',
          modulesLabel: 'Modulos incluidos',
          selectedModulesLabel: 'seleccionados',
          calculateLabel: 'Calcular cotizacion',
          calculatingLabel: 'Calculando...',
          resultTitle: 'Resultado actual',
          resultLead: 'Desglose generado a partir del backend de cotizaciones.',
          resultEmpty: 'Todavia no generaste una cotizacion en esta sesion.',
          resultLoading: 'Calculando desglose y costo total...',
          resultProjectLabel: 'Proyecto',
          resultComplexityLabel: 'Complejidad',
          resultTotalHoursLabel: 'Horas totales',
          resultTotalCostLabel: 'Costo total',
          resultHourlyRateLabel: 'Tarifa',
          breakdownTitle: 'Desglose por item',
          historyTitle: 'Historial reciente',
          historyLead: 'Resumen de cotizaciones guardadas para el admin.',
          historyEmpty: 'Todavia no hay cotizaciones guardadas.',
          historyLoading: 'Cargando historial de cotizaciones...',
          historyDetailTitle: 'Detalle guardado',
          historyDetailLoading: 'Cargando detalle guardado...',
          historyDetailEmpty: 'Selecciona una cotizacion del historial para revisar su desglose.',
          moduleValidationMessage: 'Selecciona al menos un modulo para calcular la cotizacion.',
          genericGenerateError: 'No se pudo calcular la cotizacion. Intenta nuevamente.',
          genericHistoryError: 'No se pudo cargar el historial de cotizaciones.',
          genericHistoryDetailError: 'No se pudo cargar el detalle de la cotizacion seleccionada.',
        }
      : {
          eyebrow: 'Quote Engine',
          title: 'Private quote module connected to the backend',
          lead:
            'Estimate hours, cost, and breakdown using the real quote engine. Every result is stored and exposed in admin history.',
          formTitle: 'Configure estimate',
          formLead: 'Select project type, complexity, and modules to generate an initial quote.',
          projectTypeLabel: 'Project type',
          complexityLabel: 'Complexity',
          modulesLabel: 'Included modules',
          selectedModulesLabel: 'selected',
          calculateLabel: 'Calculate quote',
          calculatingLabel: 'Calculating...',
          resultTitle: 'Current result',
          resultLead: 'Breakdown generated from the backend quote engine.',
          resultEmpty: 'You have not generated a quote in this session yet.',
          resultLoading: 'Calculating breakdown and total cost...',
          resultProjectLabel: 'Project',
          resultComplexityLabel: 'Complexity',
          resultTotalHoursLabel: 'Total hours',
          resultTotalCostLabel: 'Total cost',
          resultHourlyRateLabel: 'Hourly rate',
          breakdownTitle: 'Item breakdown',
          historyTitle: 'Recent history',
          historyLead: 'Summary of stored quotes available to the admin.',
          historyEmpty: 'There are no stored quotes yet.',
          historyLoading: 'Loading quote history...',
          historyDetailTitle: 'Stored detail',
          historyDetailLoading: 'Loading stored quote detail...',
          historyDetailEmpty: 'Select a quote from history to review its breakdown.',
          moduleValidationMessage: 'Select at least one module to calculate a quote.',
          genericGenerateError: 'The quote could not be calculated. Try again.',
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

  ngOnInit(): void {
    this.loadHistory(true);
  }

  submitQuote(): void {
    const selectedModules = this.getSelectedModules();

    if (selectedModules.length === 0) {
      this.formError.set(this.content().moduleValidationMessage);
      return;
    }

    this.formError.set(null);
    this.calculating.set(true);

    this.quoteService
      .generateQuote({
        projectType: this.quoteForm.controls.projectType.value,
        complexity: this.quoteForm.controls.complexity.value,
        modules: selectedModules,
      })
      .pipe(
        finalize(() => this.calculating.set(false)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: (result) => {
          this.latestResult.set(result);
          this.loadHistory(true);
        },
        error: (error) => {
          this.formError.set(this.resolveErrorMessage(error, this.content().genericGenerateError));
        },
      });
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
