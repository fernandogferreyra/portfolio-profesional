export interface SkillItemResponse {
  id: string;
  language: string;
  slug: string;
  name: string;
  description: string;
  categoryId: string | null;
  categorySlug: string | null;
  icon: string;
  iconDocumentId: string | null;
  iconUrl: string | null;
  accentColor: string;
  level: string;
  tags: string[];
  showLevel: boolean;
  published: boolean;
  displayOrder: number;
}

export interface SkillCategoryResponse {
  id: string;
  language: string;
  slug: string;
  label: string;
  description: string;
  published: boolean;
  displayOrder: number;
  skills: SkillItemResponse[];
}

export interface SkillUpdatePayload {
  slug: string;
  name: string;
  description: string;
  categoryId: string | null;
  icon: string;
  iconDocumentId: string | null;
  accentColor: string;
  level: string;
  tags: string[];
  showLevel: boolean;
  published: boolean;
  displayOrder: number;
}

export interface SkillCreatePayload extends SkillUpdatePayload {
  language: string;
}

export interface SkillCategoryUpdatePayload {
  slug: string;
  label: string;
  description: string;
  published: boolean;
  displayOrder: number;
}

export interface SkillCategoryCreatePayload extends SkillCategoryUpdatePayload {
  language: string;
}
