import { HttpErrorResponse } from '@angular/common/http';
import { Component, computed, effect, inject, signal } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { firstValueFrom } from 'rxjs';

import {
  ContactApiResponse,
  ContactRequestPayload,
  ContactService,
} from '../../services/contact.service';
import { DocumentAdminService } from '../../services/document-admin.service';
import { EditModeService } from '../../services/edit-mode.service';
import { LanguageService } from '../../services/language.service';
import {
  PublicContentBlock,
  PublicContentBlockUpdatePayload,
  PublicContentService,
} from '../../services/public-content.service';
import { PublicContentAdminService } from '../../services/public-content-admin.service';

type ContactChannelIconId = 'email' | 'phone' | 'linkedin' | 'github' | 'document';
type ContactChannelBlockKey = 'contact.email' | 'contact.phone' | 'contact.linkedin' | 'contact.github' | 'contact.cv';
type ContactFormControlName = 'name' | 'email' | 'context' | 'subject' | 'message';
type ContactFormState = 'idle' | 'submitting' | 'success' | 'error';

interface ContactChannel {
  id: string;
  icon: ContactChannelIconId;
  accent: string;
  label: string;
  value: string;
  note: string;
  href?: string;
  newTab?: boolean;
}

interface ContactChannelIcon {
  viewBox: string;
  paths: string[];
}

@Component({
  selector: 'app-contact',
  standalone: false,
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss',
})
export class ContactComponent {
  private readonly formBuilder = inject(FormBuilder);
  private readonly languageService = inject(LanguageService);
  private readonly contactService = inject(ContactService);
  private readonly publicContentService = inject(PublicContentService);
  private readonly publicContentAdminService = inject(PublicContentAdminService);
  private readonly documentAdminService = inject(DocumentAdminService);

  readonly contactRecipient = 'fernandogabrielf@gmail.com';
  readonly editModeService = inject(EditModeService);
  readonly currentLanguage = this.languageService.language;
  readonly contentBlocks = signal<PublicContentBlock[]>([]);
  readonly savingBlockId = signal<string | null>(null);
  readonly uploadingCv = signal(false);
  readonly editFeedback = signal<string | null>(null);
  readonly editError = signal<string | null>(null);
  readonly channelBlockKeys: ContactChannelBlockKey[] = [
    'contact.email',
    'contact.phone',
    'contact.linkedin',
    'contact.github',
    'contact.cv',
  ];
  readonly formState = signal<ContactFormState>('idle');
  readonly serverMessage = signal('');
  readonly contactForm = this.formBuilder.nonNullable.group({
    name: ['', [Validators.required, Validators.maxLength(120)]],
    email: ['', [Validators.required, Validators.email, Validators.maxLength(180)]],
    context: ['', [Validators.maxLength(120)]],
    subject: ['', [Validators.maxLength(160)]],
    message: ['', [Validators.required, Validators.maxLength(2500)]],
  });
  readonly channelIcons: Record<ContactChannelIconId, ContactChannelIcon> = {
    email: {
      viewBox: '0 0 24 24',
      paths: ['M4 7h16v10H4Z', 'M4 8.5 12 14l8-5.5'],
    },
    phone: {
      viewBox: '0 0 24 24',
      paths: ['M12 21a8 8 0 1 0-5.6-2.3L4 21l2.5-2.2A8 8 0 0 0 12 21Z', 'M9 9.2c.6 2.1 1.7 3.7 3.8 5.2', 'M9.7 10.2 8.5 11.4', 'M14.2 14.7l1.3-1.2'],
    },
    linkedin: {
      viewBox: '0 0 24 24',
      paths: ['M5 8h3v11H5Z', 'M6.5 5.5a.1.1 0 1 0 0 .1', 'M11 11h3v8h-3Z', 'M14 14c0-2 1.2-3 3-3s3 1.3 3 3v5h-3v-4.5c0-.7-.4-1.5-1.4-1.5S14 13.8 14 14.7'],
    },
    github: {
      viewBox: '0 0 24 24',
      paths: ['M9 18c-1.5 0-5-.7-5-4.5 0-1.2.4-2.2 1-3-.2-.6-.4-1.6 0-3.2 0 0 1-.3 3.3 1.1a11.5 11.5 0 0 1 6 0C18 7.3 19 7.6 19 7.6c.4 1.6.2 2.6 0 3.2.6.8 1 1.8 1 3 0 3.8-3.5 4.5-5 4.5', 'M9.5 18v-2.1c-2 .4-2.7-.8-3-1.5', 'M14.5 18v-2.1c2 .4 2.7-.8 3-1.5'],
    },
    document: {
      viewBox: '0 0 24 24',
      paths: ['M7 4h7l4 4v12H7Z', 'M14 4v4h4', 'M10 12h4', 'M10 16h4'],
    },
  };
  readonly ui = computed(() =>
    this.currentLanguage() === 'es'
      ? {
          eyebrow: 'Contacto',
          title: this.contentBlock('contact.hero')?.title ?? 'Si queres conversar sobre una oportunidad o un proyecto, podemos hablar.',
          intro: this.contentBlock('contact.hero')?.body ?? 'Estoy abierto a conversaciones profesionales sobre roles, colaboraciones y desarrollo de software. Abajo tenes los canales directos y la informacion que me ayuda a responder con contexto.',
          channelsTitle: 'Canales directos',
          channelAction: 'Abrir canal',
          channelReference: 'Referencia directa',
          formTitle: 'Enviar mensaje',
          formDescription:
            'Completa el formulario con el contexto principal y lo enviaremos al backend real.',
          formDestinationLabel: 'Destino',
          nameLabel: 'Nombre',
          namePlaceholder: 'Tu nombre completo',
          emailLabel: 'Email',
          emailPlaceholder: 'nombre@empresa.com',
          contextLabel: 'Empresa o proyecto',
          contextPlaceholder: 'Empresa, equipo o producto',
          subjectLabel: 'Asunto',
          subjectPlaceholder: 'Motivo del contacto',
          messageLabel: 'Mensaje',
          messagePlaceholder: 'Contame el contexto, stack involucrado y objetivo del contacto.',
          formButtonLabel: 'Enviar mensaje',
          formSubmittingLabel: 'Enviando...',
          formSuccessLabel: 'Mensaje enviado correctamente.',
          formErrorLabel: 'No se pudo procesar el envio. Intenta nuevamente en unos segundos.',
          validationRequired: 'Este campo es obligatorio.',
          validationEmail: 'Ingresa un email valido.',
          validationTooLong: 'El contenido supera el maximo permitido.',
          availabilityTitle: 'Disponibilidad',
          editChannelsTitle: 'Editar canales directos',
          editChannelsDescription: 'Estos campos actualizan los bloques CMS del idioma activo.',
          editTitleLabel: 'Titulo visible',
          editValueLabel: 'Valor visible',
          editHrefLabel: 'URL o accion',
          editNoteLabel: 'Descripcion',
          editSaveLabel: 'Guardar canal',
          editSavingLabel: 'Guardando...',
          editUploadCvLabel: 'Subir o reemplazar CV',
          editUploadingCvLabel: 'Subiendo CV...',
          editSavedLabel: 'Canal actualizado.',
          editCvSavedLabel: 'CV actualizado y asociado al canal.',
          editGenericError: 'No se pudo guardar el cambio.',
        }
      : {
          eyebrow: 'Contact',
          title: this.contentBlock('contact.hero')?.title ?? 'If you want to discuss an opportunity or a project, we can talk.',
          intro: this.contentBlock('contact.hero')?.body ?? 'I am open to professional conversations about roles, collaborations, and software development work. Below you will find direct channels and the context that helps me respond clearly.',
          channelsTitle: 'Direct channels',
          channelAction: 'Open channel',
          channelReference: 'Direct reference',
          formTitle: 'Send message',
          formDescription:
            'Fill in the form with the main context and it will be sent to the real backend.',
          formDestinationLabel: 'Recipient',
          nameLabel: 'Name',
          namePlaceholder: 'Your full name',
          emailLabel: 'Email',
          emailPlaceholder: 'name@company.com',
          contextLabel: 'Company or project',
          contextPlaceholder: 'Company, team, or product',
          subjectLabel: 'Subject',
          subjectPlaceholder: 'Reason for contact',
          messageLabel: 'Message',
          messagePlaceholder: 'Share the context, stack involved, and the goal of the conversation.',
          formButtonLabel: 'Send message',
          formSubmittingLabel: 'Sending...',
          formSuccessLabel: 'Message sent successfully.',
          formErrorLabel: 'The submission could not be processed. Please try again in a few seconds.',
          validationRequired: 'This field is required.',
          validationEmail: 'Enter a valid email address.',
          validationTooLong: 'The content exceeds the maximum allowed length.',
          availabilityTitle: 'Availability',
          editChannelsTitle: 'Edit direct channels',
          editChannelsDescription: 'These fields update the CMS blocks for the active language.',
          editTitleLabel: 'Visible title',
          editValueLabel: 'Visible value',
          editHrefLabel: 'URL or action',
          editNoteLabel: 'Description',
          editSaveLabel: 'Save channel',
          editSavingLabel: 'Saving...',
          editUploadCvLabel: 'Upload or replace resume',
          editUploadingCvLabel: 'Uploading resume...',
          editSavedLabel: 'Channel updated.',
          editCvSavedLabel: 'Resume updated and linked to the channel.',
          editGenericError: 'The change could not be saved.',
        },
  );
  readonly isSubmitting = computed(() => this.formState() === 'submitting');
  readonly formFeedback = computed(() => this.serverMessage());
  readonly channels = computed<ContactChannel[]>(() =>
    this.currentLanguage() === 'es'
      ? [
          this.contactChannel('email', {
            id: 'email',
            icon: 'email',
            accent: '#ef4444',
            label: 'Gmail / Email',
            value: 'fernandogabrielf@gmail.com',
            note: 'Canal principal para oportunidades profesionales y conversaciones tecnicas.',
            href: 'mailto:fernandogabrielf@gmail.com',
          }),
          this.contactChannel('phone', {
            id: 'phone',
            icon: 'phone',
            accent: '#22c55e',
            label: 'Telefono / WhatsApp',
            value: 'Disponible a pedido',
            note: 'Canal directo para intercambio rapido cuando el proceso ya requiere una conversacion mas puntual.',
          }),
          this.contactChannel('linkedin', {
            id: 'linkedin',
            icon: 'linkedin',
            accent: '#0a66c2',
            label: 'LinkedIn',
            value: 'linkedin.com/in/fernando-ferreyra-40a126328',
            note: 'Perfil profesional para procesos formales, networking y seguimiento.',
            href: 'https://www.linkedin.com/in/fernando-ferreyra-40a126328',
            newTab: true,
          }),
          this.contactChannel('github', {
            id: 'github',
            icon: 'github',
            accent: '#94a3b8',
            label: 'GitHub',
            value: 'github.com/fernandogferreyra',
            note: 'Codigo, experimentos y decisiones tecnicas visibles en repositorios publicos.',
            href: 'https://github.com/fernandogferreyra',
            newTab: true,
          }),
          this.contactChannel('cv', {
            id: 'cv',
            icon: 'document',
            accent: '#eab308',
            label: this.contentBlock('contact.cv')?.title ?? 'CV',
            value: 'Abrir CV',
            note: this.contentBlock('contact.cv')?.body ?? 'Resumen profesional actualizado con experiencia, stack y proyectos relevantes.',
            href: this.contentBlock('contact.cv')?.documentUrl ?? this.contentBlock('contact.cv')?.items?.[0] ?? '/docs/cv-fernando-ferreyra.pdf',
            newTab: true,
          }),
        ]
      : [
          this.contactChannel('email', {
            id: 'email',
            icon: 'email',
            accent: '#ef4444',
            label: 'Gmail / Email',
            value: 'fernandogabrielf@gmail.com',
            note: 'Primary channel for professional opportunities and technical conversations.',
            href: 'mailto:fernandogabrielf@gmail.com',
          }),
          this.contactChannel('phone', {
            id: 'phone',
            icon: 'phone',
            accent: '#22c55e',
            label: 'Phone / WhatsApp',
            value: 'Available on request',
            note: 'Direct channel for faster communication once a process requires a more specific conversation.',
          }),
          this.contactChannel('linkedin', {
            id: 'linkedin',
            icon: 'linkedin',
            accent: '#0a66c2',
            label: 'LinkedIn',
            value: 'linkedin.com/in/fernando-ferreyra-40a126328',
            note: 'Professional profile for formal processes, networking, and follow-up.',
            href: 'https://www.linkedin.com/in/fernando-ferreyra-40a126328',
            newTab: true,
          }),
          this.contactChannel('github', {
            id: 'github',
            icon: 'github',
            accent: '#94a3b8',
            label: 'GitHub',
            value: 'github.com/fernandogferreyra',
            note: 'Code, experiments, and visible technical decisions in public repositories.',
            href: 'https://github.com/fernandogferreyra',
            newTab: true,
          }),
          this.contactChannel('cv', {
            id: 'cv',
            icon: 'document',
            accent: '#eab308',
            label: this.contentBlock('contact.cv')?.title ?? 'Resume',
            value: 'Open resume',
            note: this.contentBlock('contact.cv')?.body ?? 'Updated professional summary with experience, stack, and relevant projects.',
            href: this.contentBlock('contact.cv')?.documentUrl ?? this.contentBlock('contact.cv')?.items?.[0] ?? '/docs/cv-fernando-ferreyra.pdf',
            newTab: true,
          }),
        ],
  );
  readonly availability = computed(() =>
    this.blockItems(
      this.contentBlock('contact.hero'),
      this.currentLanguage() === 'es'
        ? ['Oportunidades profesionales', 'Colaboracion tecnica', 'Proyectos freelance']
        : ['Professional opportunities', 'Technical collaboration', 'Freelance projects'],
    ),
  );
  readonly editableChannelBlocks = computed(() => {
    const language = this.currentLanguage();
    return this.channelBlockKeys
      .map((key) => this.contentBlocks().find((block) => block.key === key && block.language === language) ?? null)
      .filter((block): block is PublicContentBlock => Boolean(block));
  });

  constructor() {
    effect(() => {
      const editModeEnabled = this.editModeService.isEnabled();
      this.currentLanguage();
      void this.loadContentBlocks(editModeEnabled);
    });
  }

  hasHref(channel: ContactChannel): boolean {
    return Boolean(channel.href);
  }

  channelIconViewBox(icon: ContactChannelIconId): string {
    return this.channelIcons[icon].viewBox;
  }

  channelIconPaths(icon: ContactChannelIconId): string[] {
    return this.channelIcons[icon].paths;
  }

  channelEditorLabel(block: PublicContentBlock): string {
    const channelId = block.key.replace('contact.', '');
    const channel = this.channels().find((item) => item.id === channelId);
    return channel?.label ?? block.title;
  }

  blockValue(block: PublicContentBlock): string {
    return block.items[0] ?? '';
  }

  blockHref(block: PublicContentBlock): string {
    if (block.key === 'contact.cv') {
      return block.documentUrl ?? block.items[0] ?? '';
    }

    return block.items[1] ?? '';
  }

  blockEditableHref(block: PublicContentBlock): string {
    return block.key === 'contact.cv' ? block.items[0] ?? '' : block.items[1] ?? '';
  }

  updateBlockTitle(id: string, value: string): void {
    this.updateBlock(id, (block) => ({ ...block, title: value }));
  }

  updateBlockBody(id: string, value: string): void {
    this.updateBlock(id, (block) => ({ ...block, body: value }));
  }

  updateBlockItem(id: string, index: number, value: string): void {
    this.updateBlock(id, (block) => {
      const items = [...block.items];
      items[index] = value;
      return { ...block, items };
    });
  }

  async saveContactBlock(block: PublicContentBlock): Promise<void> {
    if (!this.editModeService.isEnabled() || this.savingBlockId()) {
      return;
    }

    this.savingBlockId.set(block.id);
    this.editFeedback.set(null);
    this.editError.set(null);

    try {
      const response = await firstValueFrom(this.publicContentAdminService.updateContentBlock(block.id, this.toBlockPayload(block)));
      if (response?.data) {
        this.replaceContentBlock(response.data);
      }
      this.editFeedback.set(this.ui().editSavedLabel);
    } catch (error) {
      this.editError.set(this.resolveEditErrorMessage(error));
    } finally {
      this.savingBlockId.set(null);
    }
  }

  async onCvSelected(block: PublicContentBlock, event: Event): Promise<void> {
    const input = event.target as HTMLInputElement | null;
    const file = input?.files?.item(0) ?? null;
    if (!file || !this.editModeService.isEnabled() || this.uploadingCv()) {
      return;
    }

    this.uploadingCv.set(true);
    this.editFeedback.set(null);
    this.editError.set(null);

    try {
      const uploadResponse = await firstValueFrom(this.documentAdminService.uploadDocument(file, 'cv'));
      const response = await firstValueFrom(
        this.publicContentAdminService.updateContentBlock(block.id, {
          ...this.toBlockPayload(block),
          documentId: uploadResponse.data.id,
        }),
      );
      if (response?.data) {
        this.replaceContentBlock(response.data);
      }
      this.editFeedback.set(this.ui().editCvSavedLabel);
    } catch (error) {
      this.editError.set(this.resolveEditErrorMessage(error));
    } finally {
      this.uploadingCv.set(false);
      if (input) {
        input.value = '';
      }
    }
  }

  controlError(controlName: ContactFormControlName): string | null {
    const control = this.contactForm.controls[controlName];

    if (!(control.invalid && (control.touched || control.dirty))) {
      return null;
    }

    if (control.hasError('required')) {
      return this.ui().validationRequired;
    }

    if (control.hasError('email')) {
      return this.ui().validationEmail;
    }

    if (control.hasError('maxlength')) {
      return this.ui().validationTooLong;
    }

    return null;
  }

  async submitContactForm(): Promise<void> {
    this.formState.set('idle');
    this.serverMessage.set('');

    if (this.contactForm.invalid) {
      this.contactForm.markAllAsTouched();
      return;
    }

    this.formState.set('submitting');

    try {
      const response = await firstValueFrom(this.contactService.sendContact(this.buildPayload()));
      this.handleSuccess(response);
    } catch (error) {
      this.handleError(error);
    }
  }

  private handleSuccess(response: ContactApiResponse): void {
    this.formState.set('success');
    this.serverMessage.set(this.ui().formSuccessLabel);
    this.contactForm.reset({
      name: '',
      email: '',
      context: '',
      subject: '',
      message: '',
    });
    this.contactForm.markAsPristine();
    this.contactForm.markAsUntouched();
  }

  private handleError(error: unknown): void {
    this.formState.set('error');
    this.serverMessage.set(this.resolveErrorMessage(error));
  }

  private buildPayload(): ContactRequestPayload {
    const rawValue = this.contactForm.getRawValue();
    const subject = rawValue.subject.trim();

    return {
      name: rawValue.name.trim(),
      email: rawValue.email.trim(),
      message: rawValue.message.trim(),
      subject: subject || undefined,
      source: 'portfolio-web',
      context: 'contact-form',
      language: this.currentLanguage(),
      userAgent: globalThis.navigator?.userAgent || undefined,
      submittedAt: new Date().toISOString(),
    };
  }

  private resolveErrorMessage(error: unknown): string {
    if (error instanceof HttpErrorResponse) {
      const backendMessage = error.error?.message;

      if (typeof backendMessage === 'string' && backendMessage.trim().length > 0) {
        return backendMessage;
      }
    }

    return this.ui().formErrorLabel;
  }

  private async loadContentBlocks(includeDrafts = false): Promise<void> {
    try {
      const response = await firstValueFrom(
        includeDrafts ? this.publicContentAdminService.listContentBlocks() : this.publicContentService.listPublicContentBlocks(),
      );
      this.contentBlocks.set(response?.data ?? []);
    } catch {
      this.contentBlocks.set([]);
    }
  }

  private contentBlock(key: string): PublicContentBlock | null {
    const language = this.currentLanguage();

    return this.contentBlocks().find((block) => block.key === key && block.language === language) ?? null;
  }

  private contactChannel(key: string, fallback: ContactChannel): ContactChannel {
    const block = this.contentBlock(`contact.${key}`);
    const value = key === 'cv' ? fallback.value : block?.items?.[0]?.trim() || fallback.value;
    const href = block?.documentUrl ?? block?.items?.[1]?.trim() ?? (key === 'cv' ? block?.items?.[0]?.trim() : undefined) ?? fallback.href;

    return {
      ...fallback,
      label: block?.title?.trim() || fallback.label,
      value,
      note: block?.body?.trim() || fallback.note,
      href,
    };
  }

  private blockItems(block: PublicContentBlock | null, fallback: string[]): string[] {
    return block?.items?.length ? block.items : fallback;
  }

  private updateBlock(id: string, updater: (block: PublicContentBlock) => PublicContentBlock): void {
    this.contentBlocks.update((blocks) => blocks.map((block) => (block.id === id ? updater(block) : block)));
  }

  private replaceContentBlock(updated: PublicContentBlock): void {
    this.contentBlocks.update((blocks) => blocks.map((block) => (block.id === updated.id ? updated : block)));
  }

  private toBlockPayload(block: PublicContentBlock): PublicContentBlockUpdatePayload {
    return {
      title: block.title.trim(),
      body: block.body.trim(),
      items: block.items.map((item) => item.trim()).filter((item) => item.length > 0),
      documentId: block.documentId,
      published: block.published,
      displayOrder: block.displayOrder,
    };
  }

  private resolveEditErrorMessage(error: unknown): string {
    if (error instanceof HttpErrorResponse && typeof error.error?.message === 'string' && error.error.message.trim()) {
      return error.error.message;
    }

    return this.ui().editGenericError;
  }
}
