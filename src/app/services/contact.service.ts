import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import type { Language } from '../i18n/translations';

export interface ContactRequestPayload {
  name: string;
  email: string;
  message: string;
  subject?: string;
  source: string;
  context: string;
  language: Language;
  userAgent?: string;
  submittedAt: string;
}

export interface ContactResponseData {
  id: string;
  createdAt: string;
}

export interface ContactApiResponse {
  success: boolean;
  message: string;
  data: ContactResponseData;
}

@Injectable({
  providedIn: 'root',
})
export class ContactService {
  private readonly http = inject(HttpClient);

  sendContact(payload: ContactRequestPayload): Observable<ContactApiResponse> {
    return this.http.post<ContactApiResponse>('/api/contact', payload);
  }
}
