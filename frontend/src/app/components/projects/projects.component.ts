import { DOCUMENT } from '@angular/common';
import {
  Component,
  ElementRef,
  HostListener,
  Inject,
  OnInit,
  Renderer2,
  ViewChild,
  computed,
  effect,
  inject,
  signal,
} from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { firstValueFrom, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { PORTFOLIO_PROJECTS, SKILL_ICONS } from '../../data/portfolio.data';
import { PortfolioProject, ProjectActionType, SkillIconId, localizeText } from '../../data/portfolio.models';
import { ProjectAssetResponse, ProjectMetricResponse, ProjectSectionResponse, ProjectSummaryResponse } from '../../models/projects.models';
import { DocumentAdminService } from '../../services/document-admin.service';
import { EditModeService } from '../../services/edit-mode.service';
import { LanguageService } from '../../services/language.service';
import { MotionService } from '../../services/motion.service';
import { ProjectAdminItem, ProjectAdminService, ProjectAdminUpdatePayload } from '../../services/project-admin.service';
import { ProjectsService } from '../../services/projects.service';
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
  iconUrl?: string | null;
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
  documentation: ProjectAssetResponse[];
  screenshots: ProjectAssetResponse[];
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
export class ProjectsComponent implements OnInit {
  private readonly languageService = inject(LanguageService);
  private readonly motionService = inject(MotionService);
  private readonly documentAdminService = inject(DocumentAdminService);
  private readonly projectsService = inject(ProjectsService);
  private readonly projectAdminService = inject(ProjectAdminService);
  private readonly siteActivityService = inject(SiteActivityService);

  @ViewChild('projectDialog') projectDialog?: ElementRef<HTMLElement>;
  @ViewChild('projectCloseButton') projectCloseButton?: ElementRef<HTMLButtonElement>;

  readonly currentLanguage = this.languageService.language;
  readonly editModeService = inject(EditModeService);
  readonly selectedProjectId = signal(PORTFOLIO_PROJECTS[0].id);
  readonly selectedAdminProjectId = signal<string | null>(null);
  readonly projectCatalog = signal(PORTFOLIO_PROJECTS);
  readonly adminProjects = signal<ProjectAdminItem[]>([]);
  readonly savingProjectId = signal<string | null>(null);
  readonly uploadingProjectIconId = signal<string | null>(null);
  readonly uploadingProjectAssetsId = signal<string | null>(null);
  readonly projectEditFeedback = signal<string | null>(null);
  readonly projectEditError = signal<string | null>(null);
  readonly failedProjectIconIds = signal<ReadonlySet<string>>(new Set());
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
          previewLabel: 'Demo',
          demoModalClose: 'Cerrar demo del proyecto',
          demoEyebrow: 'Demo del proyecto',
          editProjectsTitle: 'Editar proyecto seleccionado',
          editProjectsDescription: 'Estos campos actualizan la base publica de proyectos en backend.',
          editSlugLabel: 'Slug',
          editNameLabel: 'Nombre',
          editYearLabel: 'Año',
          editCategoryLabel: 'Categoria',
          editSummaryLabel: 'Resumen',
          editStackLabel: 'Stack',
          editMetricsLabel: 'Metricas',
          editMetricsHelp: 'Una por linea: valor | etiqueta',
          editSectionsLabel: 'Secciones',
          editSectionsHelp: 'Edita titulo e items por separado para no mezclar todo en una linea.',
          editSectionItemsHelp: 'Un item por linea',
          editFeaturesLabel: 'Puntos destacados',
          editFeaturesHelp: 'Uno por linea. Usalo para resaltar lo mas importante del proyecto.',
          editRepoLabel: 'Repositorio',
          editDemoLabel: 'Demo YouTube',
          editMonographLabel: 'Documentacion URL',
          editDocsLabel: 'Documentacion',
          editDocsUploadLabel: 'Subir documentos',
          editScreenshotsLabel: 'Capturas',
          editScreenshotsUploadLabel: 'Subir capturas',
          editAssetsUploadingLabel: 'Subiendo...',
          editIconLabel: 'Icono de la app',
          editIconUploadLabel: 'Subir PNG/ICO',
          editIconUploadingLabel: 'Subiendo...',
          editIconUploadedLabel: 'Icono actualizado.',
          editIconAlt: 'Icono cargado del proyecto',
          editOrderLabel: 'Orden',
          editFeaturedLabel: 'Destacado',
          editPublishedLabel: 'Publicado',
          editSaveLabel: 'Guardar proyecto',
          editSavingLabel: 'Guardando...',
          editSavedLabel: 'Proyecto actualizado.',
          editGenericError: 'No se pudo guardar el proyecto.',
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
          previewLabel: 'Demo',
          demoModalClose: 'Close project demo',
          demoEyebrow: 'Project demo',
          editProjectsTitle: 'Edit selected project',
          editProjectsDescription: 'These fields update the public projects source in the backend.',
          editSlugLabel: 'Slug',
          editNameLabel: 'Name',
          editYearLabel: 'Year',
          editCategoryLabel: 'Category',
          editSummaryLabel: 'Summary',
          editStackLabel: 'Stack',
          editMetricsLabel: 'Metrics',
          editMetricsHelp: 'One per line: value | label',
          editSectionsLabel: 'Sections',
          editSectionsHelp: 'Edit title and items separately to avoid mixing everything in one line.',
          editSectionItemsHelp: 'One item per line',
          editFeaturesLabel: 'Highlights',
          editFeaturesHelp: 'One per line',
          editRepoLabel: 'Repository',
          editDemoLabel: 'YouTube demo',
          editMonographLabel: 'Documentation URL',
          editDocsLabel: 'Documentation',
          editDocsUploadLabel: 'Upload documents',
          editScreenshotsLabel: 'Screenshots',
          editScreenshotsUploadLabel: 'Upload screenshots',
          editAssetsUploadingLabel: 'Uploading...',
          editIconLabel: 'App icon',
          editIconUploadLabel: 'Upload PNG/ICO',
          editIconUploadingLabel: 'Uploading...',
          editIconUploadedLabel: 'Icon updated.',
          editIconAlt: 'Uploaded project icon',
          editOrderLabel: 'Order',
          editFeaturedLabel: 'Featured',
          editPublishedLabel: 'Published',
          editSaveLabel: 'Save project',
          editSavingLabel: 'Saving...',
          editSavedLabel: 'Project updated.',
          editGenericError: 'The project could not be saved.',
        },
  );
  readonly projects = computed<ProjectView[]>(() => {
    const language = this.currentLanguage();

    return this.projectCatalog().map((project) => {
      const stack = project.stack.map((technology) => ({
        name: technology,
        icon: this.resolveTechnologyIcon(technology),
      }));

      return {
          id: project.id,
          icon: stack[0]?.icon ?? 'architecture',
          iconUrl: project.iconUrl,
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
        documentation: project.documentation ?? [],
        screenshots: project.screenshots ?? [],
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
  readonly activeAdminProject = computed(() => {
    const activeAdminId = this.selectedAdminProjectId();
    const activeId = this.activeProject()?.id;
    return (
      this.adminProjects().find((project) => project.id === activeAdminId) ??
      this.adminProjects().find((project) => project.slug === activeId) ??
      null
    );
  });
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
  ) {
    effect(() => {
      if (this.editModeService.isEnabled()) {
        void this.loadAdminProjects();
      }
    });
  }

  ngOnInit(): void {
    if (this.editModeService.isEnabled()) {
      return;
    }

    this.projectsService
      .getProjects()
      .pipe(catchError(() => of([])))
      .subscribe((projects) => {
        if (!projects.length) {
          return;
        }

        const mergedProjects = this.mergeProjects(projects);
        this.projectCatalog.set(mergedProjects);

        if (!mergedProjects.some((project) => project.id === this.selectedProjectId())) {
          this.selectedProjectId.set(mergedProjects[0]?.id ?? PORTFOLIO_PROJECTS[0].id);
        }
      });
  }

  selectProject(projectId: string): void {
    if (projectId === this.selectedProjectId()) {
      return;
    }

    this.siteActivityService.trackProjectSelection(projectId);

    this.motionService.runWithViewTransition(() => {
      this.selectedProjectId.set(projectId);
      this.selectedAdminProjectId.set(this.adminProjects().find((project) => project.slug === projectId)?.id ?? null);
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

  hasProjectIcon(project: ProjectView): boolean {
    return Boolean(project.iconUrl && !this.failedProjectIconIds().has(project.id));
  }

  onProjectIconError(projectId: string): void {
    this.failedProjectIconIds.update((failedIds) => new Set(failedIds).add(projectId));
  }

  projectInitials(projectName: string): string {
    const initials = projectName
      .split(/\s+/)
      .map((segment) => segment.trim().charAt(0))
      .filter(Boolean)
      .slice(0, 2)
      .join('')
      .toUpperCase();

    return initials || 'APP';
  }

  updateProjectField(
    field: 'slug' | 'name' | 'year' | 'category' | 'summary' | 'repositoryUrl' | 'demoUrl' | 'monographUrl',
    value: string,
  ): void {
    const project = this.activeAdminProject();
    if (!project) {
      return;
    }

    this.updateAdminProject(project.id, {
      ...project,
      [field]: this.isOptionalUrlField(field) ? value.trim() || null : value,
    });
  }

  async onProjectIconSelected(event: Event): Promise<void> {
    const project = this.activeAdminProject();
    const input = event.target as HTMLInputElement | null;
    const file = input?.files?.item(0) ?? null;
    if (!project || !file || !this.editModeService.isEnabled() || this.uploadingProjectIconId()) {
      return;
    }

    this.uploadingProjectIconId.set(project.id);
    this.projectEditFeedback.set(null);
    this.projectEditError.set(null);

    try {
      const uploadResponse = await firstValueFrom(this.documentAdminService.uploadDocument(file, 'project-icon'));
      const updatedProject = { ...project, iconDocumentId: uploadResponse.data.id };
      const response = await firstValueFrom(this.projectAdminService.updateProject(project.id, this.toProjectPayload(updatedProject)));
      if (response?.data) {
        this.replaceAdminProject(response.data);
        this.applyAdminProjectsToCatalog(this.adminProjects().map((item) => (item.id === response.data.id ? response.data : item)));
        this.selectedAdminProjectId.set(response.data.id);
        this.selectedProjectId.set(response.data.slug);
      }
      this.projectEditFeedback.set(this.ui().editIconUploadedLabel);
    } catch (error) {
      this.projectEditError.set(this.resolveProjectEditErrorMessage(error));
    } finally {
      this.uploadingProjectIconId.set(null);
      if (input) {
        input.value = '';
      }
    }
  }

  async onProjectAssetsSelected(kind: 'documentation' | 'screenshots', event: Event): Promise<void> {
    const project = this.activeAdminProject();
    const input = event.target as HTMLInputElement | null;
    const files = Array.from(input?.files ?? []);
    if (!project || !files.length || !this.editModeService.isEnabled() || this.uploadingProjectAssetsId()) {
      return;
    }

    this.uploadingProjectAssetsId.set(project.id);
    this.projectEditFeedback.set(null);
    this.projectEditError.set(null);

    try {
      const uploadedAssets: ProjectAssetResponse[] = [];
      for (const file of files) {
        const response = await firstValueFrom(
          this.documentAdminService.uploadDocument(file, kind === 'documentation' ? 'project-documentation' : 'project-screenshot'),
        );
        uploadedAssets.push(this.placeholderAsset(response.data.id));
      }

      const updatedProject: ProjectAdminItem = {
        ...project,
        documentation: kind === 'documentation' ? [...project.documentation, ...uploadedAssets] : project.documentation,
        screenshots: kind === 'screenshots' ? [...project.screenshots, ...uploadedAssets] : project.screenshots,
      };
      const saveResponse = await firstValueFrom(this.projectAdminService.updateProject(project.id, this.toProjectPayload(updatedProject)));
      if (saveResponse?.data) {
        this.replaceAdminProject(saveResponse.data);
        this.applyAdminProjectsToCatalog(this.adminProjects().map((item) => (item.id === saveResponse.data.id ? saveResponse.data : item)));
        this.selectedAdminProjectId.set(saveResponse.data.id);
        this.selectedProjectId.set(saveResponse.data.slug);
      }
      this.projectEditFeedback.set(this.ui().editSavedLabel);
    } catch (error) {
      this.projectEditError.set(this.resolveProjectEditErrorMessage(error));
    } finally {
      this.uploadingProjectAssetsId.set(null);
      if (input) {
        input.value = '';
      }
    }
  }

  updateProjectStack(value: string): void {
    const project = this.activeAdminProject();
    if (!project) {
      return;
    }

    this.updateAdminProject(project.id, {
      ...project,
      stack: this.parseStack(value),
    });
  }

  updateProjectMetrics(value: string): void {
    const project = this.activeAdminProject();
    if (!project) {
      return;
    }

    this.updateAdminProject(project.id, {
      ...project,
      metrics: this.parseMetrics(value),
    });
  }

  updateProjectSections(value: string): void {
    const project = this.activeAdminProject();
    if (!project) {
      return;
    }

    this.updateAdminProject(project.id, {
      ...project,
      sections: this.parseSections(value),
    });
  }

  updateProjectFeatures(value: string): void {
    const project = this.activeAdminProject();
    if (!project) {
      return;
    }

    this.updateAdminProject(project.id, {
      ...project,
      features: this.parseLines(value),
    });
  }

  updateProjectSectionTitle(index: number, value: string): void {
    const project = this.activeAdminProject();
    if (!project || !project.sections[index]) {
      return;
    }

    this.updateAdminProject(project.id, {
      ...project,
      sections: project.sections.map((section, sectionIndex) =>
        sectionIndex === index ? { ...section, title: value } : section,
      ),
    });
  }

  updateProjectSectionItems(index: number, value: string): void {
    const project = this.activeAdminProject();
    if (!project || !project.sections[index]) {
      return;
    }

    this.updateAdminProject(project.id, {
      ...project,
      sections: project.sections.map((section, sectionIndex) =>
        sectionIndex === index ? { ...section, items: this.parseLines(value) } : section,
      ),
    });
  }

  updateProjectDisplayOrder(value: number): void {
    const project = this.activeAdminProject();
    if (!project) {
      return;
    }

    this.updateAdminProject(project.id, {
      ...project,
      displayOrder: Number.isFinite(value) ? value : 0,
    });
  }

  updateProjectFlag(field: 'featured' | 'published', value: boolean): void {
    const project = this.activeAdminProject();
    if (!project) {
      return;
    }

    this.updateAdminProject(project.id, {
      ...project,
      [field]: value,
    });
  }

  async saveActiveProject(): Promise<void> {
    const project = this.activeAdminProject();
    if (!project || !this.editModeService.isEnabled() || this.savingProjectId()) {
      return;
    }

    this.savingProjectId.set(project.id);
    this.projectEditFeedback.set(null);
    this.projectEditError.set(null);

    try {
      const response = await firstValueFrom(this.projectAdminService.updateProject(project.id, this.toProjectPayload(project)));
      if (response?.data) {
        this.replaceAdminProject(response.data);
        this.applyAdminProjectsToCatalog(this.adminProjects().map((item) => (item.id === response.data.id ? response.data : item)));
        this.selectedAdminProjectId.set(response.data.id);
        this.selectedProjectId.set(response.data.slug);
      }
      this.projectEditFeedback.set(this.ui().editSavedLabel);
    } catch (error) {
      this.projectEditError.set(this.resolveProjectEditErrorMessage(error));
    } finally {
      this.savingProjectId.set(null);
    }
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

  private async loadAdminProjects(): Promise<void> {
    try {
      const response = await firstValueFrom(this.projectAdminService.listProjects());
      const projects = response?.data ?? [];
      this.adminProjects.set(projects);
      this.applyAdminProjectsToCatalog(projects);

      const selectedAdminProject = projects.find((project) => project.slug === this.selectedProjectId()) ?? projects[0];
      this.selectedAdminProjectId.set(selectedAdminProject?.id ?? null);

      if (!projects.some((project) => project.slug === this.selectedProjectId())) {
        this.selectedProjectId.set(selectedAdminProject?.slug ?? PORTFOLIO_PROJECTS[0].id);
      }
    } catch (error) {
      this.projectEditError.set(this.resolveProjectEditErrorMessage(error));
    }
  }

  private applyAdminProjectsToCatalog(projects: ProjectAdminItem[]): void {
    const visibleProjects = this.editModeService.isEnabled() ? projects : projects.filter((project) => project.published);
    const mergedProjects = this.mergeProjects(visibleProjects);
    this.projectCatalog.set(mergedProjects.length ? mergedProjects : PORTFOLIO_PROJECTS);
  }

  private updateAdminProject(id: string, updated: ProjectAdminItem): void {
    this.adminProjects.update((projects) => projects.map((project) => (project.id === id ? updated : project)));
  }

  private replaceAdminProject(updated: ProjectAdminItem): void {
    this.adminProjects.update((projects) => projects.map((project) => (project.id === updated.id ? updated : project)));
  }

  private toProjectPayload(project: ProjectAdminItem): ProjectAdminUpdatePayload {
    return {
      slug: project.slug.trim(),
      name: project.name.trim(),
      year: project.year.trim(),
      category: project.category.trim(),
      summary: project.summary.trim(),
      stack: project.stack.map((technology) => technology.trim()).filter((technology) => technology.length > 0),
      repositoryUrl: project.repositoryUrl?.trim() || null,
      demoUrl: project.demoUrl?.trim() || null,
      monographUrl: project.monographUrl?.trim() || null,
      iconDocumentId: project.iconDocumentId,
      metrics: project.metrics.map((metric) => ({ value: metric.value.trim(), label: metric.label.trim() })),
      sections: project.sections.map((section) => ({
        title: section.title.trim(),
        items: section.items.map((item) => item.trim()).filter(Boolean),
      })),
      features: project.features.map((feature) => feature.trim()).filter(Boolean),
      documentationDocumentIds: project.documentation.map((document) => document.id),
      screenshotDocumentIds: project.screenshots.map((screenshot) => screenshot.id),
      featured: project.featured,
      published: project.published,
      displayOrder: Number(project.displayOrder),
    };
  }

  private parseStack(value: string): string[] {
    return value
      .split(/[,\n]/)
      .map((technology) => technology.trim())
      .filter((technology) => technology.length > 0);
  }

  private parseMetrics(value: string): ProjectMetricResponse[] {
    return value
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => {
        const [metricValue, ...labelParts] = line.split('|');
        return { value: metricValue.trim(), label: labelParts.join('|').trim() || metricValue.trim() };
      });
  }

  private parseSections(value: string): ProjectSectionResponse[] {
    return value
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => {
        const [title, ...itemsParts] = line.split(':');
        return {
          title: title.trim(),
          items: itemsParts.join(':').split(';').map((item) => item.trim()).filter(Boolean),
        };
      })
      .filter((section) => section.title && section.items.length);
  }

  private parseLines(value: string): string[] {
    return value
      .split('\n')
      .map((item) => item.trim())
      .filter(Boolean);
  }

  formatProjectMetrics(metrics: ProjectMetricResponse[]): string {
    return metrics.map((metric) => `${metric.value} | ${metric.label}`).join('\n');
  }

  formatProjectSections(sections: ProjectSectionResponse[]): string {
    return sections.map((section) => `${section.title}: ${section.items.join('; ')}`).join('\n');
  }

  formatProjectFeatures(features: string[]): string {
    return features.join('\n');
  }

  private resolveProjectEditErrorMessage(error: unknown): string {
    if (error instanceof Error && error.message.trim()) {
      return error.message;
    }

    return this.ui().editGenericError;
  }

  private isOptionalUrlField(field: string): boolean {
    return field === 'repositoryUrl' || field === 'demoUrl' || field === 'monographUrl';
  }

  private resolveTechnologyIcon(technology: string): SkillIconId {
    const matchedRule = STACK_ICON_RULES.find((rule) => rule.pattern.test(technology));
    return matchedRule?.icon ?? 'architecture';
  }

  private mergeProjects(projects: ProjectSummaryResponse[]): PortfolioProject[] {
    return projects.map((project) => {
      const staticProject = PORTFOLIO_PROJECTS.find((entry) => entry.id === project.slug);

      if (staticProject) {
        const media = this.buildProjectMedia(project, staticProject.media);

        return {
          ...staticProject,
          iconUrl: project.iconUrl,
          name: project.name,
          year: project.year,
          stack: project.stack.length ? project.stack : staticProject.stack,
          metrics: project.metrics.length
            ? project.metrics.map((metric) => ({ value: metric.value, label: { es: metric.label, en: metric.label } }))
            : staticProject.metrics,
          sections: project.sections.length
            ? project.sections.map((section) => ({
                title: { es: section.title, en: section.title },
                items: section.items.map((item) => ({ es: item, en: item })),
              }))
            : staticProject.sections,
          features: project.features.length
            ? project.features.map((feature) => ({ es: feature, en: feature }))
            : staticProject.features,
          summary: {
            ...staticProject.summary,
            es: project.summary,
          },
          actions: this.buildProjectActions(project),
          media,
          documentation: project.documentation,
          screenshots: project.screenshots,
        };
      }

      return this.createFallbackProject(project);
    });
  }

  private createFallbackProject(project: ProjectSummaryResponse): PortfolioProject {
    return {
      id: project.slug,
      iconUrl: project.iconUrl,
      name: project.name,
      year: project.year,
      category: {
        es: this.formatCategory(project.category),
        en: this.formatCategory(project.category),
      },
      summary: {
        es: project.summary,
        en: project.summary,
      },
      description: {
        es: project.summary,
        en: project.summary,
      },
      stack: project.stack,
      metrics: project.metrics.map((metric) => ({ value: metric.value, label: { es: metric.label, en: metric.label } })),
      sections: project.sections.map((section) => ({
        title: { es: section.title, en: section.title },
        items: section.items.map((item) => ({ es: item, en: item })),
      })),
      features: project.features.map((feature) => ({ es: feature, en: feature })),
      actions: this.buildProjectActions(project),
      media: this.buildProjectMedia(project),
      documentation: project.documentation,
      screenshots: project.screenshots,
    };
  }

  private buildProjectActions(project: ProjectSummaryResponse): PortfolioProject['actions'] {
    const demoEmbedUrl = this.resolveYoutubeEmbedUrl(project.demoUrl);
    return [
      ...(project.demoUrl
        ? [
            {
              id: 'demo',
              type: demoEmbedUrl ? 'modal' : 'external',
              primary: true,
              label: { es: 'Ver demo', en: 'Watch demo' },
              url: demoEmbedUrl ? undefined : project.demoUrl,
            } as const,
          ]
        : []),
      ...(project.repositoryUrl
        ? [
            {
              id: 'repo',
              type: 'external',
              label: { es: 'Repositorio', en: 'Repository' },
              url: project.repositoryUrl,
            } as const,
          ]
        : []),
      ...(project.monographUrl || project.documentation.length
        ? [
            {
              id: 'documentation',
              type: 'external',
              label: { es: 'Documentacion', en: 'Documentation' },
              url: project.monographUrl ?? project.documentation[0]?.url,
            } as const,
          ]
        : []),
    ];
  }

  private buildProjectMedia(project: ProjectSummaryResponse, fallback?: PortfolioProject['media']): PortfolioProject['media'] {
    const youtubeId = this.resolveYoutubeId(project.demoUrl);
    if (!youtubeId) {
      return fallback;
    }

    return {
      thumbnailUrl: `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`,
      embedUrl: `https://www.youtube.com/embed/${youtubeId}`,
      alt: { es: `Miniatura del video demo de ${project.name}`, en: `Thumbnail for the ${project.name} demo video` },
      iframeTitle: { es: `Demo de ${project.name}`, en: `${project.name} demo` },
    };
  }

  private resolveYoutubeEmbedUrl(url: string | null): string | null {
    const youtubeId = this.resolveYoutubeId(url);
    return youtubeId ? `https://www.youtube.com/embed/${youtubeId}` : null;
  }

  private resolveYoutubeId(url: string | null): string | null {
    if (!url) {
      return null;
    }

    const trimmedUrl = url.trim();
    const patterns = [
      /youtube\.com\/watch\?v=([^&]+)/i,
      /youtu\.be\/([^?&]+)/i,
      /youtube\.com\/embed\/([^?&]+)/i,
    ];
    const match = patterns.map((pattern) => trimmedUrl.match(pattern)).find(Boolean);
    return match?.[1] ?? null;
  }

  private placeholderAsset(id: string): ProjectAssetResponse {
    return { id, filename: id, contentType: 'application/octet-stream', url: '' };
  }

  private formatCategory(category: string): string {
    return category
      .split(/[_-]/)
      .filter(Boolean)
      .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
      .join(' ');
  }
}
