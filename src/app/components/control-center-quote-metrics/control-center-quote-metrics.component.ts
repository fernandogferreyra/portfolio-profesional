import { Component, OnInit, computed, inject, signal } from '@angular/core';

import { COMMERCIAL_SCOPE_OPTIONS, COMMERCIAL_STACK_OPTIONS } from '../../data/commercial-quote.data';
import { CommercialQuoteRecord } from '../../models/commercial-quote.models';
import { CommercialQuoteService } from '../../services/commercial-quote.service';
import { LanguageService } from '../../services/language.service';

interface QuoteMetricsDistributionItem {
  label: string;
  count: number;
  percent: number;
  totalBudget: number;
  totalMonthly: number;
}

interface QuoteMetricsSnapshot {
  totalQuotes: number;
  averageBudget: number;
  averageMonthly: number;
  highestQuote: CommercialQuoteRecord | null;
  topScope: string | null;
  topStack: string | null;
  latestCreatedAt: string | null;
  scopeDistribution: QuoteMetricsDistributionItem[];
  stackDistribution: QuoteMetricsDistributionItem[];
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
  private readonly languageService = inject(LanguageService);
  private readonly commercialQuoteService = inject(CommercialQuoteService);

  readonly currentLanguage = this.languageService.language;
  readonly loading = signal(true);
  readonly error = this.commercialQuoteService.storageError;
  readonly quotes = this.commercialQuoteService.history;

  readonly content = computed(() =>
    this.currentLanguage() === 'es'
      ? {
          eyebrow: 'Metricas de Cotizacion',
          title: 'Lectura operativa del historial comercial',
          subtitle: 'Datos basados en cotizaciones generadas en el sistema',
          lead:
            'Resumen de ticket, alcances y stacks mas pedidos para entender rapido que tipo de propuesta comercial se repite.',
          empty: 'Todavia no hay cotizaciones comerciales suficientes para construir metricas.',
          totalQuotesLabel: 'Cotizaciones totales',
          averageBudgetLabel: 'Presupuesto promedio',
          averageMonthlyLabel: 'Mensual promedio',
          highestQuoteLabel: 'Cotizacion mas alta',
          topScopeLabel: 'Alcance dominante',
          topStackLabel: 'Stack dominante',
          latestActivityLabel: 'Ultima actividad',
          noData: 'Sin datos',
          quotesUnit: 'quotes',
          distributionTitle: 'Distribuciones clave',
          distributionLead: 'Porcentajes simples para ver de un vistazo que se vende mas.',
          scopeDistributionTitle: 'Por alcance',
          stackDistributionTitle: 'Por stack',
          budgetLabel: 'Presupuesto acumulado',
          monthlyLabel: 'Mensual acumulado',
        }
      : {
          eyebrow: 'Quote Metrics',
          title: 'Operational read of commercial history',
          subtitle: 'Data based on quotes generated inside the system',
          lead:
            'Snapshot of average ticket, popular scopes, and requested stacks to quickly understand repeated commercial patterns.',
          empty: 'There are not enough commercial quotes yet to build metrics.',
          totalQuotesLabel: 'Total quotes',
          averageBudgetLabel: 'Average budget',
          averageMonthlyLabel: 'Average monthly',
          highestQuoteLabel: 'Highest quote',
          topScopeLabel: 'Top scope',
          topStackLabel: 'Top stack',
          latestActivityLabel: 'Latest activity',
          noData: 'No data',
          quotesUnit: 'quotes',
          distributionTitle: 'Key distributions',
          distributionLead: 'Simple percentages to quickly see what gets sold the most.',
          scopeDistributionTitle: 'By scope',
          stackDistributionTitle: 'By stack',
          budgetLabel: 'Accumulated budget',
          monthlyLabel: 'Accumulated monthly',
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
        label: this.content().averageBudgetLabel,
        value: snapshot.totalQuotes > 0 ? this.formatCurrency(snapshot.averageBudget) : this.content().noData,
        helper:
          snapshot.totalQuotes > 0
            ? `${snapshot.totalQuotes} ${this.content().quotesUnit}`
            : this.content().noData,
      },
      {
        label: this.content().averageMonthlyLabel,
        value: snapshot.totalQuotes > 0 ? this.formatCurrency(snapshot.averageMonthly) : this.content().noData,
        helper:
          snapshot.totalQuotes > 0
            ? `${snapshot.totalQuotes} ${this.content().quotesUnit}`
            : this.content().noData,
      },
      {
        label: this.content().highestQuoteLabel,
        value: highestQuote ? this.formatCurrency(highestQuote.result.oneTimeTotal) : this.content().noData,
        helper: highestQuote ? this.getScopeLabel(highestQuote.request.scope) : this.content().noData,
      },
      {
        label: this.content().topScopeLabel,
        value: snapshot.topScope ? this.getScopeLabel(snapshot.topScope) : this.content().noData,
        helper:
          snapshot.scopeDistribution[0]
            ? `${snapshot.scopeDistribution[0].percent.toFixed(0)}%`
            : this.content().noData,
      },
      {
        label: this.content().topStackLabel,
        value: snapshot.topStack ? this.getStackLabel(snapshot.topStack) : this.content().noData,
        helper:
          snapshot.stackDistribution[0]
            ? `${snapshot.stackDistribution[0].percent.toFixed(0)}%`
            : this.content().noData,
      },
    ];
  });

  ngOnInit(): void {
    this.loading.set(false);
  }

  trackByLabel(_: number, item: { label: string }): string {
    return item.label;
  }

  getScopeLabel(scope: string): string {
    return (
      COMMERCIAL_SCOPE_OPTIONS.find((option) => option.code === scope)?.label[this.currentLanguage()] ??
      scope.replaceAll('_', ' ')
    );
  }

  getStackLabel(stack: string): string {
    return (
      COMMERCIAL_STACK_OPTIONS.find((option) => option.code === stack)?.label[this.currentLanguage()] ??
      stack.replaceAll('_', ' ')
    );
  }

  formatCurrency(value: number): string {
    return new Intl.NumberFormat(this.currentLanguage() === 'es' ? 'es-AR' : 'en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 2,
    }).format(value);
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

  private buildMetrics(quotes: CommercialQuoteRecord[]): QuoteMetricsSnapshot {
    if (quotes.length === 0) {
      return {
        totalQuotes: 0,
        averageBudget: 0,
        averageMonthly: 0,
        highestQuote: null,
        topScope: null,
        topStack: null,
        latestCreatedAt: null,
        scopeDistribution: [],
        stackDistribution: [],
      };
    }

    const totalQuotes = quotes.length;
    const totalBudget = quotes.reduce((sum, quote) => sum + quote.result.oneTimeTotal, 0);
    const totalMonthly = quotes.reduce((sum, quote) => sum + quote.result.monthlyTotal, 0);
    const highestQuote = quotes.reduce((highest, quote) =>
      !highest || quote.result.oneTimeTotal > highest.result.oneTimeTotal ? quote : highest,
    );

    return {
      totalQuotes,
      averageBudget: totalBudget / totalQuotes,
      averageMonthly: totalMonthly / totalQuotes,
      highestQuote,
      topScope: this.pickTopKey(quotes, (quote) => quote.request.scope),
      topStack: this.pickTopKey(quotes, (quote) => quote.request.stack),
      latestCreatedAt: quotes[0]?.createdAt ?? null,
      scopeDistribution: this.buildDistribution(
        quotes,
        (quote) => quote.request.scope,
        (key) => this.getScopeLabel(key),
      ),
      stackDistribution: this.buildDistribution(
        quotes,
        (quote) => quote.request.stack,
        (key) => this.getStackLabel(key),
      ),
    };
  }

  private buildDistribution(
    quotes: CommercialQuoteRecord[],
    selectKey: (quote: CommercialQuoteRecord) => string,
    selectLabel: (key: string) => string,
  ): QuoteMetricsDistributionItem[] {
    const buckets = new Map<string, { count: number; totalBudget: number; totalMonthly: number }>();

    for (const quote of quotes) {
      const key = selectKey(quote);
      const current = buckets.get(key) ?? { count: 0, totalBudget: 0, totalMonthly: 0 };

      current.count += 1;
      current.totalBudget += quote.result.oneTimeTotal;
      current.totalMonthly += quote.result.monthlyTotal;
      buckets.set(key, current);
    }

    return [...buckets.entries()]
      .map(([key, value]) => ({
        label: selectLabel(key),
        count: value.count,
        percent: (value.count / quotes.length) * 100,
        totalBudget: value.totalBudget,
        totalMonthly: value.totalMonthly,
      }))
      .sort((left, right) => right.count - left.count || right.totalBudget - left.totalBudget);
  }

  private pickTopKey(
    quotes: CommercialQuoteRecord[],
    selectKey: (quote: CommercialQuoteRecord) => string,
  ): string | null {
    const counts = new Map<string, number>();

    for (const quote of quotes) {
      const key = selectKey(quote);
      counts.set(key, (counts.get(key) ?? 0) + 1);
    }

    return [...counts.entries()].sort((left, right) => right[1] - left[1])[0]?.[0] ?? null;
  }
}
