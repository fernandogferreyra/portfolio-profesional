export interface ProjectMetricResponse {
  value: string;
  label: string;
}

export interface ProjectSectionResponse {
  title: string;
  items: string[];
}

export interface ProjectAssetResponse {
  id: string;
  filename: string;
  contentType: string;
  url: string;
}

export interface ProjectSummaryResponse {
  slug: string;
  name: string;
  year: string;
  category: string;
  summary: string;
  stack: string[];
  featured: boolean;
  repositoryUrl: string | null;
  demoUrl: string | null;
  monographUrl: string | null;
  iconUrl: string | null;
  metrics: ProjectMetricResponse[];
  sections: ProjectSectionResponse[];
  features: string[];
  documentation: ProjectAssetResponse[];
  screenshots: ProjectAssetResponse[];
}

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export type ProjectsApiResponse = ApiResponse<ProjectSummaryResponse[]>;
