import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface ProjectAdminItem {
  id: string;
  slug: string;
  name: string;
  year: string;
  category: string;
  summary: string;
  stack: string[];
  featured: boolean;
  published: boolean;
  displayOrder: number;
  repositoryUrl: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ProjectAdminUpdatePayload {
  slug: string;
  name: string;
  year: string;
  category: string;
  summary: string;
  stack: string[];
  repositoryUrl: string | null;
  featured: boolean;
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
export class ProjectAdminService {
  private readonly http = inject(HttpClient);

  listProjects(): Observable<ApiResponse<ProjectAdminItem[]>> {
    return this.http.get<ApiResponse<ProjectAdminItem[]>>('/api/admin/projects');
  }

  updateProject(id: string, payload: ProjectAdminUpdatePayload): Observable<ApiResponse<ProjectAdminItem>> {
    return this.http.patch<ApiResponse<ProjectAdminItem>>(`/api/admin/projects/${id}`, payload);
  }
}
