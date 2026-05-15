export type Language = 'es' | 'en';

export type AboutSkillIcon =
  | 'java'
  | 'spring'
  | 'dotnet'
  | 'angular'
  | 'postgresql'
  | 'docker'
  | 'microservices'
  | 'ai';

interface LinkCard {
  title: string;
  description: string;
  routerLink: string;
}

interface ResourceCard {
  title: string;
  icon: 'linkedin' | 'github' | 'cv';
  url: string;
}

interface SkillCategory {
  title: string;
  skills: string[];
}

interface ProfessionalStrength {
  title: string;
  description: string;
}

interface AboutStat {
  value: string;
  label: string;
}

interface AboutJourneyStep {
  title: string;
  description: string;
}

interface AboutFeaturedSkill {
  name: string;
  subtitle: string;
  icon: AboutSkillIcon;
}

interface HeaderTranslations {
  navigationAriaLabel: string;
  homeLabel: string;
  aboutLabel: string;
  projectsLabel: string;
  skillsLabel: string;
  credentialsLabel: string;
  contactLabel: string;
  socialAriaLabel: string;
  languageToggleAriaLabel: string;
}

interface FooterTranslations {
  rightsLabel: string;
  socialAriaLabel: string;
}

interface HomeTranslations {
  role: string;
  actionsAriaLabel: string;
  resumeLabel: string;
  exploreTitle: string;
  exploreDescription: string;
  cardLinkPrefix: string;
  componentCards: LinkCard[];
  resourcesTitle: string;
  resourcesDescription: string;
  resourceButtonLabel: string;
  personalResources: ResourceCard[];
}

interface AboutTranslations {
  title: string;
  eyebrow: string;
  heroTitle: string;
  heroLead: string;
  heroBadges: string[];
  summaryTitle: string;
  summaryDescription: string;
  stats: AboutStat[];
  storyTitle: string;
  storyDescription: string;
  paragraphs: string[];
  journey: AboutJourneyStep[];
  featuredSkillsTitle: string;
  featuredSkillsDescription: string;
  featuredSkills: AboutFeaturedSkill[];
  skillsTitle: string;
  skillsDescription: string;
  skillCategories: SkillCategory[];
  projectEyebrow: string;
  projectTitle: string;
  projectDescription: string;
  projectHighlights: string[];
  interestsTitle: string;
  interestsDescription: string;
  technicalInterests: string[];
  strengthsTitle: string;
  strengthsDescription: string;
  professionalStrengths: ProfessionalStrength[];
}

interface ProjectsTranslations {
  title: string;
  cardAriaLabel: string;
  thumbnailAlt: string;
  summary: string;
  overviewLabel: string;
  problemTitle: string;
  problemDescription: string;
  solutionTitle: string;
  solutionDescription: string;
  architectureTitle: string;
  architectureItems: string[];
  stackTitle: string;
  stackAriaLabel: string;
  stack: string[];
  decisionsTitle: string;
  decisions: string[];
  demoButtonLabel: string;
  codeButtonLabel: string;
  monographButtonLabel: string;
  closeModalAriaLabel: string;
  modalTitle: string;
  modalDescription: string;
  iframeTitle: string;
  featuresTitle: string;
  features: string[];
  openRepoLabel: string;
  viewMonographLabel: string;
}

interface ContactTranslations {
  title: string;
  intro: string;
  emailLabel: string;
  githubLabel: string;
  linkedinLabel: string;
}

export interface TranslationDictionary {
  header: HeaderTranslations;
  footer: FooterTranslations;
  home: HomeTranslations;
  about: AboutTranslations;
  projects: ProjectsTranslations;
  contact: ContactTranslations;
}

export const translations: Record<Language, TranslationDictionary> = {
  es: {
    header: {
      navigationAriaLabel: 'Principal',
      homeLabel: 'Inicio',
      aboutLabel: 'Sobre mi',
      projectsLabel: 'Proyectos',
      skillsLabel: 'Skills',
      credentialsLabel: 'Formacion y certificaciones',
      contactLabel: 'Contacto',
      socialAriaLabel: 'Perfiles profesionales',
      languageToggleAriaLabel: 'Cambiar idioma a ingles',
    },
    footer: {
      rightsLabel: 'Todos los derechos reservados.',
      socialAriaLabel: 'Perfiles profesionales',
    },
    home: {
      role: 'Backend Developer | Microservices & APIs',
      actionsAriaLabel: 'Accesos profesionales',
      resumeLabel: 'Ver CV',
      exploreTitle: 'Explora mi portfolio',
      exploreDescription: 'Un recorrido por mi perfil tecnico, proyectos y formas de contacto.',
      cardLinkPrefix: 'Ir a',
      componentCards: [
        {
          title: 'Sobre mi',
          description: 'Mi perfil, experiencia tecnica, stack principal y enfoque de trabajo.',
          routerLink: '/about',
        },
        {
          title: 'Proyectos',
          description: 'Soluciones reales con backend, microservicios, integraciones y despliegue.',
          routerLink: '/projects',
        },
        {
          title: 'Contacto',
          description: 'Canales para oportunidades laborales, colaboraciones y proyectos freelance.',
          routerLink: '/contact',
        },
      ],
      resourcesTitle: 'Enlaces personales',
      resourcesDescription: 'Perfiles profesionales y acceso directo a mi CV actualizado.',
      resourceButtonLabel: 'Abrir recurso',
      personalResources: [
        {
          title: 'LinkedIn',
          icon: 'linkedin',
          url: 'https://www.linkedin.com/in/fernando-ferreyra-40a126328',
        },
        {
          title: 'GitHub',
          icon: 'github',
          url: 'https://github.com/fernandogferreyra',
        },
        {
          title: 'Curriculum',
          icon: 'cv',
          url: '/docs/cv-fernando-ferreyra.pdf',
        },
      ],
    },
    about: {
      title: 'Sobre mí',
      eyebrow: 'Backend Developer | Microservices & APIs',
      heroTitle: 'Backend sólido, arquitectura limpia y una base técnica construida en entornos reales.',
      heroLead:
        'Desarrollador backend con formación universitaria en programación y más de 15 años de experiencia técnica. Combino software, infraestructura y pensamiento sistémico para construir soluciones mantenibles y escalables.',
      heroBadges: [
        'Java & Spring Boot',
        '.NET Core',
        'APIs REST',
        'Microservicios',
        'Córdoba, Argentina',
      ],
      summaryTitle: 'Perfil profesional',
      summaryDescription:
        'Mi diferencial es la mezcla entre experiencia técnica de campo, formación en programación y foco actual en backend. No solo implemento funcionalidades: entiendo sistemas, fallas, integraciones y costo de mantenimiento.',
      stats: [
        {
          value: '15+',
          label: 'años en entornos técnicos reales',
        },
        {
          value: '11',
          label: 'servicios por dominio en ObraSmart',
        },
        {
          value: '2025',
          label: 'formación en UTN FRC',
        },
        {
          value: 'AI',
          label: 'automatización y agentes como línea de exploración',
        },
      ],
      storyTitle: 'De la electrónica al software',
      storyDescription:
        'Mi recorrido no empezó en una plantilla de portfolio. Empezó resolviendo problemas reales, reparando equipos, diagnosticando fallas y entendiendo sistemas completos de punta a punta.',
      paragraphs: [
        'Antes de enfocarme de lleno en desarrollo, trabajé durante años en electrónica, hardware y soporte técnico especializado. Esa etapa me dio criterio técnico, precisión para diagnosticar y una forma muy práctica de abordar problemas complejos.',
        'Con el tiempo trasladé esa base al desarrollo de software, completando la Tecnicatura Universitaria en Programación en UTN FRC y construyendo aplicaciones con Java, Spring Boot, .NET Core, Angular y bases de datos relacionales y no relacionales.',
        'Hoy mi foco principal está en backend, arquitectura de microservicios, APIs REST e integración de sistemas. Me interesa especialmente desarrollar soluciones escalables, claras de mantener y alineadas con buenas prácticas como SOLID, Clean Architecture y testing.',
      ],
      journey: [
        {
          title: 'Base técnica real',
          description:
            'Más de 15 años trabajando con hardware, diagnóstico, reparación, configuración y resolución de fallas complejas.',
        },
        {
          title: 'Formación en programación',
          description:
            'Técnico Universitario en Programación por UTN FRC. Finalización académica en 2025 y título en emisión en febrero de 2026.',
        },
        {
          title: 'Foco backend',
          description:
            'Java, Spring Boot, .NET Core, microservicios, JWT, APIs REST e integración entre servicios y frontend.',
        },
        {
          title: 'Exploración actual',
          description:
            'Agentes de inteligencia artificial, automatización basada en LLMs e integraciones que aceleran desarrollo y operación.',
        },
      ],
      featuredSkillsTitle: 'Tecnologías principales',
      featuredSkillsDescription:
        'Las tecnologías y áreas donde hoy aporto más valor en proyectos reales.',
      featuredSkills: [
        {
          name: 'Java',
          subtitle: 'Servicios robustos y lógica de negocio',
          icon: 'java',
        },
        {
          name: 'Spring Boot',
          subtitle: 'Microservicios y APIs mantenibles',
          icon: 'spring',
        },
        {
          name: '.NET Core',
          subtitle: 'Backends modulares y servicios empresariales',
          icon: 'dotnet',
        },
        {
          name: 'Angular',
          subtitle: 'Integración frontend y PWAs',
          icon: 'angular',
        },
        {
          name: 'PostgreSQL',
          subtitle: 'Modelado y persistencia de datos',
          icon: 'postgresql',
        },
        {
          name: 'Docker',
          subtitle: 'Entornos reproducibles y despliegue',
          icon: 'docker',
        },
        {
          name: 'Microservices',
          subtitle: 'Arquitectura por dominio y escalabilidad',
          icon: 'microservices',
        },
        {
          name: 'AI Automation',
          subtitle: 'Ollama, Mistral y flujos asistidos',
          icon: 'ai',
        },
      ],
      skillsTitle: 'Stack ampliado',
      skillsDescription:
        'Además de mis tecnologías principales, trabajo con herramientas y prácticas que me permiten moverme con comodidad entre backend, integración, despliegue y colaboración técnica.',
      skillCategories: [
        {
          title: 'Backend',
          skills: [
            'Spring Boot',
            '.NET Core',
            'REST APIs',
            'JWT',
            'Entity Framework',
            'Arquitectura de microservicios',
          ],
        },
        {
          title: 'Frontend',
          skills: ['Angular', 'TypeScript', 'JavaScript', 'HTML', 'CSS'],
        },
        {
          title: 'Bases de datos',
          skills: ['PostgreSQL', 'MySQL', 'SQL Server', 'MongoDB'],
        },
        {
          title: 'Herramientas y prácticas',
          skills: [
            'Docker',
            'Docker Compose',
            'Git',
            'GitHub',
            'Jira',
            'Taiga',
            'SOLID',
            'Clean Architecture',
            'Scrum',
            'Unit Testing',
          ],
        },
      ],
      projectEyebrow: 'Proyecto destacado',
      projectTitle: 'ObraSmart',
      projectDescription:
        'Plataforma de gestión de mantenimientos y reparaciones desarrollada con Java 17 y Spring Boot sobre una arquitectura de microservicios. Fue clave para consolidar mi experiencia en backend, integración y diseño de sistemas distribuidos.',
      projectHighlights: [
        'Diseño de 11 servicios independientes organizados por dominio.',
        'Implementación de API Gateway y autenticación centralizada con JWT.',
        'Integración con frontend Angular en formato PWA.',
        'Contenerización del ecosistema con Docker.',
        'Geolocalización operativa con OpenStreetMap y Leaflet.',
        'Asistente con inteligencia artificial utilizando Ollama y Mistral.',
      ],
      interestsTitle: 'Intereses técnicos',
      interestsDescription:
        'Temas que sigo explorando porque amplian mi mirada como profesional del software.',
      technicalInterests: [
        'Arquitectura de microservicios',
        'Inteligencia artificial aplicada',
        'Sistemas distribuidos',
        'Automatización',
        'Electrónica y mecatrónica',
        'Hardware y optimización',
        'Robótica',
        'Desarrollo de videojuegos',
      ],
      strengthsTitle: 'Cómo trabajo',
      strengthsDescription:
        'Fortalezas que suelen verse tanto en el código como en la forma de encarar un problema.',
      professionalStrengths: [
        {
          title: 'Resolución de problemas',
          description:
            'Analizo sistemas complejos con enfoque práctico para encontrar soluciones técnicas concretas.',
        },
        {
          title: 'Aprendizaje continuo',
          description:
            'Me adapto rápido a nuevas herramientas, stacks y contextos técnicos sin perder criterio.',
        },
        {
          title: 'Pensamiento sistémico',
          description:
            'Entiendo cómo interactúan servicios, datos, infraestructura y experiencia de usuario dentro del mismo sistema.',
        },
        {
          title: 'Autonomía y responsabilidad',
          description:
            'Puedo avanzar con independencia, tomar decisiones técnicas y sostener el mantenimiento de una solución.',
        },
        {
          title: 'Base técnica transversal',
          description:
            'Mi experiencia en hardware, software y soporte aporta una mirada integral poco común en perfiles puramente web.',
        },
      ],
    },
    projects: {
      title: 'Proyectos',
      cardAriaLabel: 'Abrir demo y detalles del proyecto ObraSmart',
      thumbnailAlt: 'Miniatura del video demo de ObraSmart',
      summary: 'Sistema inteligente de gestion de obras basado en arquitectura de microservicios.',
      overviewLabel: 'Caso destacado',
      problemTitle: 'Problema que resuelve',
      problemDescription:
        'ObraSmart centraliza la gestion operativa de mantenimientos, reparaciones y seguimiento de obras que normalmente quedan repartidos entre mensajes, planillas y procesos manuales.',
      solutionTitle: 'Solucion implementada',
      solutionDescription:
        'Se construyo una plataforma distribuida con servicios por dominio, autenticacion centralizada y frontend integrado para ordenar procesos, trazabilidad y visibilidad operativa en tiempo real.',
      architectureTitle: 'Arquitectura',
      architectureItems: [
        'Microservicios organizados por dominio para aislar responsabilidades.',
        'API Gateway como punto de entrada unico para el ecosistema.',
        'Autenticacion centralizada con JWT para acceso seguro entre clientes y servicios.',
      ],
      stackTitle: 'Tecnologias',
      stackAriaLabel: 'Tecnologias utilizadas en ObraSmart',
      stack: [
        'Java 17',
        'Spring Boot',
        'Microservices',
        'PostgreSQL',
        'Docker',
        'APIs',
        'IA',
        'Geolocalizacion',
      ],
      decisionsTitle: 'Decisiones tecnicas',
      decisions: [
        'Separacion por dominios para mejorar mantenibilidad y escalabilidad.',
        'Docker para entornos reproducibles y despliegue consistente.',
        'Integracion de IA y geolocalizacion como capacidades de negocio, no como extras visuales.',
      ],
      demoButtonLabel: 'Ver demo',
      codeButtonLabel: 'Codigo',
      monographButtonLabel: 'Monografia',
      closeModalAriaLabel: 'Cerrar modal de ObraSmart',
      modalTitle: 'ObraSmart Demo',
      modalDescription:
        'Plataforma orientada a optimizar la gestion de obras mediante procesos automatizados, integraciones inteligentes y monitoreo operativo en tiempo real.',
      iframeTitle: 'ObraSmart Demo',
      featuresTitle: 'Caracteristicas',
      features: [
        'Arquitectura de microservicios',
        'APIs propias y externas',
        'Integracion de IA (local y cloud)',
        'Bot automatizado',
        'Geolocalizacion',
      ],
      openRepoLabel: 'Abrir repo',
      viewMonographLabel: 'Ver monografia',
    },
    contact: {
      title: 'Contacto',
      intro: 'Estoy disponible para oportunidades laborales, colaboraciones tecnicas y proyectos freelance.',
      emailLabel: 'Email',
      githubLabel: 'GitHub',
      linkedinLabel: 'LinkedIn',
    },
  },
  en: {
    header: {
      navigationAriaLabel: 'Primary',
      homeLabel: 'Home',
      aboutLabel: 'About',
      projectsLabel: 'Projects',
      skillsLabel: 'Skills',
      credentialsLabel: 'Education & certifications',
      contactLabel: 'Contact',
      socialAriaLabel: 'Professional profiles',
      languageToggleAriaLabel: 'Switch language to Spanish',
    },
    footer: {
      rightsLabel: 'All rights reserved.',
      socialAriaLabel: 'Professional profiles',
    },
    home: {
      role: 'Backend Developer | Microservices & APIs',
      actionsAriaLabel: 'Professional links',
      resumeLabel: 'View Resume',
      exploreTitle: 'Explore my portfolio',
      exploreDescription: 'A quick look at my technical profile, projects, and contact channels.',
      cardLinkPrefix: 'Go to',
      componentCards: [
        {
          title: 'About',
          description: 'My profile, technical background, core stack, and technical mindset.',
          routerLink: '/about',
        },
        {
          title: 'Projects',
          description: 'Real solutions built with backend development, microservices, integrations, and deployment.',
          routerLink: '/projects',
        },
        {
          title: 'Contact',
          description: 'Ways to reach me for job opportunities, collaborations, and freelance work.',
          routerLink: '/contact',
        },
      ],
      resourcesTitle: 'Personal links',
      resourcesDescription: 'Professional profiles and direct access to my latest resume.',
      resourceButtonLabel: 'Open resource',
      personalResources: [
        {
          title: 'LinkedIn',
          icon: 'linkedin',
          url: 'https://www.linkedin.com/in/fernando-ferreyra-40a126328',
        },
        {
          title: 'GitHub',
          icon: 'github',
          url: 'https://github.com/fernandogferreyra',
        },
        {
          title: 'Resume',
          icon: 'cv',
          url: '/docs/cv-fernando-ferreyra.pdf',
        },
      ],
    },
    about: {
      title: 'About',
      eyebrow: 'Backend Developer | Microservices & APIs',
      heroTitle: 'Solid backend development, clean architecture, and a technical profile shaped in real environments.',
      heroLead:
        'Backend developer with university-level programming training and more than 15 years of technical experience. I combine software, infrastructure, and systems thinking to build maintainable and scalable solutions.',
      heroBadges: [
        'Java & Spring Boot',
        '.NET Core',
        'REST APIs',
        'Microservices',
        'Córdoba, Argentina',
      ],
      summaryTitle: 'Professional profile',
      summaryDescription:
        'My edge comes from blending hands-on technical field experience, formal programming training, and a strong backend focus. I do not only implement features: I understand systems, failures, integrations, and long-term maintenance cost.',
      stats: [
        {
          value: '15+',
          label: 'years in real technical environments',
        },
        {
          value: '11',
          label: 'domain-driven services in ObraSmart',
        },
        {
          value: '2025',
          label: 'UTN FRC completion',
        },
        {
          value: 'AI',
          label: 'automation and agents as an active research line',
        },
      ],
      storyTitle: 'From electronics to software',
      storyDescription:
        'My path did not start from a generic portfolio template. It started by fixing real problems, repairing hardware, diagnosing failures, and understanding complete systems end to end.',
      paragraphs: [
        'Before focusing fully on development, I spent years in electronics, hardware, and specialized technical support. That stage gave me technical judgment, diagnostic precision, and a practical way of approaching complex problems.',
        'Over time I moved that foundation into software development, completing the University Programming Technician degree at UTN FRC while building applications with Java, Spring Boot, .NET Core, Angular, and both relational and non-relational databases.',
        'Today my main focus is backend development, microservices architecture, REST APIs, and systems integration. I am especially interested in building scalable solutions that stay clear to maintain and aligned with practices such as SOLID, Clean Architecture, and testing.',
      ],
      journey: [
        {
          title: 'Real technical foundation',
          description:
            'More than 15 years working with hardware, diagnostics, repair, configuration, and complex failure resolution.',
        },
        {
          title: 'Programming training',
          description:
            'University Programming Technician degree at UTN FRC. Academic completion in 2025, with the diploma issued in February 2026.',
        },
        {
          title: 'Backend focus',
          description:
            'Java, Spring Boot, .NET Core, microservices, JWT, REST APIs, and integration across services and frontend layers.',
        },
        {
          title: 'Current exploration',
          description:
            'AI agents, LLM-based automation, and integrations that accelerate development and operations.',
        },
      ],
      featuredSkillsTitle: 'Core skills',
      featuredSkillsDescription:
        'The technologies and problem spaces where I currently bring the most value.',
      featuredSkills: [
        {
          name: 'Java',
          subtitle: 'Robust services and business logic',
          icon: 'java',
        },
        {
          name: 'Spring Boot',
          subtitle: 'Maintainable APIs and microservices',
          icon: 'spring',
        },
        {
          name: '.NET Core',
          subtitle: 'Modular backends and business services',
          icon: 'dotnet',
        },
        {
          name: 'Angular',
          subtitle: 'Frontend integration and PWAs',
          icon: 'angular',
        },
        {
          name: 'PostgreSQL',
          subtitle: 'Data modeling and persistence',
          icon: 'postgresql',
        },
        {
          name: 'Docker',
          subtitle: 'Reproducible environments and delivery',
          icon: 'docker',
        },
        {
          name: 'Microservices',
          subtitle: 'Domain-driven architecture and scale',
          icon: 'microservices',
        },
        {
          name: 'AI Automation',
          subtitle: 'Ollama, Mistral, and assisted workflows',
          icon: 'ai',
        },
      ],
      skillsTitle: 'Extended stack',
      skillsDescription:
        'Beyond my core skills, I work comfortably with tools and practices that help me move across backend, integration, deployment, and technical collaboration.',
      skillCategories: [
        {
          title: 'Backend',
          skills: [
            'Spring Boot',
            '.NET Core',
            'REST APIs',
            'JWT',
            'Entity Framework',
            'Microservices architecture',
          ],
        },
        {
          title: 'Frontend',
          skills: ['Angular', 'TypeScript', 'JavaScript', 'HTML', 'CSS'],
        },
        {
          title: 'Databases',
          skills: ['PostgreSQL', 'MySQL', 'SQL Server', 'MongoDB'],
        },
        {
          title: 'Tools and practices',
          skills: [
            'Docker',
            'Docker Compose',
            'Git',
            'GitHub',
            'Jira',
            'Taiga',
            'SOLID',
            'Clean Architecture',
            'Scrum',
            'Unit Testing',
          ],
        },
      ],
      projectEyebrow: 'Featured project',
      projectTitle: 'ObraSmart',
      projectDescription:
        'Maintenance and repair management platform built with Java 17 and Spring Boot on top of a microservices architecture. It became a key project to consolidate my experience in backend development, integration, and distributed systems design.',
      projectHighlights: [
        'Designed 11 independent services organized by domain.',
        'Implemented an API Gateway and centralized JWT authentication.',
        'Integrated an Angular frontend in PWA format.',
        'Containerized the ecosystem with Docker.',
        'Used OpenStreetMap and Leaflet for operational geolocation.',
        'Built an AI assistant with Ollama and Mistral.',
      ],
      interestsTitle: 'Technical interests',
      interestsDescription:
        'Topics I keep exploring because they widen my perspective as a software professional.',
      technicalInterests: [
        'Microservices architecture',
        'Applied artificial intelligence',
        'Distributed systems',
        'Automation',
        'Electronics and mechatronics',
        'Hardware and optimization',
        'Robotics',
        'Game development',
      ],
      strengthsTitle: 'How I work',
      strengthsDescription:
        'Strengths that usually show up both in the code and in the way I approach a problem.',
      professionalStrengths: [
        {
          title: 'Problem solving',
          description:
            'I analyze complex systems with a practical mindset to find concrete technical solutions.',
        },
        {
          title: 'Continuous learning',
          description:
            'I adapt quickly to new tools, stacks, and technical contexts without losing judgment.',
        },
        {
          title: 'Systems thinking',
          description:
            'I understand how services, data, infrastructure, and user experience interact inside the same system.',
        },
        {
          title: 'Autonomy and ownership',
          description:
            'I can move independently, make technical decisions, and sustain the maintenance of a solution.',
        },
        {
          title: 'Cross-disciplinary technical base',
          description:
            'My background across hardware, software, and support brings an unusually complete perspective for web-focused roles.',
        },
      ],
    },
    projects: {
      title: 'Projects',
      cardAriaLabel: 'Open demo and details for the ObraSmart project',
      thumbnailAlt: 'Thumbnail for the ObraSmart demo video',
      summary: 'Smart construction management platform built on a microservices architecture.',
      overviewLabel: 'Featured case study',
      problemTitle: 'Problem it solves',
      problemDescription:
        'ObraSmart centralizes maintenance, repair, and construction workflows that would otherwise be scattered across messages, spreadsheets, and manual follow-up.',
      solutionTitle: 'Implemented solution',
      solutionDescription:
        'The platform was built as a distributed system with domain-based services, centralized authentication, and an integrated frontend to improve process control, traceability, and real-time visibility.',
      architectureTitle: 'Architecture',
      architectureItems: [
        'Domain-oriented microservices to isolate responsibilities.',
        'API Gateway as the single entry point for the platform.',
        'Centralized JWT authentication for secure access across clients and services.',
      ],
      stackTitle: 'Stack',
      stackAriaLabel: 'Technologies used in ObraSmart',
      stack: [
        'Java 17',
        'Spring Boot',
        'Microservices',
        'PostgreSQL',
        'Docker',
        'APIs',
        'AI',
        'Geolocation',
      ],
      decisionsTitle: 'Technical decisions',
      decisions: [
        'Domain separation to improve maintainability and long-term scale.',
        'Docker for reproducible environments and consistent deployment.',
        'AI and geolocation integrated as business capabilities, not visual add-ons.',
      ],
      demoButtonLabel: 'View demo',
      codeButtonLabel: 'Code',
      monographButtonLabel: 'Monograph',
      closeModalAriaLabel: 'Close ObraSmart modal',
      modalTitle: 'ObraSmart Demo',
      modalDescription:
        'Platform designed to optimize construction management through automated processes, intelligent integrations, and real-time operational monitoring.',
      iframeTitle: 'ObraSmart Demo',
      featuresTitle: 'Features',
      features: [
        'Microservices architecture',
        'First-party and external APIs',
        'AI integration (local and cloud)',
        'Automated bot',
        'Geolocation',
      ],
      openRepoLabel: 'Open repo',
      viewMonographLabel: 'View monograph',
    },
    contact: {
      title: 'Contact',
      intro: 'I am available for job opportunities, technical collaborations, and freelance projects.',
      emailLabel: 'Email',
      githubLabel: 'GitHub',
      linkedinLabel: 'LinkedIn',
    },
  },
};
