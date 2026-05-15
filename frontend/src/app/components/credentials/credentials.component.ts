import { HttpErrorResponse } from '@angular/common/http';
import { Component, computed, effect, inject, signal } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { firstValueFrom } from 'rxjs';

import { CredentialItem, CredentialService, CredentialUpdatePayload } from '../../services/credential.service';
import { DocumentAdminService } from '../../services/document-admin.service';
import { EditModeService } from '../../services/edit-mode.service';
import { LanguageService } from '../../services/language.service';

type CredentialTextField = 'type' | 'title' | 'institution' | 'description';

@Component({
  selector: 'app-credentials',
  standalone: false,
  templateUrl: './credentials.component.html',
  styleUrl: './credentials.component.scss',
})
export class CredentialsComponent {
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
  readonly visibleEntries = computed(() =>
    this.credentials()
      .filter((entry) => entry.language === this.currentLanguage())
      .sort((left, right) => left.displayOrder - right.displayOrder || left.title.localeCompare(right.title)),
  );
  readonly documentPreviewUrls = computed(() =>
    new Map(
      this.credentials()
        .filter((entry) => Boolean(entry.documentUrl))
        .map((entry) => [entry.id, this.sanitizer.bypassSecurityTrustResourceUrl(entry.documentUrl as string)]),
    ),
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

  documentPreviewUrl(entry: CredentialItem): SafeResourceUrl | null {
    return this.documentPreviewUrls().get(entry.id) ?? null;
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
      this.credentials.set(response?.data ?? []);
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
