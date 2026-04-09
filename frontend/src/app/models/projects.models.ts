export interface ProjectSummaryResponse {
  slug: string;
  name: string;
  year: string;
  category: string;
  summary: string;
  stack: string[];
  featured: boolean;
  repositoryUrl: string | null;
}

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export type ProjectsApiResponse = ApiResponse<ProjectSummaryResponse[]>;
