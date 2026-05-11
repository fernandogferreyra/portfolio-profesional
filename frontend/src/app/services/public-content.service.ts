import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface PublicContentBlock {
  id: string;
  key: string;
  language: string;
  title: string;
  body: string;
  items: string[];
  published: boolean;
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface PublicContentBlockUpdatePayload {
  title: string;
  body: string;
  items: string[];
  published: boolean;
  displayOrder: number;
}

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

@Injectable({
  providedIn: 'root',
})
export class PublicContentService {
  private readonly http = inject(HttpClient);

  listPublicContentBlocks(): Observable<ApiResponse<PublicContentBlock[]>> {
    return this.http.get<ApiResponse<PublicContentBlock[]>>('/api/content-blocks');
  }
}
