import { Component, computed, inject, signal } from '@angular/core';

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

  readonly currentLanguage = this.languageService.language;
  readonly activeBaseCategoryId = signal<TechnicalBaseCategoryId>('electronics');
  readonly profileImageAvailable = signal(true);
  readonly profileImageUrl = 'images/profile-photo.jpg';

  readonly ui = computed(() =>
    this.currentLanguage() === 'es'
      ? {
          eyebrow: 'Fernando G. Ferreyra',
          title: 'Fullstack Developer',
          subtitle: 'Backend-focused | Java \u00B7 Spring Boot \u00B7 .NET \u00B7 APIs',
          lead:
            'Desarrollo aplicaciones de punta a punta, con especial foco en backend, arquitectura y diseno de APIs escalables.',
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
          eyebrow: 'Sobre mi',
          title: 'Recorrido y perfil actual',
          lead:
            'Mi recorrido profesional comenzo en electronica, informatica y diagnostico de sistemas. Esa base tecnica hoy se traduce en una forma de trabajar orientada al analisis, la integracion y el desarrollo fullstack con foco backend.',
          paragraphs: [
            'Durante anos trabaje con hardware, reparacion, mantenimiento, soporte tecnico y puesta a punto de equipos. Esa experiencia me dio criterio para diagnosticar fallas, entender sistemas completos y resolver problemas de forma practica.',
            'Con esa base avance hacia el desarrollo de software, complete la Tecnicatura Universitaria en Programacion en UTN FRC y empece a trabajar con Java, Spring Boot, .NET, Angular y bases de datos relacionales y no relacionales.',
            'Hoy trabajo como fullstack developer con foco en backend, APIs y microservicios, manteniendo una mirada integral para conectar frontend, datos, servicios y herramientas de despliegue.',
          ],
        }
      : {
          eyebrow: 'About',
          title: 'Background and current profile',
          lead:
            'My professional path started in electronics, IT, and systems diagnostics. That technical base now translates into a way of working focused on analysis, integration, and fullstack development with a backend focus.',
          paragraphs: [
            'For years I worked with hardware, repair, maintenance, technical support, and system setup. That experience gave me judgment to diagnose failures, understand complete systems, and solve problems in a practical way.',
            'With that foundation I moved into software development, completed the University Programming Technician degree at UTN FRC, and started working with Java, Spring Boot, .NET, Angular, and both relational and non-relational databases.',
            'Today I work as a fullstack developer with a backend focus on APIs and microservices, while keeping the broader view needed to connect frontend, data, services, and delivery tooling.',
          ],
        },
  );

  readonly technicalBase = computed(() =>
    this.currentLanguage() === 'es'
      ? {
          eyebrow: 'Recorrido tecnico',
          title: 'Trayectoria tecnica',
          description:
            'Una base construida en electronica, informatica y desarrollo, con experiencia practica en diagnostico, mantenimiento e integracion de sistemas.',
          ariaLabel: 'Categorias de recorrido tecnico',
          categories: [
            {
              id: 'electronics' as const,
              label: 'Electronica',
              description:
                'Trabajo sobre diagnostico, reparacion, mantenimiento y analisis de fallas en equipos y hardware.',
              items: ['Diagnostico', 'Reparacion', 'Mantenimiento', 'Hardware'],
            },
            {
              id: 'it' as const,
              label: 'Informatica',
              description:
                'Soporte tecnico y puesta a punto de equipos, sistemas operativos y entornos de usuario.',
              items: [
                'Instalacion de sistemas operativos',
                'Formateos',
                'Redes basicas',
                'Mantenimiento',
                'Arquitectura de PC',
              ],
            },
            {
              id: 'development' as const,
              label: 'Desarrollo',
              description:
                'Trabajo actual centrado en backend, integracion entre servicios y desarrollo fullstack.',
              items: ['Backend', 'APIs', 'Microservicios', 'Integracion', 'Desarrollo fullstack'],
            },
          ],
        }
      : {
          eyebrow: 'Technical path',
          title: 'Technical background',
          description:
            'A foundation built in electronics, IT, and software, with practical experience in diagnostics, maintenance, and systems integration.',
          ariaLabel: 'Technical background categories',
          categories: [
            {
              id: 'electronics' as const,
              label: 'Electronics',
              description:
                'Hands-on work around diagnostics, repair, maintenance, and hardware fault analysis.',
              items: ['Diagnostics', 'Repair', 'Maintenance', 'Hardware'],
            },
            {
              id: 'it' as const,
              label: 'IT',
              description:
                'Technical support and system setup across operating systems and end-user environments.',
              items: [
                'Operating system installation',
                'Formatting',
                'Basic networking',
                'Maintenance',
                'PC architecture',
              ],
            },
            {
              id: 'development' as const,
              label: 'Development',
              description:
                'Current work centered on backend, service integration, and fullstack delivery.',
              items: ['Backend', 'APIs', 'Microservices', 'Integration', 'Fullstack development'],
            },
          ],
        },
  );

  readonly credentials = computed(() =>
    this.currentLanguage() === 'es'
      ? {
          eyebrow: 'Formacion y certificaciones',
          title: 'Base academica y credenciales tecnicas',
          description:
            'Resumen pensado para reunir formacion formal y futuras certificaciones con referencia institucional y contexto tecnico.',
          highlights: [
            {
              label: 'Formacion base',
              value: 'Tecnicatura Universitaria en Programacion - UTN FRC.',
            },
            {
              label: 'Perfil actual',
              value: 'Backend, APIs, arquitectura e integracion de sistemas.',
            },
            {
              label: 'Proxima incorporacion',
              value: 'Credenciales y certificados tecnicos con institucion, imagen y descripcion breve.',
            },
          ],
          actionLabel: 'Ver formacion y certificaciones',
        }
      : {
          eyebrow: 'Education and certifications',
          title: 'Academic foundation and technical credentials',
          description:
            'A structured summary intended to gather formal education and future certifications with institutional reference and technical context.',
          highlights: [
            {
              label: 'Core education',
              value: 'University Programming Technician degree - UTN FRC.',
            },
            {
              label: 'Current profile',
              value: 'Backend, APIs, architecture, and systems integration.',
            },
            {
              label: 'Next addition',
              value: 'Technical credentials and certificates with institution, image, and concise description.',
            },
          ],
          actionLabel: 'View education and certifications',
        },
  );

  readonly workAreasSection = computed(() =>
    this.currentLanguage() === 'es'
      ? {
          eyebrow: 'Areas de trabajo',
          title: 'Foco actual',
          description:
            'Distribucion estimada de mi perfil tecnico segun el tipo de trabajo que hoy realizo con mayor frecuencia.',
        }
      : {
          eyebrow: 'Work areas',
          title: 'Current focus',
          description:
            'Estimated distribution of my technical profile based on the type of work I currently do most often.',
        },
  );

  readonly workAreas = computed<WorkArea[]>(() =>
    this.currentLanguage() === 'es'
      ? [
          {
            label: 'Backend',
            level: 90,
            description:
              'Java, Spring Boot, .NET, APIs REST, seguridad, microservicios e integracion entre servicios.',
          },
          {
            label: 'Fullstack',
            level: 76,
            description:
              'Desarrollo end-to-end conectando backend, frontend Angular, datos y flujo funcional.',
          },
          {
            label: 'Tools / Infraestructura',
            level: 72,
            description:
              'Docker, Git, Maven, bases de datos, testing y entornos reproducibles para desarrollo.',
          },
        ]
      : [
          {
            label: 'Backend',
            level: 90,
            description:
              'Java, Spring Boot, .NET, REST APIs, security, microservices, and service integration.',
          },
          {
            label: 'Fullstack',
            level: 76,
            description:
              'End-to-end development connecting backend, Angular frontend, data, and functional flow.',
          },
          {
            label: 'Tools / Infrastructure',
            level: 72,
            description:
              'Docker, Git, Maven, databases, testing, and reproducible environments for development work.',
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
}
