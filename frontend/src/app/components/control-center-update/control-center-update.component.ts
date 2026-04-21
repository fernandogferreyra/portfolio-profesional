import { HttpErrorResponse } from '@angular/common/http';
import { Component, computed, inject, signal } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { firstValueFrom } from 'rxjs';

import { LanguageService } from '../../services/language.service';
import { ProjectAdminItem, ProjectAdminService } from '../../services/project-admin.service';

@Component({
  selector: 'app-control-center-update',
  standalone: false,
  templateUrl: './control-center-update.component.html',
  styleUrl: './control-center-update.component.scss',
})
export class ControlCenterUpdateComponent {
  private readonly languageService = inject(LanguageService);
  private readonly projectAdminService = inject(ProjectAdminService);
  private readonly formBuilder = inject(FormBuilder);

  readonly currentLanguage = this.languageService.language;
  readonly loading = signal(true);
  readonly saving = signal(false);
  readonly error = signal<string | null>(null);
  readonly feedback = signal<string | null>(null);
  readonly projects = signal<ProjectAdminItem[]>([]);
  readonly selectedProjectId = signal<string | null>(null);
  readonly selectedProject = computed(
    () => this.projects().find((project) => project.id === this.selectedProjectId()) ?? null,
  );
  readonly categoryOptions = ['distributed_platform', 'frontend_system', 'certification', 'asset', 'quote'];
  readonly projectForm = this.formBuilder.nonNullable.group({
    slug: ['', [Validators.required, Validators.maxLength(120)]],
    name: ['', [Validators.required, Validators.maxLength(180)]],
    year: ['', [Validators.required, Validators.maxLength(4)]],
    category: ['distributed_platform', [Validators.required]],
    summary: ['', [Validators.required, Validators.maxLength(500)]],
    stack: ['', [Validators.required, Validators.maxLength(400)]],
    repositoryUrl: ['', [Validators.maxLength(400)]],
    displayOrder: [0, [Validators.min(0), Validators.max(999)]],
    featured: [false],
    published: [true],
  });

  readonly content = computed(() =>
    this.currentLanguage() === 'es'
      ? {
          listTitle: 'Proyectos publicos',
          listLead: 'Base minima editable del sitio publico para ajustar orden, copy y visibilidad.',
          detailTitle: 'Editor de proyecto',
          empty: 'Todavia no hay proyectos cargados para editar.',
          save: 'Guardar cambios',
          loading: 'Cargando proyectos...',
          saveSuccess: 'Proyecto actualizado.',
          genericError: 'No se pudo completar la accion.',
          slug: 'Slug',
          name: 'Nombre',
          year: 'Ano',
          category: 'Categoria',
          summary: 'Resumen publico',
          stack: 'Stack',
          stackHint: 'Separado por comas. Ejemplo: Angular, Spring Boot, PostgreSQL',
          repositoryUrl: 'Repositorio',
          displayOrder: 'Orden',
          featured: 'Destacado',
          published: 'Publicado',
          createdAt: 'Creado',
          updatedAt: 'Actualizado',
          formHint: 'Esta etapa actualiza la base publica de proyectos sin tocar el detalle rico del frontend.',
          requiredError: 'Completa los campos obligatorios antes de guardar.',
        }
      : {
          listTitle: 'Public projects',
          listLead: 'Minimal editable foundation for public-site order, copy, and visibility.',
          detailTitle: 'Project editor',
          empty: 'There are no projects available to edit yet.',
          save: 'Save changes',
          loading: 'Loading projects...',
          saveSuccess: 'Project updated.',
          genericError: 'The action could not be completed.',
          slug: 'Slug',
          name: 'Name',
          year: 'Year',
          category: 'Category',
          summary: 'Public summary',
          stack: 'Stack',
          stackHint: 'Comma separated. Example: Angular, Spring Boot, PostgreSQL',
          repositoryUrl: 'Repository',
          displayOrder: 'Order',
          featured: 'Featured',
          published: 'Published',
          createdAt: 'Created',
          updatedAt: 'Updated',
          formHint: 'This stage updates the public project base without touching the rich frontend detail yet.',
          requiredError: 'Complete the required fields before saving.',
        },
  );

  constructor() {
    void this.loadProjects();
  }

  async selectProject(project: ProjectAdminItem): Promise<void> {
    this.selectedProjectId.set(project.id);
    this.feedback.set(null);
    this.projectForm.reset({
      slug: project.slug,
      name: project.name,
      year: project.year,
      category: project.category,
      summary: project.summary,
      stack: project.stack.join(', '),
      repositoryUrl: project.repositoryUrl ?? '',
      displayOrder: project.displayOrder,
      featured: project.featured,
      published: project.published,
    });
    this.projectForm.markAsPristine();
    this.projectForm.markAsUntouched();
  }

  async submit(): Promise<void> {
    const project = this.selectedProject();
    if (!project || this.saving()) {
      return;
    }

    if (this.projectForm.invalid) {
      this.projectForm.markAllAsTouched();
      this.feedback.set(this.content().requiredError);
      return;
    }

    const value = this.projectForm.getRawValue();
    const stack = value.stack
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean);

    this.saving.set(true);
    this.feedback.set(null);

    try {
      const response = await firstValueFrom(
        this.projectAdminService.updateProject(project.id, {
          slug: value.slug.trim(),
          name: value.name.trim(),
          year: value.year.trim(),
          category: value.category,
          summary: value.summary.trim(),
          stack,
          repositoryUrl: value.repositoryUrl.trim() || null,
          displayOrder: Number(value.displayOrder),
          featured: value.featured,
          published: value.published,
        }),
      );
      if (response?.data) {
        const updated = response.data;
        this.projects.update((projects) =>
          projects.map((item) => (item.id === updated.id ? updated : item)).sort((left, right) => left.displayOrder - right.displayOrder),
        );
        await this.selectProject(updated);
      }
      this.feedback.set(this.content().saveSuccess);
    } catch (error) {
      this.feedback.set(this.resolveErrorMessage(error));
    } finally {
      this.saving.set(false);
    }
  }

  trackById(_: number, item: ProjectAdminItem): string {
    return item.id;
  }

  private async loadProjects(): Promise<void> {
    this.loading.set(true);
    this.error.set(null);

    try {
      const response = await firstValueFrom(this.projectAdminService.listProjects());
      const projects = response?.data ?? [];
      this.projects.set(projects);

      if (!projects.length) {
        this.selectedProjectId.set(null);
        return;
      }

      await this.selectProject(projects[0]);
    } catch (error) {
      this.error.set(this.resolveErrorMessage(error));
    } finally {
      this.loading.set(false);
    }
  }

  private resolveErrorMessage(error: unknown): string {
    if (error instanceof HttpErrorResponse && typeof error.error?.message === 'string' && error.error.message.trim()) {
      return error.error.message;
    }

    return this.content().genericError;
  }
}
