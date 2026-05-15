import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface CredentialItem {
  id: string;
  language: string;
  type: string;
  title: string;
  institution: string;
  description: string;
  documentId: string | null;
  documentUrl: string | null;
  published: boolean;
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface CredentialUpdatePayload {
  language: string;
  type: string;
  title: string;
  institution: string;
  description: string;
  documentId: string | null;
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
export class CredentialService {
  private readonly http = inject(HttpClient);

  listCredentials(): Observable<ApiResponse<CredentialItem[]>> {
    return this.http.get<ApiResponse<CredentialItem[]>>('/api/credentials');
  }

  listAdminCredentials(): Observable<ApiResponse<CredentialItem[]>> {
    return this.http.get<ApiResponse<CredentialItem[]>>('/api/admin/credentials');
  }

  createCredential(language: string): Observable<ApiResponse<CredentialItem>> {
    return this.http.post<ApiResponse<CredentialItem>>('/api/admin/credentials', { language });
  }

  updateCredential(id: string, payload: CredentialUpdatePayload): Observable<ApiResponse<CredentialItem>> {
    return this.http.patch<ApiResponse<CredentialItem>>(`/api/admin/credentials/${id}`, payload);
  }
}
