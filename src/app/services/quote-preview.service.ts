import { inject, Injectable } from '@angular/core';

import {
  QUOTE_ENGINE_COMPLEXITY_MULTIPLIERS,
  QUOTE_ENGINE_HOURLY_RATE,
  QUOTE_ENGINE_MODULE_RULES,
  QUOTE_ENGINE_PROJECT_TYPE_RULES,
  QUOTE_ENGINE_SAAS_MODULE_MULTIPLIER,
} from '../data/quote-engine.data';
import { QUOTE_MODULE_OPTIONS, QUOTE_PROJECT_TYPE_OPTIONS } from '../data/quote.data';
import { QuoteItem, QuoteRequestPayload, QuoteResult } from '../models/quote.models';
import { LanguageService } from './language.service';

@Injectable({
  providedIn: 'root',
})
export class QuotePreviewService {
  private readonly languageService = inject(LanguageService);

  previewQuote(payload: QuoteRequestPayload): QuoteResult {
    const projectRule = QUOTE_ENGINE_PROJECT_TYPE_RULES[payload.projectType];
    const complexityMultiplier = QUOTE_ENGINE_COMPLEXITY_MULTIPLIERS[payload.complexity];
    const currentLanguage = this.languageService.language();

    const items = payload.modules.map((moduleCode) => {
      const moduleRule = QUOTE_ENGINE_MODULE_RULES[moduleCode];
      const moduleOption = QUOTE_MODULE_OPTIONS.find((option) => option.code === moduleCode);
      let moduleHours = moduleRule.baseHours * projectRule.multiplier * complexityMultiplier;

      if (projectRule.saas && moduleRule.saasEligible) {
        moduleHours *= QUOTE_ENGINE_SAAS_MODULE_MULTIPLIER;
      }

      const hours = this.roundMoney(moduleHours);
      const cost = this.roundMoney(hours * QUOTE_ENGINE_HOURLY_RATE);

      return {
        name: moduleOption?.label[currentLanguage] ?? moduleRule.label,
        hours,
        cost,
      } satisfies QuoteItem;
    });

    const totalHours = this.roundMoney(items.reduce((sum, item) => sum + item.hours, 0));
    const totalCost = this.roundMoney(items.reduce((sum, item) => sum + item.cost, 0));

    return {
      projectType: payload.projectType,
      projectLabel:
        QUOTE_PROJECT_TYPE_OPTIONS.find((option) => option.code === payload.projectType)?.label[
          currentLanguage
        ] ?? projectRule.label,
      complexity: payload.complexity,
      totalHours,
      totalCost,
      hourlyRate: this.roundMoney(QUOTE_ENGINE_HOURLY_RATE),
      items,
    };
  }

  private roundMoney(value: number): number {
    return Math.round(value * 100) / 100;
  }
}
