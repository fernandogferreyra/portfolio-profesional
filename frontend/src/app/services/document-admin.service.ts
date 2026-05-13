import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface DocumentAdminItem {
  id: string;
  purpose: string;
  originalFilename: string;
  storedFilename: string;
  contentType: string;
  sizeBytes: number;
  storagePath: string;
  createdAt: string;
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
export class DocumentAdminService {
  private readonly http = inject(HttpClient);

  listDocuments(): Observable<ApiResponse<DocumentAdminItem[]>> {
    return this.http.get<ApiResponse<DocumentAdminItem[]>>('/api/admin/documents');
  }

  uploadDocument(file: File, purpose: string): Observable<ApiResponse<DocumentAdminItem>> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('purpose', purpose);
    return this.http.post<ApiResponse<DocumentAdminItem>>('/api/admin/documents', formData);
  }

  deleteDocument(id: string): Observable<ApiResponse<null>> {
    return this.http.delete<ApiResponse<null>>(`/api/admin/documents/${id}`);
  }
}
