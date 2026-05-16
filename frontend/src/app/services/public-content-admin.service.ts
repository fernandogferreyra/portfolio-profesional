import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { PublicContentBlock, PublicContentBlockCreatePayload, PublicContentBlockUpdatePayload } from './public-content.service';

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

@Injectable({
  providedIn: 'root',
})
export class PublicContentAdminService {
  private readonly http = inject(HttpClient);

  listContentBlocks(): Observable<ApiResponse<PublicContentBlock[]>> {
    return this.http.get<ApiResponse<PublicContentBlock[]>>('/api/admin/content-blocks');
  }

  createContentBlock(payload: PublicContentBlockCreatePayload): Observable<ApiResponse<PublicContentBlock>> {
    return this.http.post<ApiResponse<PublicContentBlock>>('/api/admin/content-blocks', payload);
  }

  updateContentBlock(id: string, payload: PublicContentBlockUpdatePayload): Observable<ApiResponse<PublicContentBlock>> {
    return this.http.patch<ApiResponse<PublicContentBlock>>(`/api/admin/content-blocks/${id}`, payload);
  }
}
