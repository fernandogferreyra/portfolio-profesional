import { DOCUMENT } from '@angular/common';
import {
  Component,
  ElementRef,
  HostListener,
  Inject,
  Renderer2,
  ViewChild,
  computed,
  inject,
  signal,
} from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

import { PORTFOLIO_PROJECTS, SKILL_ICONS } from '../../data/portfolio.data';
import { ProjectActionType, SkillIconId, localizeText } from '../../data/portfolio.models';
import { LanguageService } from '../../services/language.service';
import { MotionService } from '../../services/motion.service';
import { SiteActivityService } from '../../services/site-activity.service';

interface ProjectActionView {
  id: string;
  type: ProjectActionType;
  label: string;
  primary: boolean;
  url?: string;
  routerLink?: string;
}

interface ProjectTechnologyView {
  name: string;
  icon: SkillIconId;
}

interface ProjectView {
  id: string;
  icon: SkillIconId;
  name: string;
  year: string;
  category: string;
  summary: string;
  description: string;
  stack: ProjectTechnologyView[];
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

const STACK_ICON_RULES: Array<{ pattern: RegExp; icon: SkillIconId }> = [
  { pattern: /java/i, icon: 'java' },
  { pattern: /spring/i, icon: 'spring' },
  { pattern: /\.net|dotnet/i, icon: 'dotnet' },
  { pattern: /angular|pwa/i, icon: 'angular' },
  { pattern: /typescript/i, icon: 'typescript' },
  { pattern: /scss|html|css|frontend/i, icon: 'frontend' },
  { pattern: /postgres/i, icon: 'postgresql' },
  { pattern: /mysql|sql|mongo/i, icon: 'database' },
  { pattern: /docker/i, icon: 'docker' },
  { pattern: /git/i, icon: 'git' },
  { pattern: /test|junit/i, icon: 'testing' },
  { pattern: /microservice/i, icon: 'microservices' },
  { pattern: /jwt|security|auth/i, icon: 'security' },
  { pattern: /\bia\b|\bai\b/i, icon: 'ai' },
  { pattern: /openapi|swagger|api|architecture|gateway|signal|theme|router/i, icon: 'architecture' },
];

@Component({
  selector: 'app-projects',
  standalone: false,
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.scss',
})
export class ProjectsComponent {
  private readonly languageService = inject(LanguageService);
  private readonly motionService = inject(MotionService);
  private readonly siteActivityService = inject(SiteActivityService);

  @ViewChild('projectDialog') projectDialog?: ElementRef<HTMLElement>;
  @ViewChild('projectCloseButton') projectCloseButton?: ElementRef<HTMLButtonElement>;

  readonly currentLanguage = this.languageService.language;
  readonly selectedProjectId = signal(PORTFOLIO_PROJECTS[0].id);
  readonly skillIcons = SKILL_ICONS;
  readonly ui = computed(() =>
    this.currentLanguage() === 'es'
      ? {
          eyebrow: 'Proyectos',
          title: 'Proyectos',
          intro:
            'Proyectos reales donde aplico arquitectura, backend y desarrollo fullstack.',
          supportingIntro:
            'Podes ver el stack, decisiones tecnicas y como esta pensado cada sistema.',
          cardsAriaLabel: 'Listado de proyectos',
          detailEyebrow: 'Detalle del proyecto',
          stackTitle: 'Stack',
          featuresTitle: 'Puntos destacados',
          previewLabel: 'Vista del proyecto',
          demoModalClose: 'Cerrar demo del proyecto',
          demoEyebrow: 'Demo del proyecto',
        }
      : {
          eyebrow: 'Projects',
          title: 'Projects',
          intro:
            'Real projects where I apply architecture, backend development, and fullstack delivery.',
          supportingIntro:
            'You can review the stack, technical decisions, and how each system is structured.',
          cardsAriaLabel: 'Project list',
          detailEyebrow: 'Project detail',
          stackTitle: 'Stack',
          featuresTitle: 'Highlights',
          previewLabel: 'Project preview',
          demoModalClose: 'Close project demo',
          demoEyebrow: 'Project demo',
        },
  );
  readonly projects = computed<ProjectView[]>(() => {
    const language = this.currentLanguage();

    return PORTFOLIO_PROJECTS.map((project) => {
      const stack = project.stack.map((technology) => ({
        name: technology,
        icon: this.resolveTechnologyIcon(technology),
      }));

      return {
        id: project.id,
        icon: stack[0]?.icon ?? 'architecture',
        name: project.name,
        year: project.year,
        category: localizeText(project.category, language),
        summary: localizeText(project.summary, language),
        description: localizeText(project.description, language),
        stack,
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
      };
    });
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
    if (projectId === this.selectedProjectId()) {
      return;
    }

    this.siteActivityService.trackProjectSelection(projectId);

    this.motionService.runWithViewTransition(() => {
      this.selectedProjectId.set(projectId);
    });
  }

  openProjectDemo(event?: Event): void {
    if (!this.activeProject()?.media?.embedUrl) {
      return;
    }

    this.siteActivityService.trackProjectDemoOpen(this.activeProject()?.id ?? 'unknown-project');

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

  trackByProjectId(_index: number, project: ProjectView): string {
    return project.id;
  }

  trackByTechnologyName(_index: number, technology: ProjectTechnologyView): string {
    return technology.name;
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

  private resolveTechnologyIcon(technology: string): SkillIconId {
    const matchedRule = STACK_ICON_RULES.find((rule) => rule.pattern.test(technology));
    return matchedRule?.icon ?? 'architecture';
  }
}
