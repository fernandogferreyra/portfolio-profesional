import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, computed, effect, inject, signal } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { firstValueFrom } from 'rxjs';

import { CredentialItem, CredentialService, CredentialUpdatePayload } from '../../services/credential.service';
import { DocumentAdminService } from '../../services/document-admin.service';
import { EditModeService } from '../../services/edit-mode.service';
import { LanguageService } from '../../services/language.service';

type CredentialTextField = 'type' | 'title' | 'institution' | 'description';

interface CredentialDocumentPreview {
  documentId: string;
  url: string;
  frameUrl: SafeResourceUrl;
  contentType: string;
}

type PdfFrameView = 'FitH' | 'FitV';

@Component({
  selector: 'app-credentials',
  standalone: false,
  templateUrl: './credentials.component.html',
  styleUrl: './credentials.component.scss',
})
export class CredentialsComponent implements OnDestroy {
  private readonly languageService = inject(LanguageService);
  private readonly credentialService = inject(CredentialService);
  private readonly documentAdminService = inject(DocumentAdminService);
  private readonly sanitizer = inject(DomSanitizer);

  readonly editModeService = inject(EditModeService);
  readonly currentLanguage = this.languageService.language;
  readonly credentials = signal<CredentialItem[]>([]);
  readonly loading = signal(false);
  readonly savingId = signal<string | null>(null);
  readonly uploadingId = signal<string | null>(null);
  readonly feedback = signal<string | null>(null);
  readonly error = signal<string | null>(null);
  readonly documentPreviews = signal<Map<string, CredentialDocumentPreview>>(new Map());
  readonly framePreviewIds = signal<ReadonlySet<string>>(new Set());
  readonly visibleEntries = computed(() =>
    this.credentials()
      .filter((entry) => entry.language === this.currentLanguage())
      .sort((left, right) => left.displayOrder - right.displayOrder || left.title.localeCompare(right.title)),
  );
  readonly ui = computed(() =>
    this.currentLanguage() === 'es'
      ? {
          eyebrow: 'Formacion y certificaciones',
          title: 'Formacion y certificaciones',
          intro:
            'Estudios formales, certificaciones y documentacion asociada, administrados desde la pagina publica cuando EditMode esta activo.',
          backLabel: 'Volver al inicio',
          newLabel: 'Nuevo',
          saveLabel: 'Guardar',
          savingLabel: 'Guardando...',
          uploadLabel: 'Subir documentacion',
          uploadingLabel: 'Subiendo...',
          previewDocumentLabel: 'Vista previa de documentacion',
          openDocumentLabel: 'Abrir documentacion',
          noDocumentLabel: 'Sin documentacion asociada',
          typeLabel: 'Tipo',
          titleLabel: 'Titulo',
          institutionLabel: 'Institucion',
          descriptionLabel: 'Descripcion',
          orderLabel: 'Orden',
          publishedLabel: 'Publicado',
          draftLabel: 'Borrador',
          createSuccess: 'Elemento creado. Completa los datos y guardalo.',
          saveSuccess: 'Formacion o certificacion actualizada.',
          uploadSuccess: 'Documentacion subida y asociada.',
          genericError: 'No se pudo completar la accion.',
          empty: 'Todavia no hay formaciones o certificaciones publicadas.',
        }
      : {
          eyebrow: 'Education and certifications',
          title: 'Education and certifications',
          intro:
            'Formal education, certifications, and linked documentation managed directly from the public page when EditMode is active.',
          backLabel: 'Back to home',
          newLabel: 'New',
          saveLabel: 'Save',
          savingLabel: 'Saving...',
          uploadLabel: 'Upload documentation',
          uploadingLabel: 'Uploading...',
          previewDocumentLabel: 'Documentation preview',
          openDocumentLabel: 'Open documentation',
          noDocumentLabel: 'No linked documentation',
          typeLabel: 'Type',
          titleLabel: 'Title',
          institutionLabel: 'Institution',
          descriptionLabel: 'Description',
          orderLabel: 'Order',
          publishedLabel: 'Published',
          draftLabel: 'Draft',
          createSuccess: 'Item created. Complete the fields and save it.',
          saveSuccess: 'Education or certification updated.',
          uploadSuccess: 'Documentation uploaded and linked.',
          genericError: 'The action could not be completed.',
          empty: 'There are no published education or certification items yet.',
        },
  );

  constructor() {
    effect(() => {
      const editModeEnabled = this.editModeService.isEnabled();
      this.currentLanguage();
      void this.loadCredentials(editModeEnabled);
    });
  }

  trackById(_: number, entry: CredentialItem): string {
    return entry.id;
  }

  ngOnDestroy(): void {
    this.clearDocumentPreviews();
  }

  documentPreview(entry: CredentialItem): CredentialDocumentPreview | null {
    return this.documentPreviews().get(entry.id) ?? null;
  }

  credentialDocumentUrl(entry: CredentialItem): string | null {
    if (!entry.documentId) {
      return null;
    }

    return this.editModeService.isEnabled() ? `/api/admin/credentials/${entry.id}/document` : entry.documentUrl;
  }

  shouldUseFramePreview(entry: CredentialItem): boolean {
    const preview = this.documentPreview(entry);
    return this.framePreviewIds().has(entry.id) || preview?.contentType.toLowerCase().includes('pdf') === true;
  }

  onPreviewImageError(entryId: string): void {
    this.framePreviewIds.update((ids) => new Set(ids).add(entryId));
  }

  async createCredential(): Promise<void> {
    if (!this.editModeService.isEnabled()) {
      return;
    }

    this.savingId.set('new');
    this.feedback.set(null);
    this.error.set(null);

    try {
      const response = await firstValueFrom(this.credentialService.createCredential(this.currentLanguage()));
      if (response?.data) {
        this.credentials.update((entries) => [...entries, response.data]);
      }
      this.feedback.set(this.ui().createSuccess);
    } catch (error) {
      this.error.set(this.resolveErrorMessage(error));
    } finally {
      this.savingId.set(null);
    }
  }

  updateTextField(id: string, field: CredentialTextField, value: string): void {
    this.credentials.update((entries) =>
      entries.map((entry) => (entry.id === id ? { ...entry, [field]: value } : entry)),
    );
  }

  updateDisplayOrder(id: string, value: number): void {
    this.credentials.update((entries) =>
      entries.map((entry) => (entry.id === id ? { ...entry, displayOrder: Number.isFinite(value) ? value : 0 } : entry)),
    );
  }

  updatePublished(id: string, published: boolean): void {
    this.credentials.update((entries) =>
      entries.map((entry) => (entry.id === id ? { ...entry, published } : entry)),
    );
  }

  async saveCredential(entry: CredentialItem): Promise<void> {
    if (!this.editModeService.isEnabled() || this.savingId()) {
      return;
    }

    this.savingId.set(entry.id);
    this.feedback.set(null);
    this.error.set(null);

    try {
      const response = await firstValueFrom(this.credentialService.updateCredential(entry.id, this.toPayload(entry)));
      if (response?.data) {
        this.replaceCredential(response.data);
        void this.loadDocumentPreview(response.data);
      }
      this.feedback.set(this.ui().saveSuccess);
    } catch (error) {
      this.error.set(this.resolveErrorMessage(error));
    } finally {
      this.savingId.set(null);
    }
  }

  async onDocumentSelected(entry: CredentialItem, event: Event): Promise<void> {
    const input = event.target as HTMLInputElement | null;
    const file = input?.files?.item(0) ?? null;
    if (!file || !this.editModeService.isEnabled() || this.uploadingId()) {
      return;
    }

    this.uploadingId.set(entry.id);
    this.feedback.set(null);
    this.error.set(null);

    try {
      const uploadResponse = await firstValueFrom(this.documentAdminService.uploadDocument(file, 'credential'));
      const documentId = uploadResponse.data.id;
      const response = await firstValueFrom(
        this.credentialService.updateCredential(entry.id, this.toPayload({ ...entry, documentId })),
      );
      if (response?.data) {
        this.replaceCredential(response.data);
        void this.loadDocumentPreview(response.data, true);
      }
      this.feedback.set(this.ui().uploadSuccess);
    } catch (error) {
      this.error.set(this.resolveErrorMessage(error));
    } finally {
      this.uploadingId.set(null);
      if (input) {
        input.value = '';
      }
    }
  }

  private async loadCredentials(includeDrafts: boolean): Promise<void> {
    this.loading.set(true);
    this.error.set(null);

    try {
      const response = await firstValueFrom(
        includeDrafts ? this.credentialService.listAdminCredentials() : this.credentialService.listCredentials(),
      );
      const entries = response?.data ?? [];
      this.credentials.set(entries);
      void this.loadDocumentPreviews(entries);
    } catch (error) {
      this.error.set(this.resolveErrorMessage(error));
      this.credentials.set([]);
    } finally {
      this.loading.set(false);
    }
  }

  private replaceCredential(updated: CredentialItem): void {
    this.credentials.update((entries) =>
      entries
        .map((entry) => (entry.id === updated.id ? updated : entry))
        .sort((left, right) => left.displayOrder - right.displayOrder || left.title.localeCompare(right.title)),
    );
  }

  private async loadDocumentPreviews(entries: CredentialItem[]): Promise<void> {
    const previewableIds = new Set(entries.filter((entry) => Boolean(entry.documentId)).map((entry) => entry.id));
    this.documentPreviews.update((previews) => {
      const next = new Map(previews);
      for (const [id, preview] of next) {
        if (!previewableIds.has(id)) {
          URL.revokeObjectURL(preview.url);
          next.delete(id);
        }
      }
      return next;
    });

    await Promise.all(entries.map((entry) => this.loadDocumentPreview(entry)));
  }

  private async loadDocumentPreview(entry: CredentialItem, force = false): Promise<void> {
    if (!entry.documentId) {
      this.removeDocumentPreview(entry.id);
      return;
    }

    const currentPreview = this.documentPreviews().get(entry.id);
    if (!force && currentPreview?.documentId === entry.documentId) {
      return;
    }

    try {
      const blob = await firstValueFrom(this.credentialService.downloadCredentialDocument(entry, this.editModeService.isEnabled()));
      const objectUrl = URL.createObjectURL(blob);
      const frameView = await this.resolvePdfFrameView(blob);
      const frameUrl = `${objectUrl}#toolbar=0&navpanes=0&view=${frameView}`;
      this.documentPreviews.update((previews) => {
        const next = new Map(previews);
        const previous = next.get(entry.id);
        if (previous) {
          URL.revokeObjectURL(previous.url);
        }
        next.set(entry.id, {
          documentId: entry.documentId as string,
          url: objectUrl,
          frameUrl: this.sanitizer.bypassSecurityTrustResourceUrl(frameUrl),
          contentType: blob.type || 'application/octet-stream',
        });
        return next;
      });
      this.framePreviewIds.update((ids) => {
        const next = new Set(ids);
        next.delete(entry.id);
        return next;
      });
    } catch {
      this.removeDocumentPreview(entry.id);
    }
  }

  private removeDocumentPreview(id: string): void {
    this.documentPreviews.update((previews) => {
      const next = new Map(previews);
      const previous = next.get(id);
      if (previous) {
        URL.revokeObjectURL(previous.url);
      }
      next.delete(id);
      return next;
    });
    this.framePreviewIds.update((ids) => {
      const next = new Set(ids);
      next.delete(id);
      return next;
    });
  }

  private clearDocumentPreviews(): void {
    for (const preview of this.documentPreviews().values()) {
      URL.revokeObjectURL(preview.url);
    }
    this.documentPreviews.set(new Map());
  }

  private async resolvePdfFrameView(blob: Blob): Promise<PdfFrameView> {
    if (!blob.type.toLowerCase().includes('pdf')) {
      return 'FitH';
    }

    try {
      const header = await blob.slice(0, Math.min(blob.size, 262_144)).text();
      const mediaBox = header.match(
        /\/MediaBox\s*\[\s*(-?\d+(?:\.\d+)?)\s+(-?\d+(?:\.\d+)?)\s+(-?\d+(?:\.\d+)?)\s+(-?\d+(?:\.\d+)?)/,
      );
      if (!mediaBox) {
        return 'FitH';
      }

      const width = Math.abs(Number(mediaBox[3]) - Number(mediaBox[1]));
      const height = Math.abs(Number(mediaBox[4]) - Number(mediaBox[2]));
      return width > height ? 'FitV' : 'FitH';
    } catch {
      return 'FitH';
    }
  }

  private toPayload(entry: CredentialItem): CredentialUpdatePayload {
    return {
      language: entry.language,
      type: entry.type.trim(),
      title: entry.title.trim(),
      institution: entry.institution.trim(),
      description: entry.description.trim(),
      documentId: entry.documentId,
      published: entry.published,
      displayOrder: Number(entry.displayOrder),
    };
  }

  private resolveErrorMessage(error: unknown): string {
    if (error instanceof HttpErrorResponse && typeof error.error?.message === 'string' && error.error.message.trim()) {
      return error.error.message;
    }

    return this.ui().genericError;
  }
}
