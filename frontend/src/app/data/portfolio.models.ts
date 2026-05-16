import { Language } from '../i18n/translations';
import { ProjectAssetResponse } from '../models/projects.models';

export type LocalizedText = Record<Language, string>;

export type ThemeId =
  | 'themeNeon'
  | 'themeBlueGrid'
  | 'themeEX'
  | 'themeLightWorkbench'
  | 'themeLinuxTerminal'
  | 'themeRetroAmber'
  | 'themeCmd'
  | 'themeUbuntu'
  | 'themeWin11'
  | 'themeWin98'
  | 'themeWinXP';

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
  | 'data'
  | 'tools'
  | 'ai'
  | 'soft';

export type SkillLevelId = 'basic' | 'intermediate' | 'advanced';

export type SkillIconId =
  | 'java'
  | 'javascript'
  | 'cplusplus'
  | 'python'
  | 'spring'
  | 'dotnet'
  | 'angular'
  | 'typescript'
  | 'frontend'
  | 'openapi'
  | 'postgresql'
  | 'database'
  | 'testing'
  | 'docker'
  | 'git'
  | 'github'
  | 'ide'
  | 'arduino'
  | 'automation'
  | 'microservices'
  | 'architecture'
  | 'security'
  | 'ai'
  | 'llm'
  | 'problemSolving'
  | 'analyticalThinking'
  | 'adaptability'
  | 'teamwork'
  | 'autonomy'
  | 'continuousLearning';

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
  tags?: LocalizedText[];
  showLevel?: boolean;
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
  iconUrl?: string | null;
  name: string;
  year: string;
  category: LocalizedText;
  summary: LocalizedText;
  description: LocalizedText;
  stack: string[];
  metrics: ProjectMetric[];
  sections: ProjectSection[];
  features: LocalizedText[];
  documentation?: ProjectAssetResponse[];
  screenshots?: ProjectAssetResponse[];
  actions: ProjectAction[];
  media?: ProjectMedia;
}

export function localizeText(text: LocalizedText, language: Language): string {
  return text[language];
}
