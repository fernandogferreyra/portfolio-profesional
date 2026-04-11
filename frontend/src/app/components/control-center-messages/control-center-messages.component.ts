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
  readonly messages = signal<ContactMessageSummary[]>([]);
  readonly selectedMessageId = signal<string | null>(null);
  readonly selectedMessage = signal<ContactMessageDetail | null>(null);
  readonly replyForm = this.formBuilder.nonNullable.group({
    subject: ['', [Validators.maxLength(160)]],
    message: ['', [Validators.required, Validators.maxLength(4000)]],
  });

  readonly content = computed(() =>
    this.currentLanguage() === 'es'
      ? {
          filters: [
            { id: 'ALL' as const, label: 'Todo' },
            { id: 'NEW' as const, label: 'Nuevos' },
            { id: 'READ' as const, label: 'Leidos' },
            { id: 'REPLIED' as const, label: 'Respondidos' },
            { id: 'ARCHIVED' as const, label: 'Archivados' },
          ],
          loading: 'Cargando mensajes...',
          empty: 'Todavia no hay mensajes para este filtro.',
          noSelection: 'Selecciona un mensaje para revisar el detalle y responder.',
          replyTitle: 'Responder',
          replySubject: 'Asunto de respuesta',
          replyMessage: 'Mensaje',
          replyCta: 'Enviar respuesta',
          markRead: 'Marcar como leido',
          archive: 'Archivar',
          refresh: 'Actualizar',
          from: 'De',
          received: 'Recibido',
          context: 'Contexto',
          language: 'Idioma',
          source: 'Origen',
          userAgent: 'Cliente',
          replied: 'Respondido',
          repliedBy: 'Por',
          detailTitle: 'Detalle del mensaje',
          listTitle: 'Inbox privado',
          defaultReplySubject: 'Gracias por tu mensaje',
          replySent: 'Respuesta enviada correctamente.',
          statusUpdated: 'Estado actualizado.',
          genericError: 'No se pudo completar la accion. Intenta nuevamente.',
        }
      : {
          filters: [
            { id: 'ALL' as const, label: 'All' },
            { id: 'NEW' as const, label: 'New' },
            { id: 'READ' as const, label: 'Read' },
            { id: 'REPLIED' as const, label: 'Replied' },
            { id: 'ARCHIVED' as const, label: 'Archived' },
          ],
          loading: 'Loading messages...',
          empty: 'There are no messages for this filter yet.',
          noSelection: 'Select a message to review its details and reply.',
          replyTitle: 'Reply',
          replySubject: 'Reply subject',
          replyMessage: 'Message',
          replyCta: 'Send reply',
          markRead: 'Mark as read',
          archive: 'Archive',
          refresh: 'Refresh',
          from: 'From',
          received: 'Received',
          context: 'Context',
          language: 'Language',
          source: 'Source',
          userAgent: 'Client',
          replied: 'Replied',
          repliedBy: 'By',
          detailTitle: 'Message detail',
          listTitle: 'Private inbox',
          defaultReplySubject: 'Thanks for your message',
          replySent: 'Reply sent successfully.',
          statusUpdated: 'Status updated.',
          genericError: 'The action could not be completed. Please try again.',
        },
  );

  constructor() {
    void this.loadMessages(true);
  }

  readonly selectedSummary = computed(
    () => this.messages().find((message) => message.id === this.selectedMessageId()) ?? null,
  );

  async selectFilter(filter: MessageFilterId): Promise<void> {
    this.selectedFilter.set(filter);
    await this.loadMessages(true);
  }

  async refresh(): Promise<void> {
    await this.loadMessages(false);
  }

  async selectMessage(messageId: string): Promise<void> {
    this.actionFeedback.set(null);
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
    } catch (error) {
      this.listError.set(this.resolveErrorMessage(error));
    }
  }

  async markRead(): Promise<void> {
    await this.applyStatus('READ');
  }

  async archive(): Promise<void> {
    await this.applyStatus('ARCHIVED');
  }

  async submitReply(): Promise<void> {
    const selected = this.selectedMessage();
    if (!selected || this.saving()) {
      return;
    }

    if (this.replyForm.invalid) {
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
      ? { NEW: 'Nuevo', READ: 'Leido', REPLIED: 'Respondido', ARCHIVED: 'Archivado' }
      : { NEW: 'New', READ: 'Read', REPLIED: 'Replied', ARCHIVED: 'Archived' };
    return labels[status];
  }

  private async loadMessages(resetSelection: boolean): Promise<void> {
    this.loading.set(true);
    this.listError.set(null);

    try {
      const currentFilter = this.selectedFilter();
      let status: ContactMessageStatus | undefined;
      if (currentFilter !== 'ALL') {
        status = currentFilter;
      }
      const response = await firstValueFrom(this.contactAdminService.listMessages(status));
      const messages = response?.data ?? [];
      this.messages.set(messages);

      if (!messages.length) {
        this.selectedMessageId.set(null);
        this.selectedMessage.set(null);
        return;
      }

      const keepCurrent = !resetSelection && this.selectedMessageId() && messages.some((message) => message.id === this.selectedMessageId());
      const nextId = keepCurrent ? this.selectedMessageId() : messages[0].id;
      if (nextId) {
        await this.selectMessage(nextId);
      }
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

  private resolveErrorMessage(error: unknown): string {
    if (error instanceof HttpErrorResponse && typeof error.error?.message === 'string' && error.error.message.trim()) {
      return error.error.message;
    }

    return this.content().genericError;
  }
}
