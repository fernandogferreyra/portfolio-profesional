import { HttpErrorResponse } from '@angular/common/http';
import { Component, DestroyRef, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder } from '@angular/forms';
import { finalize } from 'rxjs';

import { LanguageService } from '../../services/language.service';
import { BudgetBuilderPreviewResult } from '../control-center/budget-builder/models/budget-builder.models';
import { BudgetBuilderUiFacade } from '../control-center/budget-builder/services/budget-builder-ui.facade';

@Component({
  selector: 'app-control-center-budget-builder',
  standalone: false,
  templateUrl: './control-center-budget-builder.component.html',
  styleUrl: './control-center-budget-builder.component.scss',
})
export class ControlCenterBudgetBuilderComponent {
  private readonly destroyRef = inject(DestroyRef);
  private readonly formBuilder = inject(FormBuilder);
  private readonly languageService = inject(LanguageService);
  private readonly budgetBuilderUiFacade = inject(BudgetBuilderUiFacade);

  private readonly initialFormValue = this.budgetBuilderUiFacade.createInitialFormValue();

  readonly currentLanguage = this.languageService.language;
  readonly budgetForm = this.formBuilder.nonNullable.group({
    budgetName: this.formBuilder.nonNullable.control(this.initialFormValue.budgetName),
    projectType: this.formBuilder.nonNullable.control(this.initialFormValue.projectType),
    includeFrontend: this.formBuilder.nonNullable.control(this.initialFormValue.includeFrontend),
    includeBackend: this.formBuilder.nonNullable.control(this.initialFormValue.includeBackend),
    includeDatabase: this.formBuilder.nonNullable.control(this.initialFormValue.includeDatabase),
    hourlyRate: this.formBuilder.nonNullable.control(this.initialFormValue.hourlyRate),
    supportEnabled: this.formBuilder.nonNullable.control(this.initialFormValue.supportEnabled),
    manualDiscount: this.formBuilder.nonNullable.control(this.initialFormValue.manualDiscount),
    desiredStackId: this.formBuilder.nonNullable.control(this.initialFormValue.desiredStackId),
  });

  readonly calculating = signal(false);
  readonly calculationResult = signal<BudgetBuilderPreviewResult | null>(null);
  readonly formError = signal<string | null>(null);
  readonly content = computed(() =>
    this.currentLanguage() === 'es'
      ? {
          eyebrow: 'Budget Builder',
          title: 'Presupuesto comercial MVP conectado al motor',
          lead:
            'Pantalla minima para probar el flujo real del nuevo motor comercial sin tocar el cotizador actual ni construir todavia el wizard completo.',
          workflowNote:
            'Esta pantalla usa el pipeline existente y entrega un resultado reproducible a partir del snapshot semilla.',
          infoLabel: 'Informacion de Budget Builder',
          infoDescription:
            'Budget Builder calcula el costo comercial del proyecto, con subtotal, recargos, descuentos y total final trazable.',
          formTitle: 'Entrada minima del presupuesto',
          formLead:
            'Define nombre, tipo, capas del proyecto, tarifa, stack y negociacion simple para probar el motor.',
          budgetNameLabel: 'Nombre del presupuesto',
          projectTypeLabel: 'Tipo de proyecto',
          technologyLabel: 'Tecnologia principal',
          hourlyRateLabel: 'Tarifa por hora',
          discountLabel: 'Descuento manual',
          layersLabel: 'Capas del proyecto',
          selectedLayersLabel: 'activas',
          supportLabel: 'Soporte',
          supportEnabledLabel: 'Activado',
          supportDisabledLabel: 'Desactivado',
          frontendLabel: 'Frontend',
          frontendNote: 'UI principal del producto.',
          backendLabel: 'Backend',
          backendNote: 'APIs y reglas de negocio.',
          databaseLabel: 'Base de datos',
          databaseNote: 'Persistencia y modelo de datos.',
          calculateLabel: 'Calcular presupuesto',
          validationMessage: 'Activa al menos una capa entre frontend, backend o base de datos.',
          resultTitle: 'Resultado comercial',
          resultLead: 'Lectura directa del output del engine MVP.',
          resultEmpty: 'Completa los inputs minimos y calcula para ver el presupuesto.',
          modulesLabel: 'Modulos',
          hoursLabel: 'Horas totales',
          subtotalLabel: 'Subtotal',
          surchargesLabel: 'Recargos',
          discountsLabel: 'Descuentos',
          finalOneTimeLabel: 'Total final',
          finalMonthlyLabel: 'Mensual',
          noMonthlyLabel: 'Sin soporte mensual',
          generatedModulesTitle: 'Modulos generados',
          surchargesTitle: 'Recargos aplicados',
          discountsTitle: 'Descuentos aplicados',
          explanationTitle: 'Explicacion breve',
          emptyAdjustments: 'No hay ajustes aplicados en este calculo.',
          emptyDiscounts: 'No hay descuentos manuales aplicados.',
        }
      : {
          eyebrow: 'Budget Builder',
          title: 'Commercial budget MVP connected to the engine',
          lead:
            'Minimal screen to test the real flow of the new commercial engine without touching the current quote tool or building the final wizard yet.',
          workflowNote:
            'This screen uses the existing pipeline and returns a reproducible result from the seeded snapshot.',
          infoLabel: 'Budget Builder information',
          infoDescription:
            'Budget Builder calculates the commercial cost of the project with traceable subtotal, surcharges, discounts, and final total.',
          formTitle: 'Minimum budget input',
          formLead:
            'Define name, project type, delivery layers, rate, stack, and simple negotiation to exercise the engine.',
          budgetNameLabel: 'Budget name',
          projectTypeLabel: 'Project type',
          technologyLabel: 'Primary technology',
          hourlyRateLabel: 'Hourly rate',
          discountLabel: 'Manual discount',
          layersLabel: 'Project layers',
          selectedLayersLabel: 'active',
          supportLabel: 'Support',
          supportEnabledLabel: 'Enabled',
          supportDisabledLabel: 'Disabled',
          frontendLabel: 'Frontend',
          frontendNote: 'Primary product experience.',
          backendLabel: 'Backend',
          backendNote: 'APIs and business rules.',
          databaseLabel: 'Database',
          databaseNote: 'Persistence and data model.',
          calculateLabel: 'Calculate budget',
          validationMessage: 'Enable at least one layer between frontend, backend, or database.',
          resultTitle: 'Commercial result',
          resultLead: 'Direct read of the MVP engine output.',
          resultEmpty: 'Fill the minimum inputs and calculate to see the budget.',
          modulesLabel: 'Modules',
          hoursLabel: 'Total hours',
          subtotalLabel: 'Subtotal',
          surchargesLabel: 'Surcharges',
          discountsLabel: 'Discounts',
          finalOneTimeLabel: 'Final total',
          finalMonthlyLabel: 'Monthly',
          noMonthlyLabel: 'No monthly support',
          generatedModulesTitle: 'Generated modules',
          surchargesTitle: 'Applied surcharges',
          discountsTitle: 'Applied discounts',
          explanationTitle: 'Brief explanation',
          emptyAdjustments: 'There are no applied adjustments in this calculation.',
          emptyDiscounts: 'There are no manual discounts applied.',
        },
  );
  readonly projectTypeOptions = computed(() =>
    this.budgetBuilderUiFacade.getProjectTypeOptions(this.currentLanguage()),
  );
  readonly technologyOptions = computed(() =>
    this.budgetBuilderUiFacade.getTechnologyOptions(this.currentLanguage()),
  );
  readonly summary = computed(() => {
    const result = this.calculationResult();

    if (!result) {
      return null;
    }

    const surchargeTotal = result.commercialBudget.surchargeItems.reduce(
      (sum, item) => sum + item.amount,
      0,
    );
    const discountTotal = result.commercialBudget.discountItems.reduce(
      (sum, item) => sum + item.amount,
      0,
    );

    return {
      surchargeTotal,
      discountTotal,
    };
  });

  calculateBudget(): void {
    if (this.countSelectedLayers() === 0) {
      this.formError.set(this.content().validationMessage);
      this.calculationResult.set(null);
      return;
    }

    this.formError.set(null);
    this.calculating.set(true);

    this.budgetBuilderUiFacade
      .calculateBudget(this.budgetForm.getRawValue())
      .pipe(
        finalize(() => this.calculating.set(false)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: (result) => {
          this.calculationResult.set(result);
        },
        error: (error) => {
          this.calculationResult.set(null);
          this.formError.set(this.resolveErrorMessage(error));
        },
      });
  }

  countSelectedLayers(): number {
    const formValue = this.budgetForm.getRawValue();

    return [
      formValue.includeFrontend,
      formValue.includeBackend,
      formValue.includeDatabase,
    ].filter(Boolean).length;
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

  private resolveErrorMessage(error: unknown): string {
    if (
      error instanceof HttpErrorResponse &&
      error.error &&
      typeof error.error.message === 'string' &&
      error.error.message.trim().length > 0
    ) {
      return error.error.message;
    }

    if (this.currentLanguage() === 'es') {
      return 'No se pudo calcular el preview del presupuesto.';
    }

    return 'The budget preview could not be calculated.';
  }
}
