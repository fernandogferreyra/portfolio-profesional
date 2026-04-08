import {
  PortfolioProject,
  PortfolioSkill,
  SkillCategoryDefinition,
  SkillIconDefinition,
  SkillIconId,
  SkillLevelId,
  ThemeDefinition,
} from './portfolio.models';

export const PORTFOLIO_THEMES: ThemeDefinition[] = [
  {
    id: 'themeNeon',
    shortLabel: 'NEON',
    label: { es: 'themeNeon', en: 'themeNeon' },
    description: {
      es: 'La base actual refinada: vidrio, cian eléctrico y profundidad controlada.',
      en: 'The refined current base: glass, electric cyan, and controlled depth.',
    },
    preview: {
      accent: '#2dd4bf',
      accentSoft: 'rgba(45, 212, 191, 0.14)',
      surface: '#0f1422',
    },
  },
  {
    id: 'themeEX',
    shortLabel: 'EX',
    label: { es: 'themeEX', en: 'themeEX' },
    description: {
      es: 'Grafito y rojo intenso, inspirado en interfaces gaming de alto contraste.',
      en: 'Graphite and vivid red, inspired by high-contrast gaming interfaces.',
    },
    preview: {
      accent: '#ff355e',
      accentSoft: 'rgba(255, 53, 94, 0.14)',
      surface: '#171014',
    },
  },
  {
    id: 'themeLight',
    shortLabel: 'LIGHT',
    label: { es: 'themeLight', en: 'themeLight' },
    description: {
      es: 'Escala de grises suave, más editorial, pensada para lectura y claridad.',
      en: 'Soft grayscale, more editorial, focused on readability and clarity.',
    },
    preview: {
      accent: '#4b5563',
      accentSoft: 'rgba(75, 85, 99, 0.14)',
      surface: '#f4f4f2',
    },
  },
];

export const SKILL_CATEGORIES: SkillCategoryDefinition[] = [
  {
    id: 'backend',
    label: { es: 'Backend', en: 'Backend' },
    description: {
      es: 'Servicios, APIs, seguridad, integraciones y arquitectura de aplicaciones.',
      en: 'Services, APIs, security, integrations, and application architecture.',
    },
  },
  {
    id: 'frontend',
    label: { es: 'Frontend', en: 'Frontend' },
    description: {
      es: 'Interfaces Angular, consumo de APIs y desarrollo orientado a componentes.',
      en: 'Angular interfaces, API consumption, and component-oriented development.',
    },
  },
  {
    id: 'data',
    label: { es: 'Data', en: 'Data' },
    description: {
      es: 'Persistencia relacional y no relacional, modelado y consultas.',
      en: 'Relational and non-relational persistence, modeling, and querying.',
    },
  },
  {
    id: 'tools',
    label: { es: 'Herramientas', en: 'Tools' },
    description: {
      es: 'Versionado, IDEs, automatización, build y herramientas de trabajo diario.',
      en: 'Version control, IDEs, automation, build, and day-to-day tooling.',
    },
  },
  {
    id: 'ai',
    label: { es: 'AI / Desarrollo asistido', en: 'AI / Assisted development' },
    description: {
      es: 'Herramientas orientadas a desarrollo asistido, automatización, productividad y exploración de workflows técnicos.',
      en: 'Tools focused on assisted development, automation, productivity, and technical workflow exploration.',
    },
  },
  {
    id: 'soft',
    label: { es: 'Soft Skills', en: 'Soft Skills' },
    description: {
      es: 'Capacidades personales aplicadas al trabajo técnico, la colaboración y la resolución de problemas.',
      en: 'Personal capabilities applied to technical work, collaboration, and problem solving.',
    },
  },
];

export const SKILL_ICONS: Record<SkillIconId, SkillIconDefinition> = {
  java: {
    viewBox: '0 0 24 24',
    paths: [
      'M9 14h6a2 2 0 0 1 2 2v1a4 4 0 0 1-4 4h-2a4 4 0 0 1-4-4v-1a2 2 0 0 1 2-2Z',
      'M17 15h1a2 2 0 1 1 0 4h-1',
      'M10.5 3c2 1.6-1 2.8 1 4.4',
      'M14 4c1.8 1.4-0.8 2.6 0.8 4',
    ],
    accent: '#f89820',
    surface: 'rgba(248, 152, 32, 0.14)',
    border: 'rgba(248, 152, 32, 0.28)',
  },
  javascript: {
    viewBox: '0 0 24 24',
    paths: ['M4 4h16v16H4Z', 'M10 8v7c0 1.3-.8 2-2.1 2-1 0-1.7-.3-2.4-1', 'M13.5 15.6c.7 1 1.5 1.4 2.7 1.4 1.1 0 1.8-.5 1.8-1.3 0-.9-.7-1.2-2-1.8l-.7-.3c-1.9-.8-3.1-1.8-3.1-3.8 0-1.9 1.4-3.4 3.8-3.4 1.6 0 2.8.6 3.6 2'],
    accent: '#f7df1e',
    surface: 'rgba(247, 223, 30, 0.14)',
    border: 'rgba(247, 223, 30, 0.3)',
  },
  cplusplus: {
    viewBox: '0 0 24 24',
    paths: ['M5 5h10v10H5Z', 'M18 8v4', 'M16 10h4', 'M18 14v4', 'M16 16h4'],
    accent: '#2563eb',
    surface: 'rgba(37, 99, 235, 0.14)',
    border: 'rgba(37, 99, 235, 0.28)',
  },
  python: {
    viewBox: '0 0 24 24',
    paths: [
      'M9 4h4a3 3 0 0 1 3 3v2h-5a2 2 0 0 0-2 2v2H7a3 3 0 0 1-3-3V7a3 3 0 0 1 3-3Z',
      'M15 20h-4a3 3 0 0 1-3-3v-2h5a2 2 0 0 0 2-2v-2h2a3 3 0 0 1 3 3v3a3 3 0 0 1-3 3Z',
      'M9 7h.01',
      'M15 17h.01',
    ],
    accent: '#fbbf24',
    surface: 'rgba(251, 191, 36, 0.14)',
    border: 'rgba(251, 191, 36, 0.28)',
  },
  spring: {
    viewBox: '0 0 24 24',
    paths: [
      'M6 14c6.5-8.5 11.5-7.5 13-11-1 8.5-4 14-11.5 15.5A4 4 0 0 1 6 14Z',
      'M9 15c1.2-1.2 3.7-3.6 8-5.6',
    ],
    accent: '#6db33f',
    surface: 'rgba(109, 179, 63, 0.14)',
    border: 'rgba(109, 179, 63, 0.28)',
  },
  dotnet: {
    viewBox: '0 0 24 24',
    paths: ['M12 3 18.5 6.75v10.5L12 21l-6.5-3.75V6.75L12 3Z', 'M9 9h6v6H9Z'],
    accent: '#7c4dff',
    surface: 'rgba(124, 77, 255, 0.14)',
    border: 'rgba(124, 77, 255, 0.28)',
  },
  angular: {
    viewBox: '0 0 24 24',
    paths: [
      'M12 3 19 5.7 17.9 16 12 21 6.1 16 5 5.7 12 3Z',
      'M12 7.2 15.1 16h-1.8l-.7-2H11.4l-.7 2H8.9L12 7.2Z',
      'M11.9 10.8 11 13h2l-1.1-2.2Z',
    ],
    accent: '#dd0031',
    surface: 'rgba(221, 0, 49, 0.14)',
    border: 'rgba(221, 0, 49, 0.28)',
  },
  typescript: {
    viewBox: '0 0 24 24',
    paths: ['M5 5h14v14H5Z', 'M8 9h8', 'M10 9v6', 'M8.5 15h3', 'M13 11h3', 'M14.5 11v4', 'M13 15h3'],
    accent: '#3178c6',
    surface: 'rgba(49, 120, 198, 0.14)',
    border: 'rgba(49, 120, 198, 0.28)',
  },
  frontend: {
    viewBox: '0 0 24 24',
    paths: ['M8 8 4 12l4 4', 'M16 8l4 4-4 4', 'M10 19 14 5'],
    accent: '#38bdf8',
    surface: 'rgba(56, 189, 248, 0.14)',
    border: 'rgba(56, 189, 248, 0.28)',
  },
  openapi: {
    viewBox: '0 0 24 24',
    paths: ['M12 3 18 6.5v7L12 17l-6-3.5v-7L12 3Z', 'M12 8v4', 'M9.5 9.5 12 8l2.5 1.5', 'M9.5 12.5 12 14l2.5-1.5'],
    accent: '#85ea2d',
    surface: 'rgba(133, 234, 45, 0.14)',
    border: 'rgba(133, 234, 45, 0.28)',
  },
  postgresql: {
    viewBox: '0 0 24 24',
    paths: [
      'M6 7c0-2.2 12-2.2 12 0v10c0 2.2-12 2.2-12 0V7Z',
      'M6 12c0 2.2 12 2.2 12 0',
      'M6 17c0 2.2 12 2.2 12 0',
    ],
    accent: '#336791',
    surface: 'rgba(51, 103, 145, 0.16)',
    border: 'rgba(51, 103, 145, 0.3)',
  },
  database: {
    viewBox: '0 0 24 24',
    paths: ['M5 7c0-2 14-2 14 0v10c0 2-14 2-14 0V7Z', 'M5 12c0 2 14 2 14 0', 'M5 17c0 2 14 2 14 0'],
    accent: '#64748b',
    surface: 'rgba(100, 116, 139, 0.14)',
    border: 'rgba(100, 116, 139, 0.28)',
  },
  testing: {
    viewBox: '0 0 24 24',
    paths: ['M9 4h6', 'M10 4v4L6.5 17a2 2 0 0 0 1.8 3h7.4a2 2 0 0 0 1.8-3L14 8V4', 'M9 14h6', 'M10.5 11.5h3'],
    accent: '#f97316',
    surface: 'rgba(249, 115, 22, 0.14)',
    border: 'rgba(249, 115, 22, 0.28)',
  },
  docker: {
    viewBox: '0 0 24 24',
    paths: [
      'M4 10h3v3H4Z',
      'M8 10h3v3H8Z',
      'M12 10h3v3h-3Z',
      'M8 6.5h3v3H8Z',
      'M12 6.5h3v3h-3Z',
      'M3 16.5c1.8 1.3 4.1 1.7 6.2 1.1 1.7-.5 2.5-1.9 3.6-3.6 1.3 1 2.8 1.3 4.4 1.1 1.6-.2 2.7-.8 3.8-1.9',
    ],
    accent: '#2496ed',
    surface: 'rgba(36, 150, 237, 0.14)',
    border: 'rgba(36, 150, 237, 0.28)',
  },
  git: {
    viewBox: '0 0 24 24',
    paths: ['M9 7a2 2 0 1 0 0 4', 'M15 4a2 2 0 1 0 0 4', 'M15 13a2 2 0 1 0 0 4', 'M9 9v6', 'M11 10.5 13.2 8.2', 'M15 8v3'],
    accent: '#f97316',
    surface: 'rgba(249, 115, 22, 0.14)',
    border: 'rgba(249, 115, 22, 0.28)',
  },
  github: {
    viewBox: '0 0 24 24',
    paths: [
      'M9 18c-1.5 0-5-.7-5-4.5 0-1.2.4-2.2 1-3-.2-.6-.4-1.6 0-3.2 0 0 1-.3 3.3 1.1a11.5 11.5 0 0 1 6 0C18 7.3 19 7.6 19 7.6c.4 1.6.2 2.6 0 3.2.6.8 1 1.8 1 3 0 3.8-3.5 4.5-5 4.5',
      'M9.5 18v-2.1c-2 .4-2.7-.8-3-1.5',
      'M14.5 18v-2.1c2 .4 2.7-.8 3-1.5',
    ],
    accent: '#cbd5e1',
    surface: 'rgba(203, 213, 225, 0.12)',
    border: 'rgba(203, 213, 225, 0.28)',
  },
  ide: {
    viewBox: '0 0 24 24',
    paths: ['M4 6h16v12H4Z', 'M4 9h16', 'M9 13 7 15l2 2', 'M15 13l2 2-2 2', 'M11 19l2-8'],
    accent: '#8b5cf6',
    surface: 'rgba(139, 92, 246, 0.14)',
    border: 'rgba(139, 92, 246, 0.28)',
  },
  arduino: {
    viewBox: '0 0 24 24',
    paths: ['M7.5 12a3.5 3.5 0 1 1 0-7c2 0 3.4 1.8 5.5 4 2.1 2.2 3.5 4 5.5 4a3.5 3.5 0 1 1 0 7c-2 0-3.4-1.8-5.5-4-2.1-2.2-3.5-4-5.5-4Z', 'M6.2 8.5h2.6', 'M15.2 15.5h2.6', 'M16.5 14.2v2.6'],
    accent: '#0ea5a4',
    surface: 'rgba(14, 165, 164, 0.14)',
    border: 'rgba(14, 165, 164, 0.28)',
  },
  automation: {
    viewBox: '0 0 24 24',
    paths: ['M6 6h4v4H6Z', 'M14 6h4v4h-4Z', 'M10 8h4', 'M16 10v4', 'M14 18h4v-4h-4Z', 'M6 14h4v4H6Z', 'M8 10v4', 'M10 16h4'],
    accent: '#6366f1',
    surface: 'rgba(99, 102, 241, 0.14)',
    border: 'rgba(99, 102, 241, 0.28)',
  },
  microservices: {
    viewBox: '0 0 24 24',
    paths: ['M4 4h5v5H4Z', 'M15 4h5v5h-5Z', 'M4 15h5v5H4Z', 'M15 15h5v5h-5Z', 'M9 6.5h6', 'M12 9v6', 'M9 17.5h6'],
    accent: '#14b8a6',
    surface: 'rgba(20, 184, 166, 0.14)',
    border: 'rgba(20, 184, 166, 0.28)',
  },
  architecture: {
    viewBox: '0 0 24 24',
    paths: ['M5 6h14', 'M7 6v4h10V6', 'M4 13h16', 'M6 13v4h12v-4', 'M9 20h6'],
    accent: '#a78bfa',
    surface: 'rgba(167, 139, 250, 0.14)',
    border: 'rgba(167, 139, 250, 0.28)',
  },
  security: {
    viewBox: '0 0 24 24',
    paths: ['M12 3 18 5.5V11c0 4.2-2.5 7.3-6 9-3.5-1.7-6-4.8-6-9V5.5L12 3Z', 'M10.5 11v-1.2a1.5 1.5 0 0 1 3 0V11', 'M9.5 11h5v4h-5Z'],
    accent: '#0ea5e9',
    surface: 'rgba(14, 165, 233, 0.14)',
    border: 'rgba(14, 165, 233, 0.28)',
  },
  ai: {
    viewBox: '0 0 24 24',
    paths: ['M12 3 13.5 7.2 18 8.8 13.8 10.5 12 15 10.2 10.5 6 8.8 10.5 7.2 12 3Z', 'M7 18h10', 'M9.5 14.5 8 21', 'M14.5 14.5 16 21'],
    accent: '#f59e0b',
    surface: 'rgba(245, 158, 11, 0.14)',
    border: 'rgba(245, 158, 11, 0.28)',
  },
  llm: {
    viewBox: '0 0 24 24',
    paths: ['M12 4 13.2 7.2 16.5 8.4 13.4 10 12 13.2 10.6 10 7.5 8.4 10.8 7.2 12 4Z', 'M6 16a2 2 0 1 0 0 .1', 'M18 16a2 2 0 1 0 0 .1', 'M12 20a2 2 0 1 0 0 .1', 'M7.6 17.1 3 1.7', 'M16.4 17.1-3 1.7', 'M12 13.2v4'],
    accent: '#eab308',
    surface: 'rgba(234, 179, 8, 0.14)',
    border: 'rgba(234, 179, 8, 0.28)',
  },
  problemSolving: {
    viewBox: '0 0 24 24',
    paths: ['M12 4a6 6 0 0 1 6 6c0 2.2-1.1 3.6-2.4 4.8-.9.8-1.6 1.6-1.6 2.7V19H10v-1.5c0-1.1-.7-1.9-1.6-2.7C7.1 13.6 6 12.2 6 10a6 6 0 0 1 6-6Z', 'M10 22h4', 'M9.5 19.5h5', 'M10.5 10.5 12 12l2.8-3'],
    accent: '#22c55e',
    surface: 'rgba(34, 197, 94, 0.14)',
    border: 'rgba(34, 197, 94, 0.28)',
  },
  analyticalThinking: {
    viewBox: '0 0 24 24',
    paths: ['M5 18h14', 'M7 15v-3', 'M12 15V8', 'M17 15v-5', 'M4 8.5 8.2 5 12.2 9 18.5 4.5', 'M18.5 4.5v4', 'M18.5 4.5h-4'],
    accent: '#38bdf8',
    surface: 'rgba(56, 189, 248, 0.14)',
    border: 'rgba(56, 189, 248, 0.28)',
  },
  adaptability: {
    viewBox: '0 0 24 24',
    paths: ['M8 7h8l-2.4-2.4', 'M16 7l-2.4 2.4', 'M16 17H8l2.4 2.4', 'M8 17l2.4-2.4', 'M7 8.5a6 6 0 0 0 0 7', 'M17 15.5a6 6 0 0 0 0-7'],
    accent: '#f97316',
    surface: 'rgba(249, 115, 22, 0.14)',
    border: 'rgba(249, 115, 22, 0.28)',
  },
  teamwork: {
    viewBox: '0 0 24 24',
    paths: ['M8 11a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z', 'M16 12a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z', 'M4.5 18a3.5 3.5 0 0 1 7 0', 'M12.5 18a3.5 3.5 0 0 1 7 0'],
    accent: '#14b8a6',
    surface: 'rgba(20, 184, 166, 0.14)',
    border: 'rgba(20, 184, 166, 0.28)',
  },
  autonomy: {
    viewBox: '0 0 24 24',
    paths: ['M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z', 'M12 12 16.5 7.5', 'M12 12l-2.5 5.5', 'M12 12h.01'],
    accent: '#a78bfa',
    surface: 'rgba(167, 139, 250, 0.14)',
    border: 'rgba(167, 139, 250, 0.28)',
  },
  continuousLearning: {
    viewBox: '0 0 24 24',
    paths: ['M5 6.5A2.5 2.5 0 0 1 7.5 4H19v14H7.5A2.5 2.5 0 0 0 5 20.5V6.5Z', 'M5 6.5V20', 'M9 8h6', 'M9 12h5', 'M13 20.5 15 22l4-4'],
    accent: '#f59e0b',
    surface: 'rgba(245, 158, 11, 0.14)',
    border: 'rgba(245, 158, 11, 0.28)',
  },
};

export const PORTFOLIO_SKILLS: PortfolioSkill[] = [
  {
    id: 'java',
    icon: 'java',
    name: 'Java',
    category: 'backend',
    description: {
      es: 'Desarrollo backend orientado a APIs, lógica de negocio y servicios mantenibles.',
      en: 'Backend development focused on APIs, business logic, and maintainable services.',
    },
    tags: [
      { es: 'Spring Boot', en: 'Spring Boot' },
      { es: 'REST', en: 'REST' },
      { es: 'Security', en: 'Security' },
    ],
  },
  {
    id: 'cplusplus',
    icon: 'cplusplus',
    name: 'C++',
    category: 'backend',
    description: {
      es: 'Base técnica cercana a hardware y resolución estructurada de problemas.',
      en: 'Technical foundation close to hardware and structured problem solving.',
    },
    tags: [
      { es: 'Hardware', en: 'Hardware' },
      { es: 'Low level', en: 'Low level' },
    ],
  },
  {
    id: 'csharp',
    icon: 'dotnet',
    name: 'C#',
    category: 'backend',
    description: {
      es: 'Implementación de servicios y capas de negocio dentro del ecosistema .NET.',
      en: 'Service and business layer implementation within the .NET ecosystem.',
    },
    tags: [
      { es: 'Services', en: 'Services' },
      { es: 'APIs', en: 'APIs' },
      { es: 'OOP', en: 'OOP' },
    ],
  },
  {
    id: 'dotnet-core',
    icon: 'dotnet',
    name: '.NET Core',
    category: 'backend',
    description: {
      es: 'Construcción de APIs y aplicaciones backend con ASP.NET Core y persistencia integrada.',
      en: 'Backend API and application development with ASP.NET Core and integrated persistence.',
    },
    tags: [
      { es: 'ASP.NET Core', en: 'ASP.NET Core' },
      { es: 'Entity Framework', en: 'Entity Framework' },
      { es: 'DI', en: 'DI' },
    ],
  },
  {
    id: 'python',
    icon: 'python',
    name: 'Python',
    category: 'backend',
    description: {
      es: 'Uso puntual en scripting y automatizaciones de apoyo al desarrollo.',
      en: 'Used selectively for scripting and development-support automation.',
    },
    tags: [
      { es: 'Scripting', en: 'Scripting' },
      { es: 'Automation', en: 'Automation' },
    ],
  },
  {
    id: 'javascript',
    icon: 'javascript',
    name: 'JavaScript',
    category: 'frontend',
    description: {
      es: 'Base práctica para interacción, comportamiento de UI y lógica web en cliente.',
      en: 'Practical foundation for interaction, UI behavior, and client-side web logic.',
    },
    tags: [
      { es: 'DOM', en: 'DOM' },
      { es: 'Events', en: 'Events' },
      { es: 'Async', en: 'Async' },
    ],
  },
  {
    id: 'typescript',
    icon: 'typescript',
    name: 'TypeScript',
    category: 'frontend',
    description: {
      es: 'Tipado, modelos y organización del código para frontend más claro y predecible.',
      en: 'Typing, models, and code organization for clearer and more predictable frontend work.',
    },
    tags: [
      { es: 'Typing', en: 'Typing' },
      { es: 'Models', en: 'Models' },
      { es: 'API clients', en: 'API clients' },
    ],
  },
  {
    id: 'angular',
    icon: 'angular',
    name: 'Angular',
    category: 'frontend',
    description: {
      es: 'Interfaces modulares con routing, formularios y consumo de APIs.',
      en: 'Modular interfaces with routing, forms, and API consumption.',
    },
    tags: [
      { es: 'Router', en: 'Router' },
      { es: 'Forms', en: 'Forms' },
      { es: 'Signals', en: 'Signals' },
    ],
  },
  {
    id: 'html-scss',
    icon: 'frontend',
    name: 'HTML / SCSS',
    category: 'frontend',
    description: {
      es: 'Maquetación semántica, responsive y jerarquía visual consistente.',
      en: 'Semantic layout, responsive adaptation, and consistent visual hierarchy.',
    },
    tags: [
      { es: 'Layout', en: 'Layout' },
      { es: 'Responsive', en: 'Responsive' },
      { es: 'UI', en: 'UI' },
    ],
  },
  {
    id: 'postgresql',
    icon: 'postgresql',
    name: 'PostgreSQL',
    category: 'data',
    description: {
      es: 'Modelado y persistencia relacional para aplicaciones transaccionales.',
      en: 'Relational modeling and persistence for transactional applications.',
    },
    tags: [
      { es: 'Queries', en: 'Queries' },
      { es: 'Modeling', en: 'Modeling' },
      { es: 'Transactions', en: 'Transactions' },
    ],
  },
  {
    id: 'mysql-sql',
    icon: 'database',
    name: 'MySQL / SQL',
    category: 'data',
    description: {
      es: 'Trabajo sólido sobre tablas, joins y consultas operativas en bases relacionales.',
      en: 'Solid work with tables, joins, and operational queries in relational databases.',
    },
    tags: [
      { es: 'Joins', en: 'Joins' },
      { es: 'Reporting', en: 'Reporting' },
      { es: 'Optimization', en: 'Optimization' },
    ],
  },
  {
    id: 'mongodb',
    icon: 'database',
    name: 'MongoDB',
    category: 'data',
    description: {
      es: 'Persistencia documental para escenarios acotados y esquemas flexibles.',
      en: 'Document persistence for bounded scenarios and flexible schemas.',
    },
    tags: [
      { es: 'Documents', en: 'Documents' },
      { es: 'Queries', en: 'Queries' },
    ],
  },
  {
    id: 'docker',
    icon: 'docker',
    name: 'Docker',
    category: 'tools',
    description: {
      es: 'Entornos reproducibles y despliegue consistente mediante contenedores.',
      en: 'Reproducible environments and consistent delivery through containers.',
    },
    tags: [
      { es: 'Containers', en: 'Containers' },
      { es: 'Compose', en: 'Compose' },
      { es: 'Deploy', en: 'Deploy' },
    ],
  },
  {
    id: 'git',
    icon: 'git',
    name: 'Git',
    category: 'tools',
    description: {
      es: 'Control de versiones como base del flujo técnico diario.',
      en: 'Version control as the foundation of day-to-day technical flow.',
    },
    tags: [
      { es: 'Branches', en: 'Branches' },
      { es: 'Review', en: 'Review' },
      { es: 'History', en: 'History' },
    ],
  },
  {
    id: 'github-actions',
    icon: 'automation',
    name: 'GitHub Actions',
    category: 'tools',
    description: {
      es: 'Automatización de build y validaciones dentro del flujo de integración.',
      en: 'Build automation and validation inside the integration workflow.',
    },
    tags: [
      { es: 'CI', en: 'CI' },
      { es: 'Build', en: 'Build' },
      { es: 'Validation', en: 'Validation' },
    ],
  },
  {
    id: 'postman-api-qa',
    icon: 'testing',
    name: 'Postman',
    category: 'tools',
    description: {
      es: 'Pruebas manuales de endpoints y debugging rápido de APIs.',
      en: 'Manual endpoint testing and quick API debugging.',
    },
    tags: [
      { es: 'Collections', en: 'Collections' },
      { es: 'Testing', en: 'Testing' },
      { es: 'Debug', en: 'Debug' },
    ],
  },
  {
    id: 'intellij-idea',
    icon: 'ide',
    name: 'IntelliJ IDEA',
    category: 'tools',
    description: {
      es: 'IDE principal para Java y Spring Boot con debugging y navegación estructurada.',
      en: 'Primary IDE for Java and Spring Boot with debugging and structured navigation.',
    },
    tags: [
      { es: 'Java', en: 'Java' },
      { es: 'Spring', en: 'Spring' },
      { es: 'Debug', en: 'Debug' },
    ],
  },
  {
    id: 'visual-studio-code',
    icon: 'ide',
    name: 'Visual Studio Code',
    category: 'tools',
    description: {
      es: 'Editor central para frontend, scripting y edición rápida en flujo fullstack.',
      en: 'Core editor for frontend, scripting, and quick edits in the fullstack workflow.',
    },
    tags: [
      { es: 'Frontend', en: 'Frontend' },
      { es: 'Config', en: 'Config' },
      { es: 'Refactor', en: 'Refactor' },
    ],
  },
  {
    id: 'claude-code',
    icon: 'ai',
    name: 'Claude Code',
    category: 'ai',
    description: {
      es: 'Asistencia para navegar código y acelerar cambios concretos de implementación.',
      en: 'Used to navigate code and accelerate concrete implementation changes.',
    },
    tags: [
      { es: 'Code nav', en: 'Code nav' },
      { es: 'Edits', en: 'Edits' },
      { es: 'Automation', en: 'Automation' },
    ],
  },
  {
    id: 'opencode',
    icon: 'ai',
    name: 'OpenCode',
    category: 'ai',
    description: {
      es: 'Exploración de flujos agentic y automatización liviana aplicada al desarrollo.',
      en: 'Exploration of agentic flows and lightweight automation applied to development.',
    },
    tags: [
      { es: 'Agentic', en: 'Agentic' },
      { es: 'Workflows', en: 'Workflows' },
      { es: 'Automation', en: 'Automation' },
    ],
  },
  {
    id: 'codex',
    icon: 'ai',
    name: 'Codex',
    category: 'ai',
    description: {
      es: 'Soporte para edición guiada, revisión técnica y ejecución controlada.',
      en: 'Support for guided editing, technical review, and controlled execution.',
    },
    tags: [
      { es: 'Review', en: 'Review' },
      { es: 'Implementation', en: 'Implementation' },
      { es: 'Repo work', en: 'Repo work' },
    ],
  },
  {
    id: 'chatgpt',
    icon: 'ai',
    name: 'ChatGPT',
    category: 'ai',
    description: {
      es: 'Apoyo para análisis, documentación e ideación rápida de soluciones técnicas.',
      en: 'Support for analysis, documentation, and quick ideation of technical solutions.',
    },
    tags: [
      { es: 'Analysis', en: 'Analysis' },
      { es: 'Docs', en: 'Docs' },
      { es: 'Ideation', en: 'Ideation' },
    ],
  },
  {
    id: 'ollama',
    icon: 'llm',
    name: 'Ollama',
    category: 'ai',
    description: {
      es: 'Ejecución local de modelos para pruebas de asistentes y flujos offline.',
      en: 'Local model runtime for assistant testing and offline workflows.',
    },
    tags: [
      { es: 'Local models', en: 'Local models' },
      { es: 'Offline', en: 'Offline' },
    ],
  },
  {
    id: 'teamwork',
    icon: 'teamwork',
    name: 'Trabajo en equipo',
    category: 'soft',
    showLevel: false,
    description: {
      es: 'Colaboración sostenida y comunicación clara dentro del trabajo técnico.',
      en: 'Steady collaboration and clear communication in technical work.',
    },
  },
  {
    id: 'problem-solving',
    icon: 'problemSolving',
    name: 'Resolución de problemas',
    category: 'soft',
    showLevel: false,
    description: {
      es: 'Capacidad para diagnosticar, desarmar y resolver problemas complejos.',
      en: 'Ability to diagnose, break down, and solve complex problems.',
    },
  },
  {
    id: 'analytical-thinking',
    icon: 'analyticalThinking',
    name: 'Pensamiento analítico',
    category: 'soft',
    showLevel: false,
    description: {
      es: 'Lectura estructurada de fallas, causas y alternativas de solución.',
      en: 'Structured reading of failures, causes, and solution alternatives.',
    },
  },
  {
    id: 'adaptability',
    icon: 'adaptability',
    name: 'Adaptabilidad',
    category: 'soft',
    showLevel: false,
    description: {
      es: 'Transición fluida entre herramientas, contextos y tipos de problema.',
      en: 'Smooth transition across tools, contexts, and problem types.',
    },
  },
  {
    id: 'autonomy',
    icon: 'autonomy',
    name: 'Trabajo autónomo',
    category: 'soft',
    showLevel: false,
    description: {
      es: 'Capacidad de avanzar con criterio propio y mantener foco técnico.',
      en: 'Ability to move forward with sound judgment and sustained technical focus.',
    },
  },
  {
    id: 'continuous-learning',
    icon: 'continuousLearning',
    name: 'Aprendizaje continuo',
    category: 'soft',
    showLevel: false,
    description: {
      es: 'Actualización constante de herramientas, prácticas y formas de trabajo.',
      en: 'Continuous update of tools, practices, and ways of working.',
    },
  },
];

export const SKILL_LEVELS: Record<string, SkillLevelId> = {
  java: 'advanced',
  cplusplus: 'intermediate',
  csharp: 'advanced',
  python: 'basic',
  'dotnet-core': 'advanced',
  javascript: 'intermediate',
  angular: 'intermediate',
  typescript: 'intermediate',
  'html-scss': 'intermediate',
  postgresql: 'intermediate',
  'mysql-sql': 'advanced',
  mongodb: 'basic',
  docker: 'intermediate',
  git: 'advanced',
  'github-actions': 'intermediate',
  'postman-api-qa': 'advanced',
  'intellij-idea': 'advanced',
  'visual-studio-code': 'advanced',
  'claude-code': 'advanced',
  opencode: 'intermediate',
  codex: 'advanced',
  chatgpt: 'advanced',
  ollama: 'intermediate',
};

export const PORTFOLIO_PROJECTS: PortfolioProject[] = [
  {
    id: 'obrasmart',
    name: 'ObraSmart',
    year: '2025',
    category: { es: 'Plataforma distribuida', en: 'Distributed platform' },
    summary: {
      es: 'Plataforma de gestión de mantenimiento para obras privadas con control operativo y trazabilidad.',
      en: 'Maintenance management platform for private construction sites with operational control and traceability.',
    },
    description: {
      es: 'Plataforma de gestión de mantenimiento de equipos en obras privadas. Permite centralizar y organizar procesos que muchas empresas aún gestionan con planillas de Excel o en papel, mejorando control, trazabilidad y eficiencia operativa.',
      en: 'Equipment maintenance management platform for private construction projects. It centralizes and organizes processes that many companies still manage with spreadsheets or paper, improving control, traceability, and operational efficiency.',
    },
    stack: ['Java 17', 'Spring Boot', 'Microservices', 'PostgreSQL', 'Docker', 'Angular PWA', 'JWT', 'IA'],
    metrics: [
      { value: '11', label: { es: 'servicios por dominio', en: 'domain services' } },
      { value: 'JWT', label: { es: 'seguridad centralizada', en: 'centralized security' } },
      { value: 'PWA', label: { es: 'frontend integrado', en: 'integrated frontend' } },
    ],
    sections: [
      { title: { es: 'Problema', en: 'Problem' }, items: [{ es: 'Centralizar mantenimientos, reparaciones y seguimiento operativo que normalmente quedan dispersos entre mensajes, planillas y procesos manuales.', en: 'Centralize maintenance, repair, and operational follow-up usually scattered across messages, spreadsheets, and manual processes.' }] },
      { title: { es: 'Solución', en: 'Solution' }, items: [{ es: 'Plataforma distribuida con autenticación centralizada, servicios por dominio y visibilidad operativa en tiempo real.', en: 'Distributed platform with centralized authentication, domain-driven services, and real-time operational visibility.' }] },
      { title: { es: 'Arquitectura', en: 'Architecture' }, items: [{ es: 'Separación por dominios para aislar responsabilidades y facilitar evolución independiente.', en: 'Domain separation to isolate responsibilities and support independent evolution.' }, { es: 'API Gateway como punto de entrada único para clientes y servicios.', en: 'API Gateway as the single entry point for clients and services.' }, { es: 'Integración con frontend Angular PWA y capacidades de geolocalización e IA.', en: 'Integrated Angular PWA frontend plus geolocation and AI capabilities.' }] },
      { title: { es: 'Decisiones técnicas', en: 'Technical decisions' }, items: [{ es: 'Docker para entornos repetibles y despliegue consistente.', en: 'Docker for repeatable environments and consistent deployment.' }, { es: 'JWT y autenticación centralizada para reducir fricción entre componentes.', en: 'JWT and centralized authentication to reduce friction across components.' }, { es: 'IA y geolocalización incorporadas como capacidad de negocio, no solo como extra visual.', en: 'AI and geolocation integrated as business capabilities, not just visual add-ons.' }] },
    ],
    features: [{ es: 'Arquitectura de microservicios', en: 'Microservices architecture' }, { es: 'API Gateway', en: 'API Gateway' }, { es: 'Autenticación JWT', en: 'JWT authentication' }, { es: 'Geolocalización operativa', en: 'Operational geolocation' }, { es: 'Asistente con IA', en: 'AI assistant' }],
    actions: [
      { id: 'demo', type: 'modal', primary: true, label: { es: 'Ver demo', en: 'Watch demo' } },
      { id: 'repo', type: 'external', label: { es: 'Código', en: 'Code' }, url: 'https://github.com/114320-FERREYRA-FERNANDO-GABRIEL/obrasmart-platform.git' },
      { id: 'doc', type: 'external', label: { es: 'Monografía', en: 'Monograph' }, url: '/docs/MonografiaObraSmart.pdf' },
    ],
    media: {
      thumbnailUrl: 'https://img.youtube.com/vi/8qTf_oowQiY/hqdefault.jpg',
      embedUrl: 'https://www.youtube.com/embed/8qTf_oowQiY',
      alt: { es: 'Miniatura del video demo de ObraSmart', en: 'Thumbnail for the ObraSmart demo video' },
      iframeTitle: { es: 'Demo de ObraSmart', en: 'ObraSmart demo' },
    },
  },
  {
    id: 'portfolio-ferchuz',
    name: 'Portfolio Profesional',
    year: '2026',
    category: { es: 'Sistema frontend', en: 'Frontend system' },
    summary: { es: 'Aplicación Angular bilingüe con arquitectura modular, contenido centralizado y enfoque en mantenibilidad.', en: 'Bilingual Angular application with a modular architecture, centralized content, and a maintainability-focused approach.' },
    description: { es: 'SPA construida con componentes reutilizables, datos centralizados, theming, i18n y automatización básica con GitHub Actions.', en: 'SPA built with reusable components, centralized data, theming, i18n, and basic automation with GitHub Actions.' },
    stack: ['Angular 20', 'TypeScript', 'SCSS', 'Angular Router', 'Signals', 'Theme Tokens'],
    metrics: [
      { value: '3', label: { es: 'themes visuales', en: 'visual themes' } },
      { value: '5', label: { es: 'secciones principales', en: 'main sections' } },
      { value: 'Angular', label: { es: 'sistema modular', en: 'modular system' } },
    ],
    sections: [
      { title: { es: 'Objetivo', en: 'Objective' }, items: [{ es: 'Construir un portfolio técnico claro, mantenible y alineado con un perfil fullstack con foco en backend.', en: 'Build a clear, maintainable technical portfolio aligned with a fullstack profile focused on backend development.' }] },
      { title: { es: 'Arquitectura', en: 'Architecture' }, items: [{ es: 'Componentes reutilizables, rutas separadas por sección y datos centralizados para contenido profesional.', en: 'Reusable components, section-based routes, and centralized data for professional content.' }, { es: 'Sistema de themes e internacionalización resuelto desde frontend sin duplicar estructura.', en: 'Theme system and internationalization handled on the frontend without duplicating structure.' }] },
      { title: { es: 'Automatización', en: 'Automation' }, items: [{ es: 'Workflow de GitHub Actions para instalar dependencias y validar la build en push y pull request.', en: 'GitHub Actions workflow to install dependencies and validate the build on push and pull request.' }, { es: 'Base lista para conectar un deploy automático en una siguiente etapa.', en: 'Baseline ready to connect to automatic deployment in a following stage.' }] },
    ],
    features: [{ es: 'Arquitectura modular', en: 'Modular architecture' }, { es: 'i18n y theming', en: 'i18n and theming' }, { es: 'Contenido centralizado', en: 'Centralized content' }, { es: 'CI con GitHub Actions', en: 'CI with GitHub Actions' }],
    actions: [
      { id: 'home', type: 'internal', primary: true, label: { es: 'Ver inicio', en: 'View home' }, routerLink: '/' },
      { id: 'skills', type: 'internal', label: { es: 'Ver skills', en: 'View skills' }, routerLink: '/skills' },
      { id: 'contact', type: 'internal', label: { es: 'Ir a contacto', en: 'Go to contact' }, routerLink: '/contact' },
    ],
  },
];
