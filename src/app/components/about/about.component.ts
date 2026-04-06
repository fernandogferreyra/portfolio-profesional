import { Component, computed, inject } from '@angular/core';

import { translations } from '../../i18n/translations';
import { LanguageService } from '../../services/language.service';

@Component({
  selector: 'app-about',
  standalone: false,
  templateUrl: './about.component.html',
  styleUrl: './about.component.scss',
})
export class AboutComponent {
  private readonly languageService = inject(LanguageService);

  readonly currentLanguage = this.languageService.language;
  readonly content = computed(() => {
    const language = this.currentLanguage();
    const baseContent = translations[language].about;

    return language === 'es'
      ? {
          ...baseContent,
          eyebrow: 'Fullstack Developer | Backend-focused',
          heroTitle:
            'Experiencia técnica construida desde electrónica, hardware y diagnóstico de sistemas, hoy aplicada al desarrollo fullstack con foco en backend.',
          heroLead:
            'Desarrollador fullstack con foco en backend. Mi recorrido en electrónica, hardware y diagnóstico me dio una base técnica que hoy aplico en APIs, integraciones, arquitectura y desarrollo de software.',
          summaryDescription:
            'Combino formación en programación, experiencia técnica de campo y foco actual en backend para construir servicios, APIs e integraciones con criterio de mantenimiento.',
          storyTitle: 'Base técnica y transición al software',
          storyDescription:
            'Mi recorrido profesional comenzó en electrónica, hardware y diagnóstico de sistemas. Esa experiencia fue la base desde la que pasé al desarrollo de software.',
          paragraphs: [
            'Durante años trabajé en electrónica, reparación de hardware, soporte técnico y diagnóstico de fallas. Esa etapa me dio precisión técnica, método de análisis y una forma práctica de resolver problemas complejos.',
            'Con esa base avancé hacia el desarrollo de software, completé la Tecnicatura Universitaria en Programación en UTN FRC y empecé a trabajar con Java, Spring Boot, .NET, Angular y bases de datos relacionales y no relacionales.',
            'Hoy me posiciono como desarrollador fullstack con foco en backend. Trabajo en APIs, microservicios, integraciones y aplicaciones end-to-end, priorizando claridad técnica, mantenibilidad y escalabilidad.',
          ],
          journey: [
            {
              title: 'Electrónica y hardware',
              description:
                'Experiencia técnica en reparación, configuración y trabajo directo con hardware y equipos reales.',
            },
            {
              title: 'Diagnóstico de sistemas',
              description:
                'Análisis de fallas, detección de causas y resolución de problemas con enfoque práctico y metódico.',
            },
            {
              title: 'Formación en software',
              description:
                'Tecnicatura Universitaria en Programación en UTN FRC y consolidación del paso hacia el desarrollo profesional.',
            },
            {
              title: 'Fullstack con foco backend',
              description:
                'Trabajo con Java, Spring Boot, .NET, Angular, APIs REST, seguridad, bases de datos e integración entre sistemas.',
            },
          ],
          projectDescription:
            'Plataforma de gestión de mantenimientos y reparaciones desarrollada con Java 17 y Spring Boot sobre arquitectura de microservicios. Me permitió consolidar experiencia en backend, seguridad, integración y diseño de servicios distribuidos.',
          interestsDescription:
            'Temas que sigo explorando porque amplían mi mirada como profesional del software.',
        }
      : {
          ...baseContent,
          eyebrow: 'Fullstack Developer | Backend-focused',
          heroTitle:
            'Technical experience built through electronics, hardware, and systems diagnostics, now applied to fullstack development with a backend focus.',
          heroLead:
            'Fullstack developer with a backend focus. My background in electronics, hardware, and diagnostics gave me a technical foundation that I now apply to APIs, integrations, architecture, and software development.',
          summaryDescription:
            'I combine programming training, field technical experience, and a current backend focus to build services, APIs, and integrations with maintainability in mind.',
          storyTitle: 'Technical foundation and transition into software',
          storyDescription:
            'My professional path started in electronics, hardware, and systems diagnostics. That experience became the foundation for my transition into software development.',
          paragraphs: [
            'I spent years working in electronics, hardware repair, technical support, and system diagnostics. That stage gave me technical precision, analytical discipline, and a practical way to approach complex problems.',
            'With that foundation I moved into software development, completed the University Programming Technician degree at UTN FRC, and started building applications with Java, Spring Boot, .NET, Angular, and both relational and non-relational databases.',
            'Today I work as a fullstack developer with a backend focus. I build APIs, microservices, integrations, and end-to-end applications while prioritizing technical clarity, maintainability, and scalability.',
          ],
          journey: [
            {
              title: 'Electronics and hardware',
              description:
                'Technical experience in repair, configuration, and hands-on work with real hardware and equipment.',
            },
            {
              title: 'Systems diagnostics',
              description:
                'Failure analysis, root cause detection, and problem solving with a practical and methodical approach.',
            },
            {
              title: 'Software training',
              description:
                'University Programming Technician degree at UTN FRC and a solid transition into professional software development.',
            },
            {
              title: 'Fullstack with backend focus',
              description:
                'Work centered on Java, Spring Boot, .NET, Angular, REST APIs, security, databases, and systems integration.',
            },
          ],
          projectDescription:
            'Maintenance and repair management platform built with Java 17 and Spring Boot on top of a microservices architecture. It helped consolidate my experience in backend development, security, integration, and distributed service design.',
          interestsDescription:
            'Topics I keep exploring because they broaden my perspective as a software professional.',
        };
  });
  readonly portraitContent = computed(() =>
    this.currentLanguage() === 'es'
      ? {
          eyebrow: 'Base técnica',
          title: 'Experiencia previa aplicada al desarrollo actual',
          description:
            'Electrónica, hardware y diagnóstico de sistemas forman parte de la base técnica que hoy traslado al desarrollo de software.',
          tags: ['Electrónica', 'Hardware', 'Diagnóstico'],
        }
      : {
          eyebrow: 'Technical foundation',
          title: 'Previous experience applied to current development work',
          description:
            'Electronics, hardware, and systems diagnostics are part of the technical foundation I now bring into software development.',
          tags: ['Electronics', 'Hardware', 'Diagnostics'],
        },
  );
  readonly capabilityCards = computed(() =>
    this.currentLanguage() === 'es'
      ? [
          {
            title: 'Backend',
            description:
              'Experiencia en APIs, microservicios, seguridad, lógica de negocio y mantenimiento de servicios.',
          },
          {
            title: 'Integración fullstack',
            description:
              'Capacidad para conectar backend, frontend, bases de datos y flujo funcional dentro de una misma solución.',
          },
          {
            title: 'Diagnóstico técnico',
            description:
              'Base previa en hardware y diagnóstico que aporta criterio para analizar fallas y entender sistemas completos.',
          },
        ]
      : [
          {
            title: 'Backend',
            description:
              'Experience in APIs, microservices, security, business logic, and service maintainability.',
          },
          {
            title: 'Fullstack integration',
            description:
              'Ability to connect backend, frontend, databases, and functional flow inside the same solution.',
          },
          {
            title: 'Technical diagnostics',
            description:
              'Previous hardware and diagnostics background that adds judgment when analyzing failures and complete systems.',
          },
        ],
  );
}
