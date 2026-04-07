import { inject, Injectable, signal } from '@angular/core';

import {
  COMMERCIAL_EXTRA_OPTIONS,
  COMMERCIAL_SCOPE_OPTIONS,
  COMMERCIAL_STACK_OPTIONS,
} from '../data/commercial-quote.data';
import {
  CommercialQuoteExtra,
  CommercialQuoteRecord,
  CommercialQuoteRequest,
  CommercialQuoteResult,
} from '../models/commercial-quote.models';
import { LanguageService } from './language.service';

const STORAGE_KEY = 'portfolio.commercial-quotes';
const MAX_HISTORY_ITEMS = 120;

@Injectable({
  providedIn: 'root',
})
export class CommercialQuoteService {
  private readonly languageService = inject(LanguageService);

  readonly storageError = signal<string | null>(null);
  readonly history = signal<CommercialQuoteRecord[]>(this.readStoredHistory());

  previewQuote(payload: CommercialQuoteRequest): CommercialQuoteResult {
    const language = this.languageService.language();
    const scope = COMMERCIAL_SCOPE_OPTIONS.find((option) => option.code === payload.scope)!;
    const stack = COMMERCIAL_STACK_OPTIONS.find((option) => option.code === payload.stack)!;
    const selectedExtras = COMMERCIAL_EXTRA_OPTIONS.filter((option) =>
      payload.extras.includes(option.code),
    );

    const baseBudget = this.roundMoney(scope.baseBudget * stack.multiplier);
    const extraItems = selectedExtras.map((extra) => ({
      type: 'extra' as const,
      code: extra.code,
      label: extra.label[language],
      amount: this.roundMoney(extra.amount),
      cadence: 'one_time' as const,
    }));
    const supportAmount = payload.support
      ? this.roundMoney(scope.supportBase * stack.multiplier)
      : 0;
    const maintenanceAmount = payload.maintenance
      ? this.roundMoney(scope.maintenanceBase * stack.multiplier)
      : 0;
    const oneTimeTotal = this.roundMoney(
      baseBudget + extraItems.reduce((sum, item) => sum + item.amount, 0),
    );
    const monthlyTotal = this.roundMoney(supportAmount + maintenanceAmount);
    const estimatedWeeks = Math.max(
      2,
      scope.baseWeeks + stack.weekDelta + Math.min(2, Math.floor(selectedExtras.length / 2)),
    );

    return {
      scope: payload.scope,
      stack: payload.stack,
      scopeLabel: scope.label[language],
      stackLabel: stack.label[language],
      oneTimeTotal,
      monthlyTotal,
      estimatedWeeks,
      items: [
        {
          type: 'base',
          code: payload.scope,
          label: scope.label[language],
          amount: baseBudget,
          cadence: 'one_time',
        },
        ...extraItems,
        ...(payload.support
          ? [
              {
                type: 'support' as const,
                code: 'support',
                label: language === 'es' ? 'Soporte operativo' : 'Operational support',
                amount: supportAmount,
                cadence: 'monthly' as const,
              },
            ]
          : []),
        ...(payload.maintenance
          ? [
              {
                type: 'maintenance' as const,
                code: 'maintenance',
                label: language === 'es' ? 'Mantenimiento evolutivo' : 'Maintenance retainer',
                amount: maintenanceAmount,
                cadence: 'monthly' as const,
              },
            ]
          : []),
      ],
    };
  }

  saveQuote(payload: CommercialQuoteRequest, result: CommercialQuoteResult): CommercialQuoteRecord {
    const record: CommercialQuoteRecord = {
      id: this.generateId(),
      createdAt: new Date().toISOString(),
      request: {
        ...payload,
        extras: [...payload.extras] as CommercialQuoteExtra[],
      },
      result: {
        ...result,
        items: result.items.map((item) => ({ ...item })),
      },
    };

    const nextHistory = [record, ...this.history()].slice(0, MAX_HISTORY_ITEMS);
    this.history.set(nextHistory);
    this.writeStoredHistory(nextHistory);
    return record;
  }

  getQuoteById(id: string): CommercialQuoteRecord | null {
    return this.history().find((record) => record.id === id) ?? null;
  }

  getRecentQuotes(limit = 6): CommercialQuoteRecord[] {
    return this.history().slice(0, limit);
  }

  private readStoredHistory(): CommercialQuoteRecord[] {
    try {
      const rawValue = globalThis.localStorage?.getItem(STORAGE_KEY);
      this.storageError.set(null);

      if (!rawValue) {
        return [];
      }

      const parsedValue = JSON.parse(rawValue);
      if (!Array.isArray(parsedValue)) {
        return [];
      }

      return parsedValue.filter(
        (item): item is CommercialQuoteRecord =>
          Boolean(
            item &&
              typeof item.id === 'string' &&
              typeof item.createdAt === 'string' &&
              item.request &&
              typeof item.request.scope === 'string' &&
              typeof item.request.stack === 'string' &&
              Array.isArray(item.request.extras) &&
              item.result &&
              typeof item.result.oneTimeTotal === 'number' &&
              typeof item.result.monthlyTotal === 'number',
          ),
      );
    } catch {
      this.storageError.set('No se pudo leer el historial comercial local.');
      return [];
    }
  }

  private writeStoredHistory(history: CommercialQuoteRecord[]): void {
    try {
      globalThis.localStorage?.setItem(STORAGE_KEY, JSON.stringify(history));
      this.storageError.set(null);
    } catch {
      this.storageError.set('No se pudo guardar el historial comercial local.');
    }
  }

  private roundMoney(value: number): number {
    return Math.round(value * 100) / 100;
  }

  private generateId(): string {
    if (globalThis.crypto?.randomUUID) {
      return globalThis.crypto.randomUUID();
    }

    return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  }
}
