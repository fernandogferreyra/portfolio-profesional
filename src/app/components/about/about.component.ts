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
          eyebrow: 'Backend Developer | APIs, microservicios y sistemas escalables',
          heroLead:
            'Desarrollador backend con formacion universitaria en programacion y mas de 15 anos de experiencia tecnica. Combino software, infraestructura y pensamiento sistemico para construir soluciones mantenibles y escalables.',
          interestsDescription:
            'Temas que sigo explorando porque amplian mi mirada como profesional del software.',
        }
      : {
          ...baseContent,
          eyebrow: 'Backend Developer | APIs, microservices, and scalable systems',
          heroTitle:
            'Solid backend development, clean architecture, and a technical profile shaped in real environments.',
          heroLead:
            'Backend developer with university-level programming training and more than 15 years of technical experience. I combine software, infrastructure, and systems thinking to build maintainable and scalable solutions.',
          paragraphs: [
            baseContent.paragraphs[0],
            baseContent.paragraphs[1],
            'Today my main focus is backend development, microservices architecture, REST APIs, and systems integration. I am especially interested in building scalable solutions that remain clear to maintain and aligned with practices such as SOLID, Clean Architecture, and testing.',
          ],
          projectDescription:
            'Maintenance and repair management platform built with Java 17 and Spring Boot on top of a microservices architecture. It became a key project to consolidate my experience in backend development, integration, and distributed systems design.',
          interestsDescription:
            'Topics I keep exploring because they broaden my perspective as a software professional.',
        };
  });
  readonly portraitContent = computed(() =>
    this.currentLanguage() === 'es'
      ? {
          eyebrow: 'Perfil visual',
          title: 'Retrato profesional integrado al portfolio',
          description:
            'El bloque visual acompana la narrativa tecnica del perfil y refuerza la presencia profesional dentro del portfolio.',
          tags: ['Identidad profesional', 'Presencia personal', 'Perfil tecnico'],
        }
      : {
          eyebrow: 'Visual profile',
          title: 'Professional portrait integrated into the portfolio',
          description:
            'This visual block supports the technical narrative and reinforces professional presence throughout the portfolio.',
          tags: ['Professional identity', 'Personal presence', 'Technical profile'],
        },
  );
  readonly capabilityCards = computed(() =>
    this.currentLanguage() === 'es'
      ? [
          {
            title: 'Backend especializado',
            description:
              'El perfil comunica con claridad experiencia en APIs, microservicios, integraciones y mantenimiento de servicios.',
          },
          {
            title: 'Vision de sistema',
            description:
              'La narrativa muestra criterio tecnico para relacionar dominio, arquitectura, datos, seguridad y operacion.',
          },
          {
            title: 'Perfil tecnico',
            description:
              'Cada seccion aporta una capa distinta del perfil profesional sin repetir informacion ni perder foco.',
          },
        ]
      : [
          {
            title: 'Backend specialization',
            description:
              'The profile communicates clear experience in APIs, microservices, integrations, and service maintainability.',
          },
          {
            title: 'Systems perspective',
            description:
              'The narrative shows technical judgment across domain design, architecture, data, security, and operations.',
          },
          {
            title: 'Technical profile',
            description:
              'Each section adds a distinct layer to the professional profile without repeating information or losing focus.',
          },
        ],
  );
}
