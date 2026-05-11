import { HttpErrorResponse } from '@angular/common/http';
import { Component, computed, inject, signal } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { firstValueFrom } from 'rxjs';

import { DocumentAdminItem, DocumentAdminService } from '../../services/document-admin.service';
import { LanguageService } from '../../services/language.service';
import { ProjectAdminItem, ProjectAdminService } from '../../services/project-admin.service';
import { PublicContentBlock } from '../../services/public-content.service';
import { PublicContentAdminService } from '../../services/public-content-admin.service';

@Component({
  selector: 'app-control-center-update',
  standalone: false,
  templateUrl: './control-center-update.component.html',
  styleUrl: './control-center-update.component.scss',
})
export class ControlCenterUpdateComponent {
  private readonly languageService = inject(LanguageService);
  private readonly documentAdminService = inject(DocumentAdminService);
  private readonly projectAdminService = inject(ProjectAdminService);
  private readonly publicContentAdminService = inject(PublicContentAdminService);
  private readonly formBuilder = inject(FormBuilder);

  readonly currentLanguage = this.languageService.language;
  readonly loading = signal(true);
  readonly saving = signal(false);
  readonly uploadingDocument = signal(false);
  readonly error = signal<string | null>(null);
  readonly feedback = signal<string | null>(null);
  readonly documentFeedback = signal<string | null>(null);
  readonly contentBlockFeedback = signal<string | null>(null);
  readonly projects = signal<ProjectAdminItem[]>([]);
  readonly documents = signal<DocumentAdminItem[]>([]);
  readonly contentBlocks = signal<PublicContentBlock[]>([]);
  readonly selectedProjectId = signal<string | null>(null);
  readonly selectedContentBlockId = signal<string | null>(null);
  readonly selectedDocumentPurpose = signal('cv');
  readonly selectedProject = computed(
    () => this.projects().find((project) => project.id === this.selectedProjectId()) ?? null,
  );
  readonly selectedContentBlock = computed(
    () => this.contentBlocks().find((block) => block.id === this.selectedContentBlockId()) ?? null,
  );
  readonly categoryOptions = ['distributed_platform', 'frontend_system', 'certification', 'asset', 'quote'];
  readonly documentPurposeOptions = ['cv', 'support_file', 'project_reference', 'general_document'];
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
  readonly contentBlockForm = this.formBuilder.nonNullable.group({
    title: ['', [Validators.required, Validators.maxLength(220)]],
    body: ['', [Validators.required, Validators.maxLength(5000)]],
    items: ['', [Validators.maxLength(3000)]],
    displayOrder: [0, [Validators.min(0), Validators.max(999)]],
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
          documentsTitle: 'Documentos internos',
          documentsLead: 'Base minima para subir y listar archivos reutilizables del CMS interno.',
          documentPurpose: 'Proposito',
          uploadDocument: 'Subir documento',
          documentsEmpty: 'Todavia no hay documentos cargados.',
          uploadSuccess: 'Documento subido.',
          uploadHint: 'Usa esta base para CVs, archivos de apoyo o futuras referencias del CMS. Tipos permitidos: PDF, JPG, PNG y WEBP.',
          contentBlocksTitle: 'Bloques publicos',
          contentBlocksLead: 'Hero, about, contacto y referencias publicas editables desde backend.',
          contentBlocksEmpty: 'Todavia no hay bloques publicos cargados.',
          contentBlockKey: 'Clave',
          contentBlockLanguage: 'Idioma',
          contentBlockBody: 'Cuerpo',
          contentBlockItems: 'Items / lineas',
          contentBlockItemsHint: 'Una linea por item. Sirve para badges, parrafos, disponibilidad o URL del CV.',
          contentBlockSuccess: 'Bloque publico actualizado.',
          draft: 'Borrador',
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
          documentsTitle: 'Internal documents',
          documentsLead: 'Minimal foundation to upload and list reusable CMS files.',
          documentPurpose: 'Purpose',
          uploadDocument: 'Upload document',
          documentsEmpty: 'There are no uploaded documents yet.',
          uploadSuccess: 'Document uploaded.',
          uploadHint: 'Use this base for CVs, support files, or future CMS references. Allowed types: PDF, JPG, PNG, and WEBP.',
          contentBlocksTitle: 'Public blocks',
          contentBlocksLead: 'Editable backend-driven hero, about, contact, and public reference blocks.',
          contentBlocksEmpty: 'There are no public content blocks yet.',
          contentBlockKey: 'Key',
          contentBlockLanguage: 'Language',
          contentBlockBody: 'Body',
          contentBlockItems: 'Items / lines',
          contentBlockItemsHint: 'One line per item. Used for badges, paragraphs, availability, or resume URL.',
          contentBlockSuccess: 'Public content block updated.',
          draft: 'Draft',
          requiredError: 'Complete the required fields before saving.',
        },
  );

  constructor() {
    void Promise.all([this.loadProjects(), this.loadDocuments(), this.loadContentBlocks()]);
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
          projects
            .map((item) => (item.id === updated.id ? updated : item))
            .sort((left, right) => left.displayOrder - right.displayOrder),
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

  trackDocumentById(_: number, item: DocumentAdminItem): string {
    return item.id;
  }

  trackContentBlockById(_: number, item: PublicContentBlock): string {
    return item.id;
  }

  selectContentBlock(block: PublicContentBlock): void {
    this.selectedContentBlockId.set(block.id);
    this.contentBlockFeedback.set(null);
    this.contentBlockForm.reset({
      title: block.title,
      body: block.body,
      items: block.items.join('\n'),
      displayOrder: block.displayOrder,
      published: block.published,
    });
    this.contentBlockForm.markAsPristine();
    this.contentBlockForm.markAsUntouched();
  }

  async submitContentBlock(): Promise<void> {
    const block = this.selectedContentBlock();
    if (!block || this.saving()) {
      return;
    }

    if (this.contentBlockForm.invalid) {
      this.contentBlockForm.markAllAsTouched();
      this.contentBlockFeedback.set(this.content().requiredError);
      return;
    }

    const value = this.contentBlockForm.getRawValue();
    this.saving.set(true);
    this.contentBlockFeedback.set(null);

    try {
      const response = await firstValueFrom(
        this.publicContentAdminService.updateContentBlock(block.id, {
          title: value.title.trim(),
          body: value.body.trim(),
          items: value.items
            .split('\n')
            .map((item) => item.trim())
            .filter(Boolean),
          displayOrder: Number(value.displayOrder),
          published: value.published,
        }),
      );
      if (response?.data) {
        const updated = response.data;
        this.contentBlocks.update((blocks) =>
          blocks
            .map((item) => (item.id === updated.id ? updated : item))
            .sort((left, right) => left.displayOrder - right.displayOrder),
        );
        this.selectContentBlock(updated);
      }
      this.contentBlockFeedback.set(this.content().contentBlockSuccess);
    } catch (error) {
      this.contentBlockFeedback.set(this.resolveErrorMessage(error));
    } finally {
      this.saving.set(false);
    }
  }

  async onDocumentSelected(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement | null;
    const file = input?.files?.item(0) ?? null;
    if (!file || this.uploadingDocument()) {
      return;
    }

    this.uploadingDocument.set(true);
    this.documentFeedback.set(null);

    try {
      const response = await firstValueFrom(this.documentAdminService.uploadDocument(file, this.selectedDocumentPurpose()));
      if (response?.data) {
        this.documents.update((documents) => [response.data, ...documents]);
      }
      this.documentFeedback.set(this.content().uploadSuccess);
    } catch (error) {
      this.documentFeedback.set(this.resolveErrorMessage(error));
    } finally {
      this.uploadingDocument.set(false);
      if (input) {
        input.value = '';
      }
    }
  }

  formatBytes(sizeBytes: number): string {
    if (sizeBytes < 1024) {
      return `${sizeBytes} B`;
    }

    if (sizeBytes < 1024 * 1024) {
      return `${(sizeBytes / 1024).toFixed(1)} KB`;
    }

    return `${(sizeBytes / (1024 * 1024)).toFixed(1)} MB`;
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

  private async loadDocuments(): Promise<void> {
    try {
      const response = await firstValueFrom(this.documentAdminService.listDocuments());
      this.documents.set(response?.data ?? []);
    } catch (error) {
      this.documentFeedback.set(this.resolveErrorMessage(error));
    }
  }

  private async loadContentBlocks(): Promise<void> {
    try {
      const response = await firstValueFrom(this.publicContentAdminService.listContentBlocks());
      const blocks = response?.data ?? [];
      this.contentBlocks.set(blocks);

      if (blocks.length) {
        this.selectContentBlock(blocks[0]);
      }
    } catch (error) {
      this.contentBlockFeedback.set(this.resolveErrorMessage(error));
    }
  }

  private resolveErrorMessage(error: unknown): string {
    if (error instanceof HttpErrorResponse && typeof error.error?.message === 'string' && error.error.message.trim()) {
      return error.error.message;
    }

    return this.content().genericError;
  }
}
