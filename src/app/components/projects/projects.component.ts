import { DOCUMENT } from '@angular/common';
import {
  Component,
  computed,
  ElementRef,
  HostListener,
  Inject,
  inject,
  OnDestroy,
  Renderer2,
  ViewChild,
  signal,
} from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

import { PORTFOLIO_PROJECTS } from '../../data/portfolio.data';
import { ProjectActionType, localizeText } from '../../data/portfolio.models';
import { LanguageService } from '../../services/language.service';

interface ProjectActionView {
  id: string;
  type: ProjectActionType;
  label: string;
  primary: boolean;
  url?: string;
  routerLink?: string;
}

interface ProjectView {
  id: string;
  name: string;
  year: string;
  category: string;
  status: string;
  summary: string;
  description: string;
  stack: string[];
  metrics: Array<{
    value: string;
    label: string;
  }>;
  sections: Array<{
    title: string;
    items: string[];
  }>;
  features: string[];
  actions: ProjectActionView[];
  media?: {
    thumbnailUrl?: string;
    embedUrl?: string;
    alt: string;
    iframeTitle?: string;
  };
}

@Component({
  selector: 'app-projects',
  standalone: false,
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.scss',
})
export class ProjectsComponent implements OnDestroy {
  private readonly languageService = inject(LanguageService);

  @ViewChild('projectDialog') projectDialog?: ElementRef<HTMLElement>;
  @ViewChild('projectCloseButton') projectCloseButton?: ElementRef<HTMLButtonElement>;

  readonly currentLanguage = this.languageService.language;
  readonly selectedProjectId = signal(PORTFOLIO_PROJECTS[0].id);
  readonly ui = computed(() =>
    this.currentLanguage() === 'es'
      ? {
          eyebrow: 'Proyectos',
          title: 'Proyectos presentados como casos tecnicos, con detalle expandido cuando importa.',
          intro:
            'Cada proyecto resume su valor tecnico desde la entrada y mantiene un patron consistente para profundizar stack, decisiones y alcance.',
          stackTitle: 'Stack',
          featuresTitle: 'Puntos destacados',
          selectorAriaLabel: 'Seleccionar proyecto',
          demoModalClose: 'Cerrar demo del proyecto',
          demoEyebrow: 'Demo seleccionada',
          activePreviewLabel: 'Detalle activo',
          moreProjectsLabel: 'Casos tecnicos organizados para comparar alcance, arquitectura y stack.',
        }
      : {
          eyebrow: 'Projects',
          title: 'Projects presented as technical cases, with expanded detail when it matters.',
          intro:
            'Each project states its technical value upfront and follows a consistent pattern for stack, decisions, and scope.',
          stackTitle: 'Stack',
          featuresTitle: 'Highlights',
          selectorAriaLabel: 'Select project',
          demoModalClose: 'Close project demo',
          demoEyebrow: 'Selected demo',
          activePreviewLabel: 'Active detail',
          moreProjectsLabel: 'Technical cases organized to compare scope, architecture, and stack.',
        },
  );
  readonly projects = computed<ProjectView[]>(() => {
    const language = this.currentLanguage();

    return PORTFOLIO_PROJECTS.map((project) => ({
      id: project.id,
      name: project.name,
      year: project.year,
      category: localizeText(project.category, language),
      status: localizeText(project.status, language),
      summary: localizeText(project.summary, language),
      description: localizeText(project.description, language),
      stack: project.stack,
      metrics: project.metrics.map((metric) => ({
        value: metric.value,
        label: localizeText(metric.label, language),
      })),
      sections: project.sections.map((section) => ({
        title: localizeText(section.title, language),
        items: section.items.map((item) => localizeText(item, language)),
      })),
      features: project.features.map((feature) => localizeText(feature, language)),
      actions: project.actions.map((action) => ({
        id: action.id,
        type: action.type,
        label: localizeText(action.label, language),
        primary: Boolean(action.primary),
        url: action.url,
        routerLink: action.routerLink,
      })),
      media: project.media
        ? {
            thumbnailUrl: project.media.thumbnailUrl,
            embedUrl: project.media.embedUrl,
            alt: localizeText(project.media.alt, language),
            iframeTitle: project.media.iframeTitle
              ? localizeText(project.media.iframeTitle, language)
              : undefined,
          }
        : undefined,
    }));
  });
  readonly activeProject = computed(
    () =>
      this.projects().find((project) => project.id === this.selectedProjectId()) ?? this.projects()[0],
  );
  readonly activeProjectEmbedUrl = computed<SafeResourceUrl | null>(() => {
    const embedUrl = this.activeProject()?.media?.embedUrl;
    return embedUrl ? this.sanitizer.bypassSecurityTrustResourceUrl(embedUrl) : null;
  });

  isDemoOpen = false;

  private lastFocusedElement: HTMLElement | null = null;

  constructor(
    private readonly sanitizer: DomSanitizer,
    private readonly renderer: Renderer2,
    @Inject(DOCUMENT) private readonly document: Document,
  ) {}

  selectProject(projectId: string): void {
    this.selectedProjectId.set(projectId);
  }

  openProjectDemo(event?: Event): void {
    if (!this.activeProject()?.media?.embedUrl) {
      return;
    }

    if (event?.currentTarget instanceof HTMLElement) {
      this.lastFocusedElement = event.currentTarget;
    } else if (this.document.activeElement instanceof HTMLElement) {
      this.lastFocusedElement = this.document.activeElement;
    }

    this.isDemoOpen = true;
    this.renderer.setStyle(this.document.body, 'overflow', 'hidden');

    setTimeout(() => {
      this.projectCloseButton?.nativeElement.focus();
    });
  }

  closeProjectDemo(): void {
    if (!this.isDemoOpen) {
      return;
    }

    this.isDemoOpen = false;
    this.renderer.removeStyle(this.document.body, 'overflow');

    setTimeout(() => {
      this.lastFocusedElement?.focus();
    });
  }

  onBackdropClick(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      this.closeProjectDemo();
    }
  }

  isActionType(action: ProjectActionView, type: ProjectActionType): boolean {
    return action.type === type;
  }

  @HostListener('document:keydown', ['$event'])
  onDocumentKeydown(event: KeyboardEvent): void {
    if (!this.isDemoOpen) {
      return;
    }

    if (event.key === 'Escape') {
      event.preventDefault();
      this.closeProjectDemo();
      return;
    }

    if (event.key === 'Tab') {
      this.trapFocus(event);
    }
  }

  private trapFocus(event: KeyboardEvent): void {
    const dialogElement = this.projectDialog?.nativeElement;
    if (!dialogElement) {
      return;
    }

    const focusableElements = dialogElement.querySelectorAll<HTMLElement>(
      'button:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])',
    );
    if (!focusableElements.length) {
      return;
    }

    const firstFocusable = focusableElements[0];
    const lastFocusable = focusableElements[focusableElements.length - 1];
    const activeElement = this.document.activeElement;

    if (event.shiftKey && activeElement === firstFocusable) {
      event.preventDefault();
      lastFocusable.focus();
      return;
    }

    if (!event.shiftKey && activeElement === lastFocusable) {
      event.preventDefault();
      firstFocusable.focus();
    }
  }

  ngOnDestroy(): void {
    this.renderer.removeStyle(this.document.body, 'overflow');
  }
}
