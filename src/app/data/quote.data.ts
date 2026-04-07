import {
  QuoteComplexityOption,
  QuoteModuleCode,
  QuoteModuleOption,
  QuoteProjectType,
  QuoteProjectTypeOption,
} from '../models/quote.models';

export const DEFAULT_QUOTE_PROJECT_TYPE: QuoteProjectType = 'CORPORATE_WEBSITE';
export const DEFAULT_QUOTE_COMPLEXITY = 'MEDIUM';
export const DEFAULT_QUOTE_MODULES: QuoteModuleCode[] = [
  'DISCOVERY',
  'UI_FOUNDATION',
  'CORE_BACKEND',
];

export const QUOTE_PROJECT_TYPE_OPTIONS: QuoteProjectTypeOption[] = [
  {
    code: 'LANDING_PAGE',
    label: { es: 'Landing page', en: 'Landing page' },
    description: {
      es: 'Sitio enfocado en conversion, presentacion o captacion.',
      en: 'Conversion-oriented website for presentation or lead capture.',
    },
  },
  {
    code: 'CORPORATE_WEBSITE',
    label: { es: 'Web corporativa', en: 'Corporate website' },
    description: {
      es: 'Presencia profesional con secciones, contenido y estructura escalable.',
      en: 'Professional web presence with content sections and scalable structure.',
    },
  },
  {
    code: 'INTERNAL_TOOL',
    label: { es: 'Herramienta interna', en: 'Internal tool' },
    description: {
      es: 'Panel o sistema operativo para uso interno de un equipo.',
      en: 'Operational panel or system for internal team usage.',
    },
  },
  {
    code: 'ECOMMERCE',
    label: { es: 'Ecommerce', en: 'Ecommerce' },
    description: {
      es: 'Catalogo, carrito y flujo comercial con integraciones.',
      en: 'Catalog, cart, and commercial flow with integrations.',
    },
  },
  {
    code: 'SAAS_PLATFORM',
    label: { es: 'Plataforma SaaS', en: 'SaaS platform' },
    description: {
      es: 'Producto escalable con cuentas, paneles y modulos recurrentes.',
      en: 'Scalable product with accounts, dashboards, and recurring modules.',
    },
  },
];

export const QUOTE_COMPLEXITY_OPTIONS: QuoteComplexityOption[] = [
  {
    code: 'LOW',
    label: { es: 'Baja', en: 'Low' },
    description: {
      es: 'Alcance acotado, baja incertidumbre tecnica.',
      en: 'Reduced scope with low technical uncertainty.',
    },
  },
  {
    code: 'MEDIUM',
    label: { es: 'Media', en: 'Medium' },
    description: {
      es: 'Balance entre velocidad, integraciones y capas de negocio.',
      en: 'Balanced scope with integrations and business layers.',
    },
  },
  {
    code: 'HIGH',
    label: { es: 'Alta', en: 'High' },
    description: {
      es: 'Mayor complejidad, mas decisiones tecnicas e integraciones.',
      en: 'Higher complexity with heavier technical decisions and integrations.',
    },
  },
];

export const QUOTE_MODULE_OPTIONS: QuoteModuleOption[] = [
  {
    code: 'DISCOVERY',
    label: { es: 'Discovery', en: 'Discovery' },
    note: {
      es: 'Analisis, alcance y roadmap inicial.',
      en: 'Discovery, scoping, and initial roadmap.',
    },
  },
  {
    code: 'UI_FOUNDATION',
    label: { es: 'Base UI', en: 'UI foundation' },
    note: {
      es: 'Layout, sistema visual y experiencia base.',
      en: 'Layout, visual system, and base experience.',
    },
  },
  {
    code: 'AUTHENTICATION',
    label: { es: 'Autenticacion', en: 'Authentication' },
    note: {
      es: 'Login, roles y sesion segura.',
      en: 'Login, roles, and secure session.',
    },
  },
  {
    code: 'CORE_BACKEND',
    label: { es: 'Core backend', en: 'Core backend' },
    note: {
      es: 'APIs, negocio central y persistencia.',
      en: 'Core APIs, business logic, and persistence.',
    },
  },
  {
    code: 'DASHBOARD',
    label: { es: 'Dashboard', en: 'Dashboard' },
    note: {
      es: 'Panel admin o cliente con vistas operativas.',
      en: 'Admin or client dashboard views.',
    },
  },
  {
    code: 'PAYMENTS',
    label: { es: 'Pagos', en: 'Payments' },
    note: {
      es: 'Cobros, suscripciones o checkout.',
      en: 'Payments, subscriptions, or checkout.',
    },
  },
  {
    code: 'ANALYTICS',
    label: { es: 'Analytics', en: 'Analytics' },
    note: {
      es: 'Eventos, metricas y trazabilidad.',
      en: 'Events, metrics, and usage tracking.',
    },
  },
  {
    code: 'DEVOPS',
    label: { es: 'DevOps', en: 'DevOps' },
    note: {
      es: 'Deploy, entornos y pipeline tecnico.',
      en: 'Deploy, environments, and technical pipeline.',
    },
  },
];
