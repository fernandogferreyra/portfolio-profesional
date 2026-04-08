import type { Language } from '../i18n/translations';

export type QuoteComplexity = 'LOW' | 'MEDIUM' | 'HIGH';

export type QuoteProjectType =
  | 'LANDING_PAGE'
  | 'CORPORATE_WEBSITE'
  | 'INTERNAL_TOOL'
  | 'ECOMMERCE'
  | 'SAAS_PLATFORM';

export type QuoteModuleCode =
  | 'DISCOVERY'
  | 'UI_FOUNDATION'
  | 'AUTHENTICATION'
  | 'CORE_BACKEND'
  | 'DASHBOARD'
  | 'PAYMENTS'
  | 'ANALYTICS'
  | 'DEVOPS';

export interface LocalizedQuoteText {
  es: string;
  en: string;
}

export interface QuoteProjectTypeOption {
  code: QuoteProjectType;
  label: LocalizedQuoteText;
  description: LocalizedQuoteText;
}

export interface QuoteComplexityOption {
  code: QuoteComplexity;
  label: LocalizedQuoteText;
  description: LocalizedQuoteText;
}

export interface QuoteModuleOption {
  code: QuoteModuleCode;
  label: LocalizedQuoteText;
  note: LocalizedQuoteText;
}

export interface QuoteRequestPayload {
  projectType: QuoteProjectType;
  modules: QuoteModuleCode[];
  complexity: QuoteComplexity;
}

export interface QuoteItem {
  name: string;
  hours: number;
  cost: number;
}

export interface QuoteResult {
  projectType: string;
  projectLabel: string;
  complexity: QuoteComplexity;
  totalHours: number;
  totalCost: number;
  hourlyRate: number;
  items: QuoteItem[];
}

export interface QuoteAdminSummary {
  id: string;
  projectType: string;
  complexity: QuoteComplexity;
  totalHours: number;
  totalCost: number;
  hourlyRate: number;
  createdAt: string;
}

export interface QuoteAdminDetail {
  id: string;
  projectType: string;
  complexity: QuoteComplexity;
  totalHours: number;
  totalCost: number;
  hourlyRate: number;
  createdAt: string;
  requestJson: QuoteRequestPayload | null;
  resultJson: QuoteResult | null;
}

export function localizeQuoteText(value: LocalizedQuoteText, language: Language): string {
  return value[language];
}
