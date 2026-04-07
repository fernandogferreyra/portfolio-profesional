import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

import {
  QuoteAdminDetail,
  QuoteAdminSummary,
  QuoteRequestPayload,
  QuoteResult,
} from '../models/quote.models';

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

@Injectable({
  providedIn: 'root',
})
export class QuoteService {
  private readonly http = inject(HttpClient);

  generateQuote(payload: QuoteRequestPayload): Observable<QuoteResult> {
    return this.http
      .post<ApiResponse<QuoteResult>>('/api/quote', payload)
      .pipe(map((response) => response.data));
  }

  getQuotes(): Observable<QuoteAdminSummary[]> {
    return this.http
      .get<ApiResponse<QuoteAdminSummary[]>>('/api/admin/quotes')
      .pipe(map((response) => response.data));
  }

  getQuoteById(id: string): Observable<QuoteAdminDetail> {
    return this.http
      .get<ApiResponse<QuoteAdminDetail>>(`/api/admin/quotes/${id}`)
      .pipe(map((response) => response.data));
  }
}
