import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

import { ProjectsApiResponse, ProjectSummaryResponse } from '../models/projects.models';

@Injectable({
  providedIn: 'root',
})
export class ProjectsService {
  private readonly http = inject(HttpClient);

  getProjects(): Observable<ProjectSummaryResponse[]> {
    return this.http
      .get<ProjectsApiResponse>('/api/projects')
      .pipe(map((response) => response.data));
  }
}
