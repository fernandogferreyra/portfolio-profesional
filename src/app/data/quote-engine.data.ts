import { QuoteComplexity, QuoteModuleCode, QuoteProjectType } from '../models/quote.models';

interface QuoteProjectTypeRule {
  label: string;
  multiplier: number;
  saas: boolean;
}

interface QuoteModuleRule {
  label: string;
  baseHours: number;
  saasEligible: boolean;
}

export const QUOTE_ENGINE_HOURLY_RATE = 35;
export const QUOTE_ENGINE_SAAS_MODULE_MULTIPLIER = 1.15;

export const QUOTE_ENGINE_COMPLEXITY_MULTIPLIERS: Record<QuoteComplexity, number> = {
  LOW: 1,
  MEDIUM: 1.25,
  HIGH: 1.6,
};

export const QUOTE_ENGINE_PROJECT_TYPE_RULES: Record<QuoteProjectType, QuoteProjectTypeRule> = {
  LANDING_PAGE: {
    label: 'Landing page',
    multiplier: 0.8,
    saas: false,
  },
  CORPORATE_WEBSITE: {
    label: 'Corporate website',
    multiplier: 1,
    saas: false,
  },
  INTERNAL_TOOL: {
    label: 'Internal tool',
    multiplier: 1.2,
    saas: false,
  },
  ECOMMERCE: {
    label: 'Ecommerce platform',
    multiplier: 1.45,
    saas: false,
  },
  SAAS_PLATFORM: {
    label: 'SaaS platform',
    multiplier: 1.65,
    saas: true,
  },
};

export const QUOTE_ENGINE_MODULE_RULES: Record<QuoteModuleCode, QuoteModuleRule> = {
  DISCOVERY: {
    label: 'Discovery and planning',
    baseHours: 8,
    saasEligible: false,
  },
  UI_FOUNDATION: {
    label: 'UI foundation',
    baseHours: 12,
    saasEligible: false,
  },
  AUTHENTICATION: {
    label: 'Authentication and roles',
    baseHours: 16,
    saasEligible: true,
  },
  CORE_BACKEND: {
    label: 'Core backend API',
    baseHours: 22,
    saasEligible: true,
  },
  DASHBOARD: {
    label: 'Admin or client dashboard',
    baseHours: 20,
    saasEligible: true,
  },
  PAYMENTS: {
    label: 'Payments and subscriptions',
    baseHours: 18,
    saasEligible: true,
  },
  ANALYTICS: {
    label: 'Analytics and tracking',
    baseHours: 10,
    saasEligible: true,
  },
  DEVOPS: {
    label: 'Deployment and environments',
    baseHours: 14,
    saasEligible: true,
  },
};
