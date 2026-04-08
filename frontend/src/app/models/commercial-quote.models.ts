import type { Language } from '../i18n/translations';

export type CommercialQuoteScope =
  | 'ESSENTIAL_WEB'
  | 'BUSINESS_SITE'
  | 'OPERATIONS_TOOL'
  | 'PRODUCT_PLATFORM';

export type CommercialQuoteStack =
  | 'CMS_FAST'
  | 'ANGULAR_SPRING'
  | 'ANGULAR_DOTNET'
  | 'FULL_CUSTOM';

export type CommercialQuoteExtra =
  | 'SEO_PACK'
  | 'COPY_TUNING'
  | 'DEPLOY_ASSIST'
  | 'TRAINING'
  | 'PRIORITY_DELIVERY';

export type CommercialQuoteLineCadence = 'one_time' | 'monthly';

export interface LocalizedCommercialText {
  es: string;
  en: string;
}

export interface CommercialQuoteScopeOption {
  code: CommercialQuoteScope;
  label: LocalizedCommercialText;
  description: LocalizedCommercialText;
  baseBudget: number;
  baseWeeks: number;
  maintenanceBase: number;
  supportBase: number;
}

export interface CommercialQuoteStackOption {
  code: CommercialQuoteStack;
  label: LocalizedCommercialText;
  description: LocalizedCommercialText;
  multiplier: number;
  weekDelta: number;
}

export interface CommercialQuoteExtraOption {
  code: CommercialQuoteExtra;
  label: LocalizedCommercialText;
  note: LocalizedCommercialText;
  amount: number;
}

export interface CommercialQuoteRequest {
  scope: CommercialQuoteScope;
  stack: CommercialQuoteStack;
  support: boolean;
  maintenance: boolean;
  extras: CommercialQuoteExtra[];
}

export interface CommercialQuoteLineItem {
  type: 'base' | 'extra' | 'support' | 'maintenance';
  code: string;
  label: string;
  amount: number;
  cadence: CommercialQuoteLineCadence;
}

export interface CommercialQuoteResult {
  scope: CommercialQuoteScope;
  stack: CommercialQuoteStack;
  scopeLabel: string;
  stackLabel: string;
  oneTimeTotal: number;
  monthlyTotal: number;
  estimatedWeeks: number;
  items: CommercialQuoteLineItem[];
}

export interface CommercialQuoteRecord {
  id: string;
  createdAt: string;
  request: CommercialQuoteRequest;
  result: CommercialQuoteResult;
}

export function localizeCommercialText(
  value: LocalizedCommercialText,
  language: Language,
): string {
  return value[language];
}
