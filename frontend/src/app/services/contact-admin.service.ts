import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export type ContactMessageStatus = 'NEW' | 'READ' | 'REPLIED' | 'ARCHIVED';

export interface ContactMessageSummary {
  id: string;
  name: string;
  email: string;
  subject: string;
  messagePreview: string;
  status: ContactMessageStatus;
  language: string | null;
  context: string | null;
  createdAt: string;
  repliedAt: string | null;
}

export interface ContactMessageDetail extends ContactMessageSummary {
  message: string;
  source: string | null;
  userAgent: string | null;
  submittedAt: string | null;
  replyMessage: string | null;
  repliedBy: string | null;
  updatedAt: string;
}

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

@Injectable({
  providedIn: 'root',
})
export class ContactAdminService {
  private readonly http = inject(HttpClient);

  listMessages(status?: ContactMessageStatus): Observable<ApiResponse<ContactMessageSummary[]>> {
    const suffix = status ? `?status=${status}` : '';
    return this.http.get<ApiResponse<ContactMessageSummary[]>>(`/api/admin/contact-messages${suffix}`);
  }

  getMessage(id: string): Observable<ApiResponse<ContactMessageDetail>> {
    return this.http.get<ApiResponse<ContactMessageDetail>>(`/api/admin/contact-messages/${id}`);
  }

  updateStatus(id: string, status: ContactMessageStatus): Observable<ApiResponse<ContactMessageDetail>> {
    return this.http.patch<ApiResponse<ContactMessageDetail>>(`/api/admin/contact-messages/${id}/status`, { status });
  }

  reply(id: string, message: string, subject?: string): Observable<ApiResponse<ContactMessageDetail>> {
    return this.http.post<ApiResponse<ContactMessageDetail>>(`/api/admin/contact-messages/${id}/reply`, {
      message,
      subject: subject?.trim() || undefined,
    });
  }
}
