import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { SkillCategoryResponse } from '../models/skills.models';

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

@Injectable({
  providedIn: 'root',
})
export class SkillService {
  private readonly http = inject(HttpClient);

  listSkills(language: string): Observable<ApiResponse<SkillCategoryResponse[]>> {
    return this.http.get<ApiResponse<SkillCategoryResponse[]>>('/api/skills', {
      params: new HttpParams().set('language', language),
    });
  }
}
