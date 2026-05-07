import { HttpErrorResponse } from '@angular/common/http';
import { Component, computed, inject, signal } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { firstValueFrom } from 'rxjs';

import { LanguageService } from '../../services/language.service';
import {
  ContactAdminService,
  ContactMessageDetail,
  ContactMessageStatus,
  ContactMessageSummary,
} from '../../services/contact-admin.service';

type MessageFilterId = 'ALL' | ContactMessageStatus;
const INBOX_STATUSES: ContactMessageStatus[] = ['NEW', 'READ', 'REPLIED'];

@Component({
  selector: 'app-control-center-messages',
  standalone: false,
  templateUrl: './control-center-messages.component.html',
  styleUrl: './control-center-messages.component.scss',
})
export class ControlCenterMessagesComponent {
  private readonly languageService = inject(LanguageService);
  private readonly contactAdminService = inject(ContactAdminService);
  private readonly formBuilder = inject(FormBuilder);

  readonly currentLanguage = this.languageService.language;
  readonly loading = signal(true);
  readonly saving = signal(false);
  readonly listError = signal<string | null>(null);
  readonly actionFeedback = signal<string | null>(null);
  readonly selectedFilter = signal<MessageFilterId>('ALL');
  readonly searchTerm = signal('');
  readonly messages = signal<ContactMessageSummary[]>([]);
  readonly selectedMessageId = signal<string | null>(null);
  readonly selectedMessage = signal<ContactMessageDetail | null>(null);
  readonly replyOpen = signal(false);
  readonly replyForm = this.formBuilder.nonNullable.group({
    subject: ['', [Validators.maxLength(160)]],
    message: ['', [Validators.required, Validators.maxLength(4000)]],
  });

  readonly content = computed(() =>
    this.currentLanguage() === 'es'
      ? {
          filters: [
            { id: 'ALL' as const, label: 'Bandeja de entrada' },
            { id: 'NEW' as const, label: 'Nuevos' },
            { id: 'READ' as const, label: 'Leidos' },
            { id: 'REPLIED' as const, label: 'Respondidos' },
            { id: 'ARCHIVED' as const, label: 'Archivados' },
            { id: 'SPAM' as const, label: 'No deseado' },
            { id: 'TRASH' as const, label: 'Papelera' },
          ],
          loading: 'Cargando mensajes...',
          empty: 'Todavia no hay mensajes para este filtro.',
          searchPlaceholder: 'Buscar por nombre, asunto o email',
          clearSearch: 'Limpiar',
          noSelection: 'Selecciona un mensaje para revisar el detalle y responder.',
          inboxEmptyTitle: 'Inbox vacio',
          replyTitle: 'Responder',
          replySubject: 'Asunto de respuesta',
          replyMessage: 'Mensaje',
          replyHint: 'La respuesta se envia al email del remitente y queda registrada en la bandeja.',
          replyMessageRequired: 'Escribe una respuesta antes de enviar.',
          replyCta: 'Enviar respuesta',
          cancelReply: 'Cancelar',
          markRead: 'Marcar como leido',
          archive: 'Archivar',
          markSpam: 'No deseado',
          moveTrash: 'Papelera',
          deleteMessage: 'Eliminar',
          refresh: 'Actualizar',
          foldersTitle: 'Carpetas',
          commandBar: 'Acciones de correo',
          selectedFolder: 'Carpeta activa',
          from: 'De',
          email: 'Email',
          subject: 'Asunto',
          received: 'Recibido',
          updated: 'Actualizado',
          context: 'Contexto',
          language: 'Idioma',
          source: 'Origen',
          userAgent: 'Cliente',
          replied: 'Respondido',
          repliedBy: 'Por',
          detailTitle: 'Detalle del mensaje',
          listTitle: 'Inbox privado',
          inboxLead: 'Consultas reales del formulario con estado, contexto y respuesta.',
          mailto: 'Abrir mailto',
          defaultReplySubject: 'Gracias por tu mensaje',
          replySent: 'Respuesta enviada correctamente.',
          statusUpdated: 'Estado actualizado.',
          deleted: 'Mensaje eliminado.',
          genericError: 'No se pudo completar la accion. Intenta nuevamente.',
        }
      : {
          filters: [
            { id: 'ALL' as const, label: 'Inbox' },
            { id: 'NEW' as const, label: 'New' },
            { id: 'READ' as const, label: 'Read' },
            { id: 'REPLIED' as const, label: 'Replied' },
            { id: 'ARCHIVED' as const, label: 'Archived' },
            { id: 'SPAM' as const, label: 'Junk' },
            { id: 'TRASH' as const, label: 'Trash' },
          ],
          loading: 'Loading messages...',
          empty: 'There are no messages for this filter yet.',
          searchPlaceholder: 'Search by name, subject, or email',
          clearSearch: 'Clear',
          noSelection: 'Select a message to review its details and reply.',
          inboxEmptyTitle: 'Inbox empty',
          replyTitle: 'Reply',
          replySubject: 'Reply subject',
          replyMessage: 'Message',
          replyHint: 'The reply is sent to the sender email and also stored in the inbox.',
          replyMessageRequired: 'Write a reply before sending it.',
          replyCta: 'Send reply',
          cancelReply: 'Cancel',
          markRead: 'Mark as read',
          archive: 'Archive',
          markSpam: 'Junk',
          moveTrash: 'Trash',
          deleteMessage: 'Delete',
          refresh: 'Refresh',
          foldersTitle: 'Folders',
          commandBar: 'Mail actions',
          selectedFolder: 'Active folder',
          from: 'From',
          email: 'Email',
          subject: 'Subject',
          received: 'Received',
          updated: 'Updated',
          context: 'Context',
          language: 'Language',
          source: 'Source',
          userAgent: 'Client',
          replied: 'Replied',
          repliedBy: 'By',
          detailTitle: 'Message detail',
          listTitle: 'Private inbox',
          inboxLead: 'Real contact-form inquiries with status, context, and reply trace.',
          mailto: 'Open mailto',
          defaultReplySubject: 'Thanks for your message',
          replySent: 'Reply sent successfully.',
          statusUpdated: 'Status updated.',
          deleted: 'Message deleted.',
          genericError: 'The action could not be completed. Please try again.',
        },
  );

  constructor() {
    void this.loadMessages(true);
  }

  readonly selectedSummary = computed(
    () => this.messages().find((message) => message.id === this.selectedMessageId()) ?? null,
  );

  readonly visibleMessages = computed(() => {
    const filter = this.selectedFilter();
    const query = this.searchTerm().trim().toLowerCase();

    return this.messages().filter((message) => {
      if (filter === 'ALL' && !INBOX_STATUSES.includes(message.status)) {
        return false;
      }

      if (filter !== 'ALL' && message.status !== filter) {
        return false;
      }

      if (!query) {
        return true;
      }

      const searchable = [
        message.name,
        message.email,
        message.subject,
        message.messagePreview,
        message.context ?? '',
      ]
        .join(' ')
        .toLowerCase();

      return searchable.includes(query);
    });
  });

  readonly filterOptions = computed(() => {
    const filters = this.content().filters;
    const messages = this.messages();

    return filters.map((filter) => ({
      ...filter,
      count:
        filter.id === 'ALL'
          ? messages.filter((message) => INBOX_STATUSES.includes(message.status)).length
          : messages.filter((message) => message.status === filter.id).length,
    }));
  });

  readonly activeFilterLabel = computed(
    () => this.filterOptions().find((filter) => filter.id === this.selectedFilter())?.label ?? this.content().listTitle,
  );

  async selectFilter(filter: MessageFilterId): Promise<void> {
    this.selectedFilter.set(filter);
    await this.syncSelectionWithVisibleMessages(true);
  }

  async refresh(): Promise<void> {
    await this.loadMessages(false);
  }

  async selectMessage(messageId: string, clearFeedback = true): Promise<void> {
    if (clearFeedback) {
      this.actionFeedback.set(null);
    }
    this.selectedMessageId.set(messageId);

    try {
      const response = await firstValueFrom(this.contactAdminService.getMessage(messageId));
      this.selectedMessage.set(response?.data ?? null);

      const defaultSubject = this.selectedMessage()?.subject
        ? `Re: ${this.selectedMessage()?.subject}`
        : this.content().defaultReplySubject;
      this.replyForm.reset({
        subject: defaultSubject,
        message: '',
      });
      this.replyOpen.set(false);
      this.replyForm.markAsPristine();
      this.replyForm.markAsUntouched();
    } catch (error) {
      this.selectedMessage.set(null);
      this.listError.set(this.resolveErrorMessage(error));
    }
  }

  async updateSearchTerm(term: string): Promise<void> {
    this.searchTerm.set(term);
    await this.syncSelectionWithVisibleMessages(false);
  }

  async clearSearch(): Promise<void> {
    if (!this.searchTerm()) {
      return;
    }

    this.searchTerm.set('');
    await this.syncSelectionWithVisibleMessages(false);
  }

  async markRead(): Promise<void> {
    await this.applyStatus('READ');
  }

  async archive(): Promise<void> {
    await this.applyStatus('ARCHIVED');
  }

  async markSpam(): Promise<void> {
    await this.applyStatus('SPAM');
  }

  async moveTrash(): Promise<void> {
    await this.applyStatus('TRASH');
  }

  async deleteSelectedMessage(): Promise<void> {
    const selected = this.selectedMessage();
    if (!selected || this.saving()) {
      return;
    }

    if (selected.status !== 'TRASH') {
      await this.applyStatus('TRASH');
      return;
    }

    this.saving.set(true);
    this.actionFeedback.set(null);

    try {
      await firstValueFrom(this.contactAdminService.deleteMessage(selected.id));
      this.messages.update((messages) => messages.filter((message) => message.id !== selected.id));
      this.selectedMessageId.set(null);
      this.selectedMessage.set(null);
      this.replyOpen.set(false);
      this.actionFeedback.set(this.content().deleted);
      await this.syncSelectionWithVisibleMessages(false);
    } catch (error) {
      this.actionFeedback.set(this.resolveErrorMessage(error));
    } finally {
      this.saving.set(false);
    }
  }

  async submitReply(): Promise<void> {
    const selected = this.selectedMessage();
    if (!selected || this.saving()) {
      return;
    }

    if (this.replyForm.invalid) {
      this.replyOpen.set(true);
      this.replyForm.markAllAsTouched();
      return;
    }

    const payload = this.replyForm.getRawValue();
    this.saving.set(true);
    this.actionFeedback.set(null);

    try {
      const response = await firstValueFrom(
        this.contactAdminService.reply(selected.id, payload.message.trim(), payload.subject.trim()),
      );
      if (response?.data) {
        this.selectedMessage.set(response.data);
        this.patchSummary(response.data);
      }
      this.replyForm.patchValue({ message: '' });
      this.replyForm.markAsPristine();
      this.replyForm.markAsUntouched();
      this.replyOpen.set(false);
      this.actionFeedback.set(this.content().replySent);
      await this.loadMessages(false);
    } catch (error) {
      this.actionFeedback.set(this.resolveErrorMessage(error));
    } finally {
      this.saving.set(false);
    }
  }

  trackById(_: number, item: { id: string }): string {
    return item.id;
  }

  statusLabel(status: ContactMessageStatus): string {
    const labels: Record<ContactMessageStatus, string> = this.currentLanguage() === 'es'
      ? { NEW: 'Nuevo', READ: 'Leido', REPLIED: 'Respondido', ARCHIVED: 'Archivado', SPAM: 'No deseado', TRASH: 'Papelera' }
      : { NEW: 'New', READ: 'Read', REPLIED: 'Replied', ARCHIVED: 'Archived', SPAM: 'Junk', TRASH: 'Trash' };
    return labels[status];
  }

  senderInitials(name: string): string {
    const parts = name.trim().split(/\s+/).filter(Boolean);
    if (!parts.length) {
      return '?';
    }

    return parts.slice(0, 2).map((part) => part[0]?.toUpperCase()).join('');
  }

  openReply(): void {
    this.replyOpen.set(true);
  }

  cancelReply(): void {
    this.replyOpen.set(false);
    this.replyForm.patchValue({ message: '' });
    this.replyForm.markAsPristine();
    this.replyForm.markAsUntouched();
  }

  private async loadMessages(resetSelection: boolean): Promise<void> {
    this.loading.set(true);
    this.listError.set(null);

    try {
      const response = await firstValueFrom(this.contactAdminService.listMessages());
      const messages = response?.data ?? [];
      this.messages.set(messages);
      await this.syncSelectionWithVisibleMessages(resetSelection);
    } catch (error) {
      this.listError.set(this.resolveErrorMessage(error));
    } finally {
      this.loading.set(false);
    }
  }

  private async applyStatus(status: ContactMessageStatus): Promise<void> {
    const selected = this.selectedMessage();
    if (!selected || this.saving()) {
      return;
    }

    this.saving.set(true);
    this.actionFeedback.set(null);

    try {
      const response = await firstValueFrom(this.contactAdminService.updateStatus(selected.id, status));
      if (response?.data) {
        this.selectedMessage.set(response.data);
        this.patchSummary(response.data);
      }
      this.actionFeedback.set(this.content().statusUpdated);
      await this.syncSelectionWithVisibleMessages(false);
      await this.loadMessages(false);
    } catch (error) {
      this.actionFeedback.set(this.resolveErrorMessage(error));
    } finally {
      this.saving.set(false);
    }
  }

  private patchSummary(detail: ContactMessageDetail): void {
    this.messages.update((messages) =>
      messages.map((message) =>
        message.id === detail.id
          ? {
              ...message,
              status: detail.status,
              repliedAt: detail.repliedAt,
            }
          : message,
      ),
    );
  }

  private async syncSelectionWithVisibleMessages(resetSelection: boolean): Promise<void> {
    const visibleMessages = this.visibleMessages();

    if (!visibleMessages.length) {
      this.selectedMessageId.set(null);
      this.selectedMessage.set(null);
      return;
    }

    const currentId = this.selectedMessageId();
    const keepCurrent = !resetSelection && currentId && visibleMessages.some((message) => message.id === currentId);
    const nextId = keepCurrent ? currentId : visibleMessages[0].id;

    if (nextId === currentId && this.selectedMessage()) {
      return;
    }

    await this.selectMessage(nextId, false);
  }

  private resolveErrorMessage(error: unknown): string {
    if (error instanceof HttpErrorResponse && typeof error.error?.message === 'string' && error.error.message.trim()) {
      return error.error.message;
    }

    return this.content().genericError;
  }
}
