import { Component, computed, inject } from '@angular/core';

import { PORTFOLIO_PROJECTS, PORTFOLIO_THEMES } from '../../data/portfolio.data';
import { localizeText } from '../../data/portfolio.models';
import { LanguageService } from '../../services/language.service';
import { ThemeService } from '../../services/theme.service';
import type { HomeFeaturedProject } from '../home-project-showcase/home-project-showcase.component';

interface HomeSectionCard {
  title: string;
  description: string;
  routerLink: string;
}

@Component({
  selector: 'app-home',
  standalone: false,
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  private readonly languageService = inject(LanguageService);
  private readonly themeService = inject(ThemeService);

  readonly currentLanguage = this.languageService.language;
  readonly activeTheme = this.themeService.activeTheme;
  readonly ui = computed(() =>
    this.currentLanguage() === 'es'
      ? {
          eyebrow: 'Portfolio tecnico',
          role: 'Backend Developer | APIs, microservicios y sistemas escalables',
          lead:
            'Desarrollo APIs, microservicios e integraciones para productos que necesitan backend claro, mantenible y pensado para escalar con criterio tecnico.',
          primaryAction: 'Ver proyectos',
          secondaryAction: 'Ver CV',
          sectionsTitle: 'Recorrido del portfolio',
          sectionsDescription:
            'La home funciona como una entrada clara al portfolio y conecta cada bloque con la profundidad tecnica que corresponde.',
          themesTitle: 'Themes visuales',
          themesDescription:
            'Tres direcciones visuales conviven sobre el mismo sistema de tokens y mantienen consistencia en toda la interfaz.',
          showcaseEyebrow: 'Proyectos seleccionados',
          selectorAriaLabel: 'Seleccion de proyectos destacados',
          stackAriaLabel: 'Tecnologias destacadas del proyecto',
          activeThemeLabel: 'Theme activo',
        }
      : {
          eyebrow: 'Technical portfolio',
          role: 'Backend Developer | APIs, microservices, and scalable systems',
          lead:
            'I build APIs, microservices, and integrations for products that need clear, maintainable backend systems designed to scale with sound technical judgment.',
          primaryAction: 'View projects',
          secondaryAction: 'View resume',
          sectionsTitle: 'Portfolio flow',
          sectionsDescription:
            'Home works as a clear portfolio entry point and connects each block with the right level of technical depth.',
          themesTitle: 'Visual themes',
          themesDescription:
            'Three visual directions share the same token system and keep the interface consistent across the portfolio.',
          showcaseEyebrow: 'Selected projects',
          selectorAriaLabel: 'Featured project selection',
          stackAriaLabel: 'Featured project technologies',
          activeThemeLabel: 'Active theme',
        },
  );
  readonly featuredProjects = computed<HomeFeaturedProject[]>(() => {
    const language = this.currentLanguage();

    return PORTFOLIO_PROJECTS.map((project) => {
      if (project.id === 'obrasmart') {
        return {
          id: project.id,
          name: project.name,
          meta: `${localizeText(project.status, language)} | ${project.year}`,
          description: localizeText(project.summary, language),
          stackAriaLabel: this.ui().stackAriaLabel,
          technologies: project.stack.slice(0, 5),
          actions: [
            {
              id: 'case',
              label: language === 'es' ? 'Ver caso' : 'View case',
              primary: true,
              routerLink: '/projects',
            },
            {
              id: 'repo',
              label: language === 'es' ? 'Codigo' : 'Code',
              url: this.obraSmartRepoUrl,
            },
            {
              id: 'doc',
              label: language === 'es' ? 'Monografia' : 'Monograph',
              url: this.obraSmartMonographUrl,
            },
          ],
        };
      }

      return {
        id: project.id,
        name: project.name,
        meta: `${localizeText(project.status, language)} | ${project.year}`,
        description: localizeText(project.summary, language),
        stackAriaLabel: this.ui().stackAriaLabel,
        technologies: project.stack.slice(0, 5),
        actions: [
          {
            id: 'overview',
            label: language === 'es' ? 'Ver detalle' : 'View detail',
            primary: true,
            routerLink: '/projects',
          },
          {
            id: 'skills',
            label: language === 'es' ? 'Ver skills' : 'View skills',
            routerLink: '/skills',
          },
          {
            id: 'contact',
            label: language === 'es' ? 'Contacto' : 'Contact',
            routerLink: '/contact',
          },
        ],
      };
    });
  });
  readonly sectionCards = computed<HomeSectionCard[]>(() =>
    this.currentLanguage() === 'es'
      ? [
          {
            title: 'Sobre mi',
            description: 'Perfil, recorrido tecnico, fortalezas y presentacion personal integrada al layout.',
            routerLink: '/about',
          },
          {
            title: 'Proyectos',
            description: 'Casos tecnicos compactos con stack, decisiones y detalle expandido por proyecto.',
            routerLink: '/projects',
          },
          {
            title: 'Skills',
            description: 'Stack principal y categorias tecnicas en una vista unica, concreta y facil de recorrer.',
            routerLink: '/skills',
          },
          {
            title: 'Contacto',
            description: 'Canales profesionales claros y acceso directo para iniciar una conversacion.',
            routerLink: '/contact',
          },
        ]
      : [
          {
            title: 'About',
            description: 'Profile, technical path, strengths, and personal presentation integrated into the layout.',
            routerLink: '/about',
          },
          {
            title: 'Projects',
            description: 'Compact technical cases with stack, decisions, and expanded detail per project.',
            routerLink: '/projects',
          },
          {
            title: 'Skills',
            description: 'Core stack and technical categories in one clear, concrete browsing experience.',
            routerLink: '/skills',
          },
          {
            title: 'Contact',
            description: 'Clear professional channels and direct access to start a conversation.',
            routerLink: '/contact',
          },
        ],
  );
  readonly themePresets = computed(() =>
    PORTFOLIO_THEMES.map((theme) => ({
      id: theme.id,
      shortLabel: theme.shortLabel,
      label: localizeText(theme.label, this.currentLanguage()),
      description: localizeText(theme.description, this.currentLanguage()),
      preview: theme.preview,
      active: this.activeTheme() === theme.id,
    })),
  );

  readonly resumeUrl = '/docs/cv-fernando-ferreyra.pdf';
  readonly obraSmartRepoUrl =
    'https://github.com/114320-FERREYRA-FERNANDO-GABRIEL/obrasmart-platform.git';
  readonly obraSmartMonographUrl = '/docs/MonografiaObraSmart.pdf';
}
