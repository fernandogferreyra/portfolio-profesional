import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface AdminAiTranslatePayload {
  text: string;
  sourceLanguage: 'es' | 'en';
  targetLanguage: 'es' | 'en';
  context?: string;
}

export interface AdminAiTranslateResponse {
  translatedText: string;
  sourceLanguage: 'es' | 'en';
  targetLanguage: 'es' | 'en';
  provider: string;
  model: string;
}

@Injectable({
  providedIn: 'root',
})
export class AdminAiService {
  private readonly http = inject(HttpClient);

  translate(payload: AdminAiTranslatePayload): Observable<ApiResponse<AdminAiTranslateResponse>> {
    return this.http.post<ApiResponse<AdminAiTranslateResponse>>('/api/admin/ai/translate', payload);
  }
}
