import {
  CommercialQuoteExtra,
  CommercialQuoteExtraOption,
  CommercialQuoteScope,
  CommercialQuoteScopeOption,
  CommercialQuoteStack,
  CommercialQuoteStackOption,
} from '../models/commercial-quote.models';

export const DEFAULT_COMMERCIAL_SCOPE: CommercialQuoteScope = 'BUSINESS_SITE';
export const DEFAULT_COMMERCIAL_STACK: CommercialQuoteStack = 'ANGULAR_SPRING';
export const DEFAULT_COMMERCIAL_EXTRAS: CommercialQuoteExtra[] = [];

export const COMMERCIAL_SCOPE_OPTIONS: CommercialQuoteScopeOption[] = [
  {
    code: 'ESSENTIAL_WEB',
    label: { es: 'Presencia esencial', en: 'Essential presence' },
    description: {
      es: 'Landing o sitio compacto para mostrar propuesta y captar oportunidades.',
      en: 'Landing page or compact web presence to present an offer and capture opportunities.',
    },
    baseBudget: 780,
    baseWeeks: 2,
    maintenanceBase: 70,
    supportBase: 85,
  },
  {
    code: 'BUSINESS_SITE',
    label: { es: 'Sitio comercial', en: 'Business website' },
    description: {
      es: 'Web corporativa con secciones, mensajes de venta y estructura lista para crecer.',
      en: 'Corporate website with sales messaging, sections, and room to scale.',
    },
    baseBudget: 1450,
    baseWeeks: 4,
    maintenanceBase: 110,
    supportBase: 135,
  },
  {
    code: 'OPERATIONS_TOOL',
    label: { es: 'Sistema operativo', en: 'Operations tool' },
    description: {
      es: 'Panel interno o flujo comercial con usuarios, procesos y soporte operativo.',
      en: 'Internal panel or commercial workflow with users, processes, and operational support.',
    },
    baseBudget: 2480,
    baseWeeks: 6,
    maintenanceBase: 180,
    supportBase: 220,
  },
  {
    code: 'PRODUCT_PLATFORM',
    label: { es: 'Plataforma producto', en: 'Product platform' },
    description: {
      es: 'Producto digital mas ambicioso con roadmap, cuentas y arquitectura mas exigente.',
      en: 'More ambitious digital product with roadmap, accounts, and a heavier architecture.',
    },
    baseBudget: 3860,
    baseWeeks: 9,
    maintenanceBase: 280,
    supportBase: 340,
  },
];

export const COMMERCIAL_STACK_OPTIONS: CommercialQuoteStackOption[] = [
  {
    code: 'CMS_FAST',
    label: { es: 'CMS agil', en: 'Fast CMS' },
    description: {
      es: 'Implementacion rapida para salir antes con foco comercial.',
      en: 'Faster implementation focused on commercial launch speed.',
    },
    multiplier: 0.82,
    weekDelta: 0,
  },
  {
    code: 'ANGULAR_SPRING',
    label: { es: 'Angular + Spring Boot', en: 'Angular + Spring Boot' },
    description: {
      es: 'Stack fuerte para experiencia moderna y backend robusto.',
      en: 'Strong stack for a modern UX and robust backend.',
    },
    multiplier: 1.18,
    weekDelta: 1,
  },
  {
    code: 'ANGULAR_DOTNET',
    label: { es: 'Angular + .NET', en: 'Angular + .NET' },
    description: {
      es: 'Opcion enterprise con perfil tecnico similar y buena integracion corporativa.',
      en: 'Enterprise-friendly option with similar technical profile and solid corporate integrations.',
    },
    multiplier: 1.14,
    weekDelta: 1,
  },
  {
    code: 'FULL_CUSTOM',
    label: { es: 'Custom fullstack', en: 'Custom fullstack' },
    description: {
      es: 'Construccion mas flexible para alcance especial, producto o negocio propio.',
      en: 'Flexible build for special scope, product work, or a custom business flow.',
    },
    multiplier: 1.32,
    weekDelta: 2,
  },
];

export const COMMERCIAL_EXTRA_OPTIONS: CommercialQuoteExtraOption[] = [
  {
    code: 'SEO_PACK',
    label: { es: 'SEO base', en: 'SEO baseline' },
    note: {
      es: 'Estructura base, metadata y soporte inicial para posicionamiento.',
      en: 'Baseline structure, metadata, and initial positioning support.',
    },
    amount: 210,
  },
  {
    code: 'COPY_TUNING',
    label: { es: 'Ajuste comercial de copy', en: 'Commercial copy tuning' },
    note: {
      es: 'Revision del mensaje, tono comercial y claridad de conversion.',
      en: 'Revision of messaging, commercial tone, and conversion clarity.',
    },
    amount: 180,
  },
  {
    code: 'DEPLOY_ASSIST',
    label: { es: 'Deploy asistido', en: 'Assisted deployment' },
    note: {
      es: 'Configuracion de dominio, hosting y salida a produccion.',
      en: 'Domain, hosting, and production release assistance.',
    },
    amount: 160,
  },
  {
    code: 'TRAINING',
    label: { es: 'Capacitacion', en: 'Training' },
    note: {
      es: 'Sesion guiada para transferencia operativa al equipo.',
      en: 'Guided session for operational handoff to the team.',
    },
    amount: 140,
  },
  {
    code: 'PRIORITY_DELIVERY',
    label: { es: 'Entrega prioritaria', en: 'Priority delivery' },
    note: {
      es: 'Reserva de agenda y ejecucion acelerada.',
      en: 'Calendar reservation and accelerated execution.',
    },
    amount: 280,
  },
];
