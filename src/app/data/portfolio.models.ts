import { Language } from '../i18n/translations';

export type LocalizedText = Record<Language, string>;

export type ThemeId = 'themeNeon' | 'themeEX' | 'themeLight';

export interface ThemeDefinition {
  id: ThemeId;
  shortLabel: string;
  label: LocalizedText;
  description: LocalizedText;
  preview: {
    accent: string;
    accentSoft: string;
    surface: string;
  };
}

export type SkillCategoryId =
  | 'backend'
  | 'frontend'
  | 'databases'
  | 'testing'
  | 'tools'
  | 'architecture-security'
  | 'ai';

export type SkillIconId =
  | 'java'
  | 'spring'
  | 'dotnet'
  | 'angular'
  | 'typescript'
  | 'frontend'
  | 'postgresql'
  | 'database'
  | 'testing'
  | 'docker'
  | 'git'
  | 'microservices'
  | 'architecture'
  | 'security'
  | 'ai'
  | 'llm';

export interface SkillCategoryDefinition {
  id: SkillCategoryId;
  label: LocalizedText;
  description: LocalizedText;
}

export interface SkillIconDefinition {
  viewBox: string;
  paths: string[];
  accent: string;
  surface: string;
  border: string;
}

export interface PortfolioSkill {
  id: string;
  icon: SkillIconId;
  name: string;
  category: SkillCategoryId;
  description: LocalizedText;
  featured?: boolean;
}

export type ProjectActionType = 'modal' | 'external' | 'internal';

export interface ProjectAction {
  id: string;
  type: ProjectActionType;
  label: LocalizedText;
  primary?: boolean;
  url?: string;
  routerLink?: string;
}

export interface ProjectMetric {
  value: string;
  label: LocalizedText;
}

export interface ProjectSection {
  title: LocalizedText;
  items: LocalizedText[];
}

export interface ProjectMedia {
  thumbnailUrl?: string;
  embedUrl?: string;
  alt: LocalizedText;
  iframeTitle?: LocalizedText;
}

export interface PortfolioProject {
  id: string;
  name: string;
  year: string;
  category: LocalizedText;
  status: LocalizedText;
  summary: LocalizedText;
  description: LocalizedText;
  stack: string[];
  metrics: ProjectMetric[];
  sections: ProjectSection[];
  features: LocalizedText[];
  actions: ProjectAction[];
  media?: ProjectMedia;
}

export function localizeText(text: LocalizedText, language: Language): string {
  return text[language];
}
