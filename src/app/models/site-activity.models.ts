export type SiteActivityEventType =
  | 'section_view'
  | 'project_interaction'
  | 'contact_interaction'
  | 'quote_interaction';

export interface SiteActivityEvent {
  id: string;
  type: SiteActivityEventType;
  action: string;
  label: string;
  route: string | null;
  createdAt: string;
}
