import { HttpErrorResponse } from '@angular/common/http';
import { Component, DestroyRef, OnInit, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { finalize } from 'rxjs';

import { QUOTE_COMPLEXITY_OPTIONS, QUOTE_PROJECT_TYPE_OPTIONS } from '../../data/quote.data';
import { QuoteAdminSummary } from '../../models/quote.models';
import { LanguageService } from '../../services/language.service';
import { QuoteService } from '../../services/quote.service';

interface QuoteMetricsDistributionItem {
  label: string;
  count: number;
  percent: number;
  totalHours: number;
  totalCost: number;
}

interface QuoteMetricsSnapshot {
  totalQuotes: number;
  averageCost: number;
  averageHours: number;
  highestQuote: QuoteAdminSummary | null;
  topProjectType: string | null;
  topComplexity: string | null;
  latestCreatedAt: string | null;
  projectDistribution: QuoteMetricsDistributionItem[];
  complexityDistribution: QuoteMetricsDistributionItem[];
}

interface QuoteMetricsCard {
  label: string;
  value: string;
  helper: string;
}

@Component({
  selector: 'app-control-center-quote-metrics',
  standalone: false,
  templateUrl: './control-center-quote-metrics.component.html',
  styleUrl: './control-center-quote-metrics.component.scss',
})
export class ControlCenterQuoteMetricsComponent implements OnInit {
  private readonly destroyRef = inject(DestroyRef);
  private readonly languageService = inject(LanguageService);
  private readonly quoteService = inject(QuoteService);

  readonly currentLanguage = this.languageService.language;
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);
  readonly quotes = signal<QuoteAdminSummary[]>([]);

  readonly content = computed(() =>
    this.currentLanguage() === 'es'
      ? {
          eyebrow: 'Metricas de Cotizacion',
          title: 'Lectura operativa del historial de cotizaciones',
          subtitle: 'Datos basados en cotizaciones generadas en el sistema',
          lead:
            'Resumen de volumen, ticket, esfuerzo y patrones de demanda para detectar rapido que tipo de trabajo entra mas seguido.',
          loading: 'Cargando metricas de cotizaciones...',
          empty: 'Todavia no hay cotizaciones suficientes para construir metricas.',
          totalQuotesLabel: 'Cotizaciones totales',
          averageCostLabel: 'Costo promedio',
          averageHoursLabel: 'Horas promedio',
          highestQuoteLabel: 'Cotizacion mas alta',
          topProjectLabel: 'Proyecto dominante',
          topComplexityLabel: 'Complejidad dominante',
          latestActivityLabel: 'Ultima actividad',
          noData: 'Sin datos',
          quotesUnit: 'quotes',
          distributionTitle: 'Distribuciones clave',
          distributionLead: 'Porcentajes simples para ver de un vistazo lo mas solicitado.',
          projectDistributionTitle: 'Por tipo de proyecto',
          complexityDistributionTitle: 'Por complejidad',
          projectCostLabel: 'Costo acumulado',
          projectHoursLabel: 'Horas acumuladas',
          genericError: 'No se pudieron cargar las metricas de cotizacion.',
        }
      : {
          eyebrow: 'Quote Metrics',
          title: 'Operational read of stored quote history',
          subtitle: 'Data based on quotes generated inside the system',
          lead:
            'Snapshot of volume, ticket size, effort, and demand patterns to quickly detect what kind of work is requested the most.',
          loading: 'Loading quote metrics...',
          empty: 'There are not enough quotes yet to build metrics.',
          totalQuotesLabel: 'Total quotes',
          averageCostLabel: 'Average cost',
          averageHoursLabel: 'Average hours',
          highestQuoteLabel: 'Highest quote',
          topProjectLabel: 'Top project type',
          topComplexityLabel: 'Top complexity',
          latestActivityLabel: 'Latest activity',
          noData: 'No data',
          quotesUnit: 'quotes',
          distributionTitle: 'Key distributions',
          distributionLead: 'Simple percentages to see what gets requested the most at a glance.',
          projectDistributionTitle: 'By project type',
          complexityDistributionTitle: 'By complexity',
          projectCostLabel: 'Accumulated cost',
          projectHoursLabel: 'Accumulated hours',
          genericError: 'Quote metrics could not be loaded.',
        },
  );

  readonly metrics = computed(() => this.buildMetrics(this.quotes()));
  readonly metricCards = computed<QuoteMetricsCard[]>(() => {
    const snapshot = this.metrics();
    const highestQuote = snapshot.highestQuote;

    return [
      {
        label: this.content().totalQuotesLabel,
        value: String(snapshot.totalQuotes),
        helper: snapshot.latestCreatedAt
          ? `${this.content().latestActivityLabel}: ${this.formatDate(snapshot.latestCreatedAt)}`
          : this.content().noData,
      },
      {
        label: this.content().averageCostLabel,
        value: snapshot.totalQuotes > 0 ? this.formatCurrency(snapshot.averageCost) : this.content().noData,
        helper:
          snapshot.totalQuotes > 0
            ? `${snapshot.totalQuotes} ${this.content().quotesUnit}`
            : this.content().noData,
      },
      {
        label: this.content().averageHoursLabel,
        value: snapshot.totalQuotes > 0 ? this.formatHours(snapshot.averageHours) : this.content().noData,
        helper:
          snapshot.totalQuotes > 0
            ? `${snapshot.totalQuotes} ${this.content().quotesUnit}`
            : this.content().noData,
      },
      {
        label: this.content().highestQuoteLabel,
        value: highestQuote ? this.formatCurrency(highestQuote.totalCost) : this.content().noData,
        helper: highestQuote ? this.getProjectLabel(highestQuote.projectType) : this.content().noData,
      },
      {
        label: this.content().topProjectLabel,
        value: snapshot.topProjectType ? this.getProjectLabel(snapshot.topProjectType) : this.content().noData,
        helper:
          snapshot.projectDistribution[0]
            ? `${snapshot.projectDistribution[0].percent.toFixed(0)}%`
            : this.content().noData,
      },
      {
        label: this.content().topComplexityLabel,
        value: snapshot.topComplexity ? this.getComplexityLabel(snapshot.topComplexity) : this.content().noData,
        helper:
          snapshot.complexityDistribution[0]
            ? `${snapshot.complexityDistribution[0].percent.toFixed(0)}%`
            : this.content().noData,
      },
    ];
  });

  ngOnInit(): void {
    this.loadMetrics();
  }

  trackByLabel(_: number, item: { label: string }): string {
    return item.label;
  }

  getProjectLabel(projectType: string): string {
    return (
      QUOTE_PROJECT_TYPE_OPTIONS.find((option) => option.code === projectType)?.label[
        this.currentLanguage()
      ] ?? projectType.replaceAll('_', ' ')
    );
  }

  getComplexityLabel(complexity: string | null | undefined): string {
    return (
      QUOTE_COMPLEXITY_OPTIONS.find((option) => option.code === complexity)?.label[
        this.currentLanguage()
      ] ?? complexity ?? this.content().noData
    );
  }

  formatCurrency(value: number): string {
    return new Intl.NumberFormat(this.currentLanguage() === 'es' ? 'es-AR' : 'en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 2,
    }).format(value);
  }

  formatHours(value: number): string {
    return new Intl.NumberFormat(this.currentLanguage() === 'es' ? 'es-AR' : 'en-US', {
      minimumFractionDigits: 1,
      maximumFractionDigits: 2,
    }).format(value) + ' h';
  }

  formatDate(value: string): string {
    return new Intl.DateTimeFormat(this.currentLanguage() === 'es' ? 'es-AR' : 'en-US', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(value));
  }

  private loadMetrics(): void {
    this.loading.set(true);
    this.error.set(null);

    this.quoteService
      .getQuotes()
      .pipe(
        finalize(() => this.loading.set(false)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: (quotes) => {
          const sortedQuotes = [...quotes].sort(
            (left, right) => new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime(),
          );
          this.quotes.set(sortedQuotes);
        },
        error: (error) => {
          this.error.set(this.resolveErrorMessage(error, this.content().genericError));
        },
      });
  }

  private buildMetrics(quotes: QuoteAdminSummary[]): QuoteMetricsSnapshot {
    if (quotes.length === 0) {
      return {
        totalQuotes: 0,
        averageCost: 0,
        averageHours: 0,
        highestQuote: null,
        topProjectType: null,
        topComplexity: null,
        latestCreatedAt: null,
        projectDistribution: [],
        complexityDistribution: [],
      };
    }

    const totalQuotes = quotes.length;
    const totalCost = quotes.reduce((sum, quote) => sum + quote.totalCost, 0);
    const totalHours = quotes.reduce((sum, quote) => sum + quote.totalHours, 0);
    const highestQuote = quotes.reduce((highest, quote) =>
      !highest || quote.totalCost > highest.totalCost ? quote : highest,
    );

    return {
      totalQuotes,
      averageCost: totalCost / totalQuotes,
      averageHours: totalHours / totalQuotes,
      highestQuote,
      topProjectType: this.pickTopKey(quotes, (quote) => quote.projectType),
      topComplexity: this.pickTopKey(quotes, (quote) => quote.complexity),
      latestCreatedAt: quotes[0]?.createdAt ?? null,
      projectDistribution: this.buildDistribution(
        quotes,
        (quote) => quote.projectType,
        (key) => this.getProjectLabel(key),
      ),
      complexityDistribution: this.buildDistribution(
        quotes,
        (quote) => quote.complexity,
        (key) => this.getComplexityLabel(key),
      ),
    };
  }

  private buildDistribution(
    quotes: QuoteAdminSummary[],
    selectKey: (quote: QuoteAdminSummary) => string,
    selectLabel: (key: string) => string,
  ): QuoteMetricsDistributionItem[] {
    const buckets = new Map<string, { count: number; totalHours: number; totalCost: number }>();

    for (const quote of quotes) {
      const key = selectKey(quote);
      const current = buckets.get(key) ?? { count: 0, totalHours: 0, totalCost: 0 };

      current.count += 1;
      current.totalHours += quote.totalHours;
      current.totalCost += quote.totalCost;
      buckets.set(key, current);
    }

    return [...buckets.entries()]
      .map(([key, value]) => ({
        label: selectLabel(key),
        count: value.count,
        percent: (value.count / quotes.length) * 100,
        totalHours: value.totalHours,
        totalCost: value.totalCost,
      }))
      .sort((left, right) => right.count - left.count || right.totalCost - left.totalCost);
  }

  private pickTopKey(
    quotes: QuoteAdminSummary[],
    selectKey: (quote: QuoteAdminSummary) => string,
  ): string | null {
    const counts = new Map<string, number>();

    for (const quote of quotes) {
      const key = selectKey(quote);
      counts.set(key, (counts.get(key) ?? 0) + 1);
    }

    return [...counts.entries()].sort((left, right) => right[1] - left[1])[0]?.[0] ?? null;
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
