import {
  PortfolioProject,
  PortfolioSkill,
  SkillCategoryDefinition,
  SkillIconDefinition,
  SkillIconId,
  ThemeDefinition,
} from './portfolio.models';

export const PORTFOLIO_THEMES: ThemeDefinition[] = [
  {
    id: 'themeNeon',
    shortLabel: 'NEON',
    label: { es: 'themeNeon', en: 'themeNeon' },
    description: {
      es: 'La base actual refinada: vidrio, cian electrico y profundidad controlada.',
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
      es: 'Escala de grises suave, mas editorial, pensada para lectura y claridad.',
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
      es: 'Servicios, negocio, integraciones y APIs mantenibles.',
      en: 'Services, business logic, integrations, and maintainable APIs.',
    },
  },
  {
    id: 'frontend',
    label: { es: 'Frontend', en: 'Frontend' },
    description: {
      es: 'Interfaces Angular, consumo de APIs y experiencia responsive.',
      en: 'Angular interfaces, API consumption, and responsive experience.',
    },
  },
  {
    id: 'databases',
    label: { es: 'Bases de datos', en: 'Databases' },
    description: {
      es: 'Persistencia relacional y no relacional para aplicaciones reales.',
      en: 'Relational and non-relational persistence for real applications.',
    },
  },
  {
    id: 'testing',
    label: { es: 'Testing', en: 'Testing' },
    description: {
      es: 'Validacion de comportamiento, contratos y calidad tecnica.',
      en: 'Behavior validation, contracts, and technical quality.',
    },
  },
  {
    id: 'tools',
    label: { es: 'Herramientas', en: 'Tools' },
    description: {
      es: 'Tooling para versionado, entornos y colaboracion.',
      en: 'Tooling for versioning, environments, and collaboration.',
    },
  },
  {
    id: 'architecture-security',
    label: { es: 'Arquitectura / Seguridad', en: 'Architecture / Security' },
    description: {
      es: 'Decisiones estructurales, escalabilidad y control de acceso.',
      en: 'Structural decisions, scalability, and access control.',
    },
  },
  {
    id: 'ai',
    label: { es: 'IA', en: 'AI' },
    description: {
      es: 'Automatizacion asistida, agentes y flujos con LLMs.',
      en: 'Assisted automation, agents, and LLM-based workflows.',
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
};

export const PORTFOLIO_SKILLS: PortfolioSkill[] = [
  { id: 'java', icon: 'java', name: 'Java', category: 'backend', featured: true, description: { es: 'Implementacion de servicios REST, logica de negocio transaccional y capas de dominio mantenibles.', en: 'Implementation of REST services, transactional business logic, and maintainable domain layers.' } },
  { id: 'spring-boot', icon: 'spring', name: 'Spring Boot', category: 'backend', featured: true, description: { es: 'Configuracion de APIs, seguridad, persistencia JPA y comunicacion entre servicios.', en: 'API configuration, security, JPA persistence, and service-to-service communication.' } },
  { id: 'dotnet-core', icon: 'dotnet', name: '.NET Core', category: 'backend', featured: true, description: { es: 'Servicios HTTP y capas aplicativas con DI, Entity Framework y separacion por responsabilidades.', en: 'HTTP services and application layers built with DI, Entity Framework, and responsibility-driven separation.' } },
  { id: 'rest-apis', icon: 'architecture', name: 'REST APIs', category: 'backend', description: { es: 'Diseno de contratos HTTP, versionado, validacion de payloads y manejo consistente de errores.', en: 'HTTP contract design, versioning, payload validation, and consistent error handling.' } },
  { id: 'angular', icon: 'angular', name: 'Angular', category: 'frontend', featured: true, description: { es: 'Pantallas modulares con routing, consumo de APIs, formularios y estado orientado a componentes.', en: 'Modular screens with routing, API consumption, forms, and component-oriented state.' } },
  { id: 'typescript', icon: 'typescript', name: 'TypeScript', category: 'frontend', description: { es: 'Tipado estricto, modelos de dominio y reduccion de errores en templates y servicios.', en: 'Strict typing, domain models, and reduced errors across templates and services.' } },
  { id: 'html-scss', icon: 'frontend', name: 'HTML / SCSS', category: 'frontend', description: { es: 'Maquetacion semantica, layout responsive y estilos reutilizables basados en tokens.', en: 'Semantic layout, responsive structure, and reusable token-based styling.' } },
  { id: 'postgresql', icon: 'postgresql', name: 'PostgreSQL', category: 'databases', featured: true, description: { es: 'Diseno relacional, consultas complejas, indices y persistencia para cargas de negocio.', en: 'Relational design, complex queries, indexing, and persistence for business workloads.' } },
  { id: 'mysql-sql', icon: 'database', name: 'MySQL / SQL', category: 'databases', description: { es: 'Modelado de tablas, joins, normalizacion y consultas operativas para sistemas transaccionales.', en: 'Table modeling, joins, normalization, and operational queries for transactional systems.' } },
  { id: 'mongodb', icon: 'database', name: 'MongoDB', category: 'databases', description: { es: 'Colecciones documentales, esquemas flexibles y lectura/escritura para modulos acotados.', en: 'Document collections, flexible schemas, and read/write flows for bounded modules.' } },
  { id: 'junit', icon: 'testing', name: 'JUnit / Integration Tests', category: 'testing', description: { es: 'Pruebas de servicios, validacion de reglas de negocio y cobertura de integracion.', en: 'Service testing, business rule validation, and integration-level coverage.' } },
  { id: 'postman-api-qa', icon: 'testing', name: 'Postman / API QA', category: 'testing', description: { es: 'Colecciones de endpoints, regresion manual y verificacion de contratos REST.', en: 'Endpoint collections, manual regression checks, and REST contract verification.' } },
  { id: 'docker', icon: 'docker', name: 'Docker', category: 'tools', featured: true, description: { es: 'Contenerizacion de APIs, redes de servicios y ejecucion consistente entre entornos.', en: 'API containerization, service networking, and consistent execution across environments.' } },
  { id: 'git-github', icon: 'git', name: 'Git / GitHub', category: 'tools', description: { es: 'Flujo por ramas, revision de cambios y trazabilidad del codigo en repositorios compartidos.', en: 'Branch-based flow, change review, and code traceability in shared repositories.' } },
  { id: 'jira-taiga', icon: 'architecture', name: 'Jira / Taiga', category: 'tools', description: { es: 'Gestion de backlog, seguimiento de incidencias y coordinacion de entregas tecnicas.', en: 'Backlog management, issue tracking, and coordination of technical deliveries.' } },
  { id: 'microservices', icon: 'microservices', name: 'Microservices', category: 'architecture-security', featured: true, description: { es: 'Descomposicion por dominio, aislamiento de responsabilidades y contratos entre servicios.', en: 'Domain-driven decomposition, responsibility isolation, and service-to-service contracts.' } },
  { id: 'clean-architecture', icon: 'architecture', name: 'Clean Architecture', category: 'architecture-security', description: { es: 'Separacion entre dominio, aplicacion e infraestructura para bajar acoplamiento.', en: 'Separation between domain, application, and infrastructure to reduce coupling.' } },
  { id: 'jwt-oauth', icon: 'security', name: 'JWT / OAuth2', category: 'architecture-security', description: { es: 'Autenticacion stateless, emision y validacion de tokens, y control de acceso por roles.', en: 'Stateless authentication, token issuance and validation, and role-based access control.' } },
  { id: 'ai-agents', icon: 'ai', name: 'AI Agents', category: 'ai', featured: true, description: { es: 'Orquestacion de tareas con prompts, herramientas y flujos automatizados sobre contexto tecnico.', en: 'Task orchestration with prompts, tools, and automated flows over technical context.' } },
  { id: 'llm-integration', icon: 'llm', name: 'LLM Integration', category: 'ai', description: { es: 'Consumo de modelos para asistencia, clasificacion y generacion controlada de respuestas.', en: 'Model consumption for assistance, classification, and controlled response generation.' } },
  { id: 'ollama-mistral', icon: 'ai', name: 'Ollama / Mistral', category: 'ai', description: { es: 'Pruebas locales de modelos, ajuste de prompts y evaluacion de casos de uso reales.', en: 'Local model testing, prompt tuning, and evaluation of real use cases.' } },
];

export const PORTFOLIO_PROJECTS: PortfolioProject[] = [
  {
    id: 'obrasmart',
    name: 'ObraSmart',
    year: '2025',
    category: { es: 'Plataforma distribuida', en: 'Distributed platform' },
    status: { es: 'Caso de estudio principal', en: 'Featured case study' },
    summary: { es: 'Caso tecnico de arquitectura distribuida para gestion operativa, seguridad centralizada e integracion frontend.', en: 'Technical case of distributed architecture for operations management, centralized security, and frontend integration.' },
    description: { es: 'Valor tecnico: coordinacion de servicios por dominio, autenticacion JWT y trazabilidad operativa en una plataforma distribuida conectada a procesos reales.', en: 'Technical value: domain-based service coordination, JWT authentication, and operational traceability in a distributed platform connected to real workflows.' },
    stack: ['Java 17', 'Spring Boot', 'Microservices', 'PostgreSQL', 'Docker', 'Angular PWA', 'JWT', 'IA'],
    metrics: [
      { value: '11', label: { es: 'servicios por dominio', en: 'domain services' } },
      { value: 'JWT', label: { es: 'seguridad centralizada', en: 'centralized security' } },
      { value: 'PWA', label: { es: 'frontend integrado', en: 'integrated frontend' } },
    ],
    sections: [
      { title: { es: 'Problema', en: 'Problem' }, items: [{ es: 'Centralizar mantenimientos, reparaciones y seguimiento operativo que normalmente quedan dispersos entre mensajes, planillas y procesos manuales.', en: 'Centralize maintenance, repair, and operational follow-up usually scattered across messages, spreadsheets, and manual processes.' }] },
      { title: { es: 'Solucion', en: 'Solution' }, items: [{ es: 'Plataforma distribuida con autenticacion centralizada, servicios por dominio y visibilidad operativa en tiempo real.', en: 'Distributed platform with centralized authentication, domain-driven services, and real-time operational visibility.' }] },
      { title: { es: 'Arquitectura', en: 'Architecture' }, items: [{ es: 'Separacion por dominios para aislar responsabilidades y facilitar evolucion independiente.', en: 'Domain separation to isolate responsibilities and support independent evolution.' }, { es: 'API Gateway como punto de entrada unico para clientes y servicios.', en: 'API Gateway as the single entry point for clients and services.' }, { es: 'Integracion con frontend Angular PWA y capacidades de geolocalizacion e IA.', en: 'Integrated Angular PWA frontend plus geolocation and AI capabilities.' }] },
      { title: { es: 'Decisiones tecnicas', en: 'Technical decisions' }, items: [{ es: 'Docker para entornos repetibles y despliegue consistente.', en: 'Docker for repeatable environments and consistent deployment.' }, { es: 'JWT y autenticacion centralizada para reducir friccion entre componentes.', en: 'JWT and centralized authentication to reduce friction across components.' }, { es: 'IA y geolocalizacion incorporadas como capacidad de negocio, no solo como extra visual.', en: 'AI and geolocation integrated as business capabilities, not just visual add-ons.' }] },
    ],
    features: [{ es: 'Arquitectura de microservicios', en: 'Microservices architecture' }, { es: 'API Gateway', en: 'API Gateway' }, { es: 'Autenticacion JWT', en: 'JWT authentication' }, { es: 'Geolocalizacion operativa', en: 'Operational geolocation' }, { es: 'Asistente con IA', en: 'AI assistant' }],
    actions: [
      { id: 'demo', type: 'modal', primary: true, label: { es: 'Ver demo', en: 'Watch demo' } },
      { id: 'repo', type: 'external', label: { es: 'Codigo', en: 'Code' }, url: 'https://github.com/114320-FERREYRA-FERNANDO-GABRIEL/obrasmart-platform.git' },
      { id: 'doc', type: 'external', label: { es: 'Monografia', en: 'Monograph' }, url: '/docs/MonografiaObraSmart.pdf' },
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
    name: 'Portfolio Ferchuz',
    year: '2026',
    category: { es: 'Sistema frontend', en: 'Frontend system' },
    status: { es: 'Portfolio profesional', en: 'Professional portfolio' },
    summary: { es: 'Portfolio Angular bilingue orientado a presentar perfil tecnico, proyectos y stack con navegacion clara y theming consistente.', en: 'Bilingual Angular portfolio designed to present a technical profile, projects, and stack with clear navigation and consistent theming.' },
    description: { es: 'Valor tecnico: sistema frontend basado en datos compartidos, tokens visuales y secciones especializadas para contenido profesional.', en: 'Technical value: frontend system built on shared data, visual tokens, and specialized sections for professional content.' },
    stack: ['Angular 20', 'TypeScript', 'SCSS', 'Angular Router', 'Signals', 'Theme Tokens'],
    metrics: [
      { value: '3', label: { es: 'themes visuales', en: 'visual themes' } },
      { value: '5', label: { es: 'secciones principales', en: 'main sections' } },
      { value: 'Angular', label: { es: 'sistema modular', en: 'modular system' } },
    ],
    sections: [
      { title: { es: 'Objetivo', en: 'Objective' }, items: [{ es: 'Presentar perfil, proyectos y skills dentro de una experiencia coherente, clara y profesional.', en: 'Present profile, projects, and skills inside a coherent, clear, and professional experience.' }] },
      { title: { es: 'Arquitectura visual', en: 'Visual architecture' }, items: [{ es: 'Tokens semanticos para themeNeon, themeEX y themeLight con persistencia desde frontend.', en: 'Semantic tokens for themeNeon, themeEX, and themeLight with frontend persistence.' }, { es: 'Navegacion por secciones y componentes orientados a contenido tecnico reutilizable.', en: 'Section-based navigation and components oriented to reusable technical content.' }] },
      { title: { es: 'Contenido', en: 'Content' }, items: [{ es: 'Modelo bilingue para skills, proyectos y themes con datos compartidos.', en: 'Bilingual model for skills, projects, and themes based on shared data.' }, { es: 'Contacto profesional, casos de proyecto y taxonomia tecnica alineados en el mismo sistema.', en: 'Professional contact, project cases, and technical taxonomy aligned within the same system.' }] },
    ],
    features: [{ es: 'Arquitectura de themes', en: 'Theme architecture' }, { es: 'Modelo de datos para skills', en: 'Skill data model' }, { es: 'Casos de proyecto', en: 'Project cases' }, { es: 'Canales profesionales', en: 'Professional channels' }],
    actions: [
      { id: 'home', type: 'internal', primary: true, label: { es: 'Ver inicio', en: 'View home' }, routerLink: '/' },
      { id: 'skills', type: 'internal', label: { es: 'Ver skills', en: 'View skills' }, routerLink: '/skills' },
      { id: 'contact', type: 'internal', label: { es: 'Ir a contacto', en: 'Go to contact' }, routerLink: '/contact' },
    ],
  },
];
