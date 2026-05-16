import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import {
  SkillCategoryCreatePayload,
  SkillCategoryResponse,
  SkillCategoryUpdatePayload,
  SkillCreatePayload,
  SkillItemResponse,
  SkillUpdatePayload,
} from '../models/skills.models';

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

@Injectable({
  providedIn: 'root',
})
export class SkillAdminService {
  private readonly http = inject(HttpClient);

  listSkills(language: string): Observable<ApiResponse<SkillCategoryResponse[]>> {
    return this.http.get<ApiResponse<SkillCategoryResponse[]>>('/api/admin/skills', {
      params: new HttpParams().set('language', language),
    });
  }

  createSkill(payload: SkillCreatePayload): Observable<ApiResponse<SkillItemResponse>> {
    return this.http.post<ApiResponse<SkillItemResponse>>('/api/admin/skills', payload);
  }

  updateSkill(id: string, payload: SkillUpdatePayload): Observable<ApiResponse<SkillItemResponse>> {
    return this.http.patch<ApiResponse<SkillItemResponse>>(`/api/admin/skills/${id}`, payload);
  }

  deleteSkill(id: string): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`/api/admin/skills/${id}`);
  }

  createCategory(payload: SkillCategoryCreatePayload): Observable<ApiResponse<SkillCategoryResponse>> {
    return this.http.post<ApiResponse<SkillCategoryResponse>>('/api/admin/skill-categories', payload);
  }

  updateCategory(id: string, payload: SkillCategoryUpdatePayload): Observable<ApiResponse<SkillCategoryResponse>> {
    return this.http.patch<ApiResponse<SkillCategoryResponse>>(`/api/admin/skill-categories/${id}`, payload);
  }

  deleteCategory(id: string): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`/api/admin/skill-categories/${id}`);
  }
}
