import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormBuilder } from '@angular/forms';

import {
  COMMERCIAL_EXTRA_OPTIONS,
  COMMERCIAL_SCOPE_OPTIONS,
  COMMERCIAL_STACK_OPTIONS,
  DEFAULT_COMMERCIAL_SCOPE,
  DEFAULT_COMMERCIAL_STACK,
} from '../../data/commercial-quote.data';
import {
  CommercialQuoteExtra,
  CommercialQuoteRecord,
  CommercialQuoteRequest,
  localizeCommercialText,
} from '../../models/commercial-quote.models';
import { CommercialQuoteService } from '../../services/commercial-quote.service';
import { LanguageService } from '../../services/language.service';
import { SiteActivityService } from '../../services/site-activity.service';

@Component({
  selector: 'app-control-center-quote',
  standalone: false,
  templateUrl: './control-center-quote.component.html',
  styleUrl: './control-center-quote.component.scss',
})
export class ControlCenterQuoteComponent implements OnInit {
  private readonly formBuilder = inject(FormBuilder);
  private readonly languageService = inject(LanguageService);
  private readonly commercialQuoteService = inject(CommercialQuoteService);
  private readonly siteActivityService = inject(SiteActivityService);

  readonly currentLanguage = this.languageService.language;
  readonly historyError = this.commercialQuoteService.storageError;
  readonly history = this.commercialQuoteService.history;
  readonly extraSelection = this.formBuilder.record(
    Object.fromEntries(
      COMMERCIAL_EXTRA_OPTIONS.map((extra) => [
        extra.code,
        this.formBuilder.nonNullable.control(false),
      ]),
    ),
  );
  readonly quoteForm = this.formBuilder.nonNullable.group({
    scope: this.formBuilder.nonNullable.control(DEFAULT_COMMERCIAL_SCOPE),
    stack: this.formBuilder.nonNullable.control(DEFAULT_COMMERCIAL_STACK),
    support: this.formBuilder.nonNullable.control(false),
    maintenance: this.formBuilder.nonNullable.control(false),
  });

  readonly calculating = signal(false);
  readonly saving = signal(false);
  readonly formError = signal<string | null>(null);
  readonly saveFeedback = signal<string | null>(null);
  readonly previewPayload = signal<CommercialQuoteRequest | null>(null);
  readonly previewResult = signal<CommercialQuoteRecord['result'] | null>(null);
  readonly previewSaved = signal(false);
  readonly selectedHistoryId = signal<string | null>(null);
  readonly selectedHistoryRecord = signal<CommercialQuoteRecord | null>(null);

  readonly content = computed(() =>
    this.currentLanguage() === 'es'
      ? {
          eyebrow: 'Cotizador',
          title: 'Presupuesto comercial separado del esfuerzo tecnico',
          lead:
            'Herramienta comercial para definir cuanto cobrar, extras, soporte y mantenimiento sin mezclarlo con la estimacion tecnica.',
          workflowNote:
            'El preview comercial es local y controlado. Guardar agrega una cotizacion al historial comercial del admin.',
          formTitle: 'Modelar propuesta economica',
          formLead:
            'Define alcance, stack propuesto, extras y servicios recurrentes para armar un presupuesto claro.',
          scopeLabel: 'Alcance',
          stackLabel: 'Tecnologia / stack',
          supportLabel: 'Soporte',
          maintenanceLabel: 'Mantenimiento',
          extrasLabel: 'Extras comerciales',
          selectedExtrasLabel: 'extras',
          supportEnabled: 'Incluido',
          supportDisabled: 'Sin soporte',
          maintenanceEnabled: 'Incluido',
          maintenanceDisabled: 'Sin mantenimiento',
          calculateLabel: 'Calcular presupuesto',
          previewReadyLabel: 'Preview comercial listo',
          calculatingLabel: 'Calculando...',
          saveLabel: 'Guardar cotizacion',
          savingLabel: 'Guardando...',
          newLabel: 'Nueva cotizacion',
          discardLabel: 'Descartar',
          previewStatusLabel: 'Preview comercial',
          savedStatusLabel: 'Cotizacion guardada',
          resultTitle: 'Resultado economico',
          resultLead: 'Lectura comercial: monto inicial, retainer mensual y ventana de entrega.',
          resultEmpty: 'Calcula un preview comercial para revisar la propuesta economica.',
          resultLoading: 'Calculando presupuesto y retainer...',
          resultScopeLabel: 'Alcance',
          resultStackLabel: 'Stack',
          resultOneTimeLabel: 'Presupuesto inicial',
          resultMonthlyLabel: 'Mensual sugerido',
          resultTimelineLabel: 'Entrega sugerida',
          breakdownTitle: 'Detalle economico',
          cadenceOneTime: 'one-shot',
          cadenceMonthly: 'mensual',
          noMonthly: 'Sin retainer',
          historyTitle: 'Historial comercial',
          historyLead: 'Cotizaciones comerciales guardadas desde este Centro de Mando.',
          historyEmpty: 'Todavia no hay cotizaciones comerciales guardadas.',
          historyDetailTitle: 'Detalle guardado',
          historyDetailEmpty: 'Selecciona una cotizacion comercial para revisar su desglose.',
          saveSuccess: 'Cotizacion comercial guardada correctamente.',
          genericError: 'No se pudo calcular la cotizacion comercial.',
        }
      : {
          eyebrow: 'Quote Builder',
          title: 'Commercial pricing separated from technical effort',
          lead:
            'Commercial tool to define how much to charge, add-ons, support, and maintenance without mixing it with technical estimation.',
          workflowNote:
            'The commercial preview is local and controlled. Saving adds a quote to the admin commercial history.',
          formTitle: 'Model pricing proposal',
          formLead:
            'Define scope, proposed stack, add-ons, and recurring services to build a clear commercial quote.',
          scopeLabel: 'Scope',
          stackLabel: 'Technology / stack',
          supportLabel: 'Support',
          maintenanceLabel: 'Maintenance',
          extrasLabel: 'Commercial add-ons',
          selectedExtrasLabel: 'extras',
          supportEnabled: 'Included',
          supportDisabled: 'No support',
          maintenanceEnabled: 'Included',
          maintenanceDisabled: 'No maintenance',
          calculateLabel: 'Calculate quote',
          previewReadyLabel: 'Commercial preview ready',
          calculatingLabel: 'Calculating...',
          saveLabel: 'Save quote',
          savingLabel: 'Saving...',
          newLabel: 'New quote',
          discardLabel: 'Discard',
          previewStatusLabel: 'Commercial preview',
          savedStatusLabel: 'Quote stored',
          resultTitle: 'Commercial result',
          resultLead: 'Commercial readout: initial amount, monthly retainer, and delivery window.',
          resultEmpty: 'Calculate a commercial preview to review the pricing proposal.',
          resultLoading: 'Calculating quote and monthly retainer...',
          resultScopeLabel: 'Scope',
          resultStackLabel: 'Stack',
          resultOneTimeLabel: 'Initial budget',
          resultMonthlyLabel: 'Suggested monthly',
          resultTimelineLabel: 'Suggested delivery',
          breakdownTitle: 'Commercial breakdown',
          cadenceOneTime: 'one-shot',
          cadenceMonthly: 'monthly',
          noMonthly: 'No retainer',
          historyTitle: 'Commercial history',
          historyLead: 'Commercial quotes saved from this Control Center.',
          historyEmpty: 'There are no saved commercial quotes yet.',
          historyDetailTitle: 'Stored detail',
          historyDetailEmpty: 'Select a commercial quote to review its breakdown.',
          saveSuccess: 'Commercial quote saved successfully.',
          genericError: 'The commercial quote could not be calculated.',
        },
  );

  readonly scopeOptions = computed(() =>
    COMMERCIAL_SCOPE_OPTIONS.map((option) => ({
      code: option.code,
      label: localizeCommercialText(option.label, this.currentLanguage()),
      description: localizeCommercialText(option.description, this.currentLanguage()),
    })),
  );
  readonly stackOptions = computed(() =>
    COMMERCIAL_STACK_OPTIONS.map((option) => ({
      code: option.code,
      label: localizeCommercialText(option.label, this.currentLanguage()),
      description: localizeCommercialText(option.description, this.currentLanguage()),
    })),
  );
  readonly extraOptions = computed(() =>
    COMMERCIAL_EXTRA_OPTIONS.map((option) => ({
      code: option.code,
      label: localizeCommercialText(option.label, this.currentLanguage()),
      note: localizeCommercialText(option.note, this.currentLanguage()),
    })),
  );
  readonly selectedExtrasCount = computed(() => this.getSelectedExtras().length);
  readonly recentHistory = computed(() => this.history().slice(0, 6));
  readonly hasPreview = computed(() => Boolean(this.previewPayload() && this.previewResult()));
  readonly canSavePreview = computed(
    () => this.hasPreview() && !this.previewSaved() && !this.saving(),
  );
  readonly isBuilderLocked = computed(() => this.hasPreview());
  readonly previewStatus = computed(() =>
    this.previewSaved() ? this.content().savedStatusLabel : this.content().previewStatusLabel,
  );
  readonly selectedHistoryResult = computed(() => this.selectedHistoryRecord()?.result ?? null);
  readonly selectedScopeHint = computed(() => {
    const selectedScope = this.scopeOptions().find(
      (option) => option.code === this.quoteForm.controls.scope.value,
    );
    return selectedScope?.description ?? '';
  });

  ngOnInit(): void {
    const latestRecord = this.recentHistory()[0] ?? null;
    this.selectedHistoryRecord.set(latestRecord);
    this.selectedHistoryId.set(latestRecord?.id ?? null);
  }

  submitQuote(): void {
    const payload = this.buildPayload();

    this.formError.set(null);
    this.saveFeedback.set(null);
    this.calculating.set(true);

    try {
      const preview = this.commercialQuoteService.previewQuote(payload);
      this.previewPayload.set(payload);
      this.previewResult.set(preview);
      this.previewSaved.set(false);
      this.lockBuilder();
      this.siteActivityService.trackCommercialQuotePreview();
    } catch {
      this.formError.set(this.content().genericError);
    } finally {
      this.calculating.set(false);
    }
  }

  saveQuote(): void {
    const payload = this.previewPayload();
    const preview = this.previewResult();

    if (!payload || !preview || this.previewSaved()) {
      return;
    }

    this.saving.set(true);
    this.formError.set(null);
    this.saveFeedback.set(null);

    try {
      const record = this.commercialQuoteService.saveQuote(payload, preview);
      this.previewSaved.set(true);
      this.selectedHistoryId.set(record.id);
      this.selectedHistoryRecord.set(record);
      this.saveFeedback.set(this.content().saveSuccess);
      this.siteActivityService.trackCommercialQuoteSave();
    } finally {
      this.saving.set(false);
    }
  }

  startNewQuote(): void {
    this.resetFormState([]);
    this.previewPayload.set(null);
    this.previewResult.set(null);
    this.previewSaved.set(false);
    this.formError.set(null);
    this.saveFeedback.set(null);
    this.unlockBuilder();
    this.siteActivityService.trackCommercialQuoteReset();
  }

  discardPreview(): void {
    this.previewPayload.set(null);
    this.previewResult.set(null);
    this.previewSaved.set(false);
    this.formError.set(null);
    this.saveFeedback.set(null);
    this.unlockBuilder();
    this.siteActivityService.trackCommercialQuoteDiscard();
  }

  selectHistoryItem(recordId: string): void {
    this.selectedHistoryId.set(recordId);
    this.selectedHistoryRecord.set(this.commercialQuoteService.getQuoteById(recordId));
  }

  isExtraSelected(extraCode: string): boolean {
    return Boolean(this.extraSelection.get(extraCode)?.value);
  }

  getScopeLabel(scope: string): string {
    return (
      this.scopeOptions().find((option) => option.code === scope)?.label ?? scope.replaceAll('_', ' ')
    );
  }

  getStackLabel(stack: string): string {
    return (
      this.stackOptions().find((option) => option.code === stack)?.label ?? stack.replaceAll('_', ' ')
    );
  }

  getCadenceLabel(cadence: 'one_time' | 'monthly'): string {
    return cadence === 'monthly' ? this.content().cadenceMonthly : this.content().cadenceOneTime;
  }

  formatCurrency(value: number): string {
    return new Intl.NumberFormat(this.currentLanguage() === 'es' ? 'es-AR' : 'en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 2,
    }).format(value);
  }

  formatTimeline(weeks: number): string {
    if (this.currentLanguage() === 'es') {
      return `${weeks} semanas`;
    }

    return `${weeks} weeks`;
  }

  trackByCode(_: number, item: { code: string }): string {
    return item.code;
  }

  trackById(_: number, item: CommercialQuoteRecord): string {
    return item.id;
  }

  private buildPayload(): CommercialQuoteRequest {
    return {
      scope: this.quoteForm.controls.scope.value,
      stack: this.quoteForm.controls.stack.value,
      support: this.quoteForm.controls.support.value,
      maintenance: this.quoteForm.controls.maintenance.value,
      extras: this.getSelectedExtras(),
    };
  }

  private getSelectedExtras(): CommercialQuoteExtra[] {
    return COMMERCIAL_EXTRA_OPTIONS.map((extra) => extra.code).filter((extraCode) =>
      this.extraSelection.get(extraCode)?.value,
    );
  }

  private resetFormState(selectedExtras: CommercialQuoteExtra[]): void {
    this.quoteForm.reset(
      {
        scope: DEFAULT_COMMERCIAL_SCOPE,
        stack: DEFAULT_COMMERCIAL_STACK,
        support: false,
        maintenance: false,
      },
      { emitEvent: false },
    );

    for (const extra of COMMERCIAL_EXTRA_OPTIONS) {
      this.extraSelection.get(extra.code)?.setValue(selectedExtras.includes(extra.code), {
        emitEvent: false,
      });
    }
  }

  private lockBuilder(): void {
    this.quoteForm.disable({ emitEvent: false });
    this.extraSelection.disable({ emitEvent: false });
  }

  private unlockBuilder(): void {
    this.quoteForm.enable({ emitEvent: false });
    this.extraSelection.enable({ emitEvent: false });
  }
}
