export type SiteActivityEventType =
  | 'section_view'
  | 'project_interaction'
  | 'contact_interaction'
  | 'quote_interaction'
  | 'estimator_interaction';

export interface SiteActivityEvent {
  id: string;
  type: SiteActivityEventType;
  action: string;
  label: string;
  route: string | null;
  createdAt: string;
}

export interface SiteActivityTrackRequest {
  eventType: SiteActivityEventType;
  path: string | null;
  source: string;
  reference: string;
  metadata: Record<string, string>;
}

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export type SiteActivityListResponse = ApiResponse<SiteActivityEvent[]>;
