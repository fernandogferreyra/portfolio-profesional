import { Component, computed, inject, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';

import { CredentialItem, CredentialService } from '../../services/credential.service';
import { LanguageService } from '../../services/language.service';
import { MotionService } from '../../services/motion.service';

type TechnicalBaseCategoryId = 'electronics' | 'it' | 'development';

interface WorkArea {
  label: string;
  level: number;
  description: string;
}

@Component({
  selector: 'app-home',
  standalone: false,
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  private readonly languageService = inject(LanguageService);
  private readonly motionService = inject(MotionService);
  private readonly credentialService = inject(CredentialService);

  readonly currentLanguage = this.languageService.language;
  readonly activeBaseCategoryId = signal<TechnicalBaseCategoryId>('electronics');
  readonly profileImageAvailable = signal(true);
  readonly profileImageUrl = 'images/profile-photo.jpg';
  readonly credentialEntries = signal<CredentialItem[]>([]);

  readonly ui = computed(() =>
    this.currentLanguage() === 'es'
      ? {
          eyebrow: 'Fernando G. Ferreyra',
          title: 'Fullstack Developer',
          subtitle: 'Backend-focused | Java \u00B7 Spring Boot \u00B7 .NET \u00B7 APIs',
          lead:
            'Desarrollo aplicaciones de punta a punta, con especial foco en backend, arquitectura y diseño de APIs escalables.',
        }
      : {
          eyebrow: 'Fernando G. Ferreyra',
          title: 'Fullstack Developer',
          subtitle: 'Backend-focused | Java \u00B7 Spring Boot \u00B7 .NET \u00B7 APIs',
          lead:
            'I build end-to-end applications with a strong focus on backend development, architecture, and scalable API design.',
        },
  );

  readonly profile = computed(() =>
    this.currentLanguage() === 'es'
      ? {
          alt: 'Foto personal de Fernando G. Ferreyra',
          fallbackLabel: 'FGF',
        }
      : {
          alt: 'Portrait of Fernando G. Ferreyra',
          fallbackLabel: 'FGF',
        },
  );

  readonly about = computed(() =>
    this.currentLanguage() === 'es'
      ? {
          eyebrow: 'Sobre mí',
          title: 'Recorrido y perfil actual',
          lead:
            'Más de 15 años de experiencia técnica en electrónica e informática me dieron una base práctica para diagnosticar fallas, reparar equipos y resolver problemas complejos. Esa trayectoria hoy se complementa con mi formación como desarrollador y un perfil orientado al desarrollo fullstack.',
          paragraphs: [
            'Durante más de una década trabajé de forma hands-on en electrónica e informática, interviniendo equipos, analizando fallas y resolviendo problemas reales en hardware, audio, video y entornos de PC.',
            'Con el tiempo trasladé esa experiencia al software, completé la Tecnicatura Universitaria en Programación en UTN FRC y comencé a desarrollar aplicaciones web con frontend, backend, APIs y bases de datos.',
            'Hoy consolido un perfil técnico integral: combino criterio de diagnóstico, trabajo práctico y una formación reciente en desarrollo para aportar en proyectos con una mirada completa del problema.',
          ],
        }
      : {
          eyebrow: 'About',
          title: 'Background and current profile',
          lead:
            'More than 15 years of technical experience in electronics and IT gave me a practical foundation to diagnose failures, repair equipment, and solve complex problems. Today that path is complemented by my software training and a profile oriented toward fullstack development.',
          paragraphs: [
            'For more than a decade I worked hands-on in electronics and IT, intervening equipment, analyzing failures, and solving real problems across hardware, audio, video, and PC environments.',
            'Over time I brought that experience into software, completed the University Programming Technician degree at UTN FRC, and started building web applications across frontend, backend, APIs, and databases.',
            'Today I am consolidating a well-rounded technical profile: I combine diagnostic judgment, practical execution, and recent software training to contribute to projects with a complete view of the problem.',
          ],
        },
  );

  readonly technicalBase = computed(() =>
    this.currentLanguage() === 'es'
      ? {
          eyebrow: 'Recorrido técnico',
          title: 'Experiencia técnica',
          description: '',
          ariaLabel: 'Categorías de experiencia técnica',
          categories: [
            {
              id: 'electronics' as const,
              label: 'Electrónica',
              description:
                'Experiencia práctica en audio y video, hardware de videojuegos, consolas, PC, monitores y arcades, con trabajo directo en diagnóstico, reparación y programación de memorias.',
              items: [
                'Audio y video',
                'Consolas y hardware de videojuegos',
                'PC, notebooks y periféricos',
                'Monitores y arcades',
                'Programación de memorias',
              ],
            },
            {
              id: 'it' as const,
              label: 'Informática',
              description:
                'Soporte técnico, instalación, mantenimiento y puesta a punto de equipos y entornos de trabajo, con criterio para resolver fallas de hardware, software y conectividad.',
              items: [
                'Instalación y configuración',
                'Sistemas operativos',
                'Mantenimiento preventivo',
                'Redes y conectividad',
                'Soporte técnico',
              ],
            },
            {
              id: 'development' as const,
              label: 'Desarrollo',
              description:
                'Desarrollo de aplicaciones web fullstack, trabajando tanto en frontend como en backend, con experiencia en APIs, bases de datos y buenas prácticas de desarrollo. Actualmente en etapa de consolidación profesional, ampliando experiencia en proyectos reales.',
              items: [
                'Frontend + Backend',
                'APIs',
                'Bases de datos',
                'Buenas prácticas',
                'Aprendizaje continuo',
              ],
            },
          ],
        }
      : {
          eyebrow: 'Technical background',
          title: 'Technical experience',
          description: '',
          ariaLabel: 'Technical experience categories',
          categories: [
            {
              id: 'electronics' as const,
              label: 'Electronics',
              description:
                'Hands-on experience in audio and video equipment, gaming hardware, consoles, PCs, monitors, and arcade systems, including diagnostics, repair, and memory programming.',
              items: [
                'Audio and video',
                'Consoles and gaming hardware',
                'PCs, laptops, and peripherals',
                'Monitors and arcades',
                'Memory programming',
              ],
            },
            {
              id: 'it' as const,
              label: 'IT',
              description:
                'Technical support, installation, maintenance, and workstation setup with a practical approach to hardware, software, and connectivity issues.',
              items: [
                'Installation and setup',
                'Operating systems',
                'Preventive maintenance',
                'Networking and connectivity',
                'Technical support',
              ],
            },
            {
              id: 'development' as const,
              label: 'Development',
              description:
                'Fullstack web application development across frontend and backend, with experience in APIs, databases, and development practices while building real-project experience.',
              items: [
                'Frontend + Backend',
                'APIs',
                'Databases',
                'Best practices',
                'Continuous learning',
              ],
            },
          ],
        },
  );

  readonly credentials = computed(() =>
    this.currentLanguage() === 'es'
      ? {
          eyebrow: 'Formación y credenciales',
          title: 'Base académica y credenciales técnicas',
          description: '',
          highlights: this.credentialHighlights('Perfil actual', 'Desarrollo de software, APIs y arquitectura backend.'),
          actionLabel: 'Ver formación y credenciales',
        }
      : {
          eyebrow: 'Education and certifications',
          title: 'Academic foundation and technical credentials',
          description: '',
          highlights: this.credentialHighlights('Current profile', 'Software development, APIs, and backend architecture.'),
          actionLabel: 'View education and certifications',
        },
  );

  readonly workAreasSection = computed(() =>
    this.currentLanguage() === 'es'
      ? {
          eyebrow: 'Perfil técnico',
          title: 'Stack y enfoque',
          description:
            'Distribución estimada de mi stack actual y de las áreas donde hoy aporto más valor dentro del desarrollo de software.',
        }
      : {
          eyebrow: 'Technical profile',
          title: 'Stack and focus',
          description:
            'Estimated view of my current stack and the areas where I currently bring the most value in software development.',
        },
  );

  readonly workAreas = computed<WorkArea[]>(() =>
    this.currentLanguage() === 'es'
      ? [
          {
            label: 'Backend',
            level: 88,
            description:
              'Java, Spring Boot, .NET, diseño de APIs, seguridad y lógica de negocio para servicios mantenibles.',
          },
          {
            label: 'Frontend',
            level: 74,
            description:
              'Angular, TypeScript, componentes reutilizables, consumo de APIs y resolución visual orientada a producto.',
          },
          {
            label: 'Data',
            level: 70,
            description:
              'Modelado relacional, consultas SQL, PostgreSQL y persistencia para flujos transaccionales y operativos.',
          },
          {
            label: 'Herramientas',
            level: 76,
            description:
              'Docker, Git, Maven, Postman y tooling de desarrollo para entornos reproducibles y trabajo diario.',
          },
        ]
      : [
          {
            label: 'Backend',
            level: 88,
            description:
              'Java, Spring Boot, .NET, API design, security, and business logic for maintainable services.',
          },
          {
            label: 'Frontend',
            level: 74,
            description:
              'Angular, TypeScript, reusable components, API consumption, and product-oriented visual execution.',
          },
          {
            label: 'Data',
            level: 70,
            description:
              'Relational modeling, SQL querying, PostgreSQL, and persistence for transactional and operational flows.',
          },
          {
            label: 'Tools',
            level: 76,
            description:
              'Docker, Git, Maven, Postman, and daily development tooling for reproducible environments.',
          },
        ],
  );

  readonly activeBaseCategory = computed(() => {
    const selectedCategoryId = this.activeBaseCategoryId();
    return (
      this.technicalBase().categories.find((category) => category.id === selectedCategoryId) ??
      this.technicalBase().categories[0]
    );
  });

  constructor() {
    void this.loadCredentials();
  }

  setBaseCategory(categoryId: TechnicalBaseCategoryId): void {
    if (categoryId === this.activeBaseCategoryId()) {
      return;
    }

    this.motionService.runWithViewTransition(() => {
      this.activeBaseCategoryId.set(categoryId);
    });
  }

  isBaseCategoryActive(categoryId: TechnicalBaseCategoryId): boolean {
    return this.activeBaseCategoryId() === categoryId;
  }

  onProfileImageError(): void {
    this.profileImageAvailable.set(false);
  }

  private credentialHighlights(fallbackLabel: string, fallbackValue: string): { label: string; value: string }[] {
    const language = this.currentLanguage();
    const entries = this.credentialEntries()
      .filter((entry) => entry.language === language)
      .sort((left, right) => left.displayOrder - right.displayOrder || left.title.localeCompare(right.title));

    if (!entries.length) {
      return [{ label: fallbackLabel, value: fallbackValue }];
    }

    return entries.slice(0, 4).map((entry) => ({
      label: entry.type,
      value: entry.title,
    }));
  }

  private async loadCredentials(): Promise<void> {
    try {
      const response = await firstValueFrom(this.credentialService.listCredentials());
      this.credentialEntries.set(response?.data ?? []);
    } catch {
      this.credentialEntries.set([]);
    }
  }
}
