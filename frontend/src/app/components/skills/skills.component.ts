import { HttpErrorResponse } from '@angular/common/http';
import { Component, computed, effect, inject, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';

import { PORTFOLIO_SKILLS, SKILL_CATEGORIES, SKILL_ICONS, SKILL_LEVELS } from '../../data/portfolio.data';
import {
  SkillCategoryId,
  SkillIconDefinition,
  SkillLevelId,
  localizeText,
} from '../../data/portfolio.models';
import { EditModeService } from '../../services/edit-mode.service';
import { LanguageService } from '../../services/language.service';
import {
  PublicContentBlock,
  PublicContentBlockUpdatePayload,
  PublicContentService,
} from '../../services/public-content.service';
import { PublicContentAdminService } from '../../services/public-content-admin.service';

type ShowcaseLaneDirection = 'left' | 'right';

interface SkillView {
  id: string;
  icon: SkillIconDefinition;
  name: string;
  description: string;
  tags: string[];
  level?: SkillLevelId;
  levelLabel?: string;
  showLevel: boolean;
  published: boolean;
}

interface CategoryView {
  id: SkillCategoryId;
  label: string;
  description: string;
  skills: SkillView[];
}

interface FocusAreaView {
  id: SkillCategoryId;
  label: string;
  width: string;
}

interface ShowcaseLaneView {
  id: string;
  label: string;
  direction: ShowcaseLaneDirection;
  duration: string;
  skills: SkillView[];
}

const TECHNICAL_FOCUS_IDS: SkillCategoryId[] = ['backend', 'frontend', 'data', 'tools', 'ai'];
const LANE_ORDER: SkillCategoryId[] = ['backend', 'frontend', 'data', 'tools', 'ai', 'soft'];

const LANE_DIRECTION: Record<SkillCategoryId, ShowcaseLaneDirection> = {
  backend: 'left',
  frontend: 'right',
  data: 'left',
  tools: 'right',
  ai: 'left',
  soft: 'right',
};

const LANE_DURATION: Record<SkillCategoryId, string> = {
  backend: '78s',
  frontend: '72s',
  data: '74s',
  tools: '84s',
  ai: '76s',
  soft: '88s',
};

@Component({
  selector: 'app-skills',
  standalone: false,
  templateUrl: './skills.component.html',
  styleUrl: './skills.component.scss',
})
export class SkillsComponent {
  private readonly languageService = inject(LanguageService);
  private readonly publicContentService = inject(PublicContentService);
  private readonly publicContentAdminService = inject(PublicContentAdminService);

  readonly editModeService = inject(EditModeService);
  readonly currentLanguage = this.languageService.language;
  readonly laneCopies = [0, 1] as const;
  readonly showAllSkills = signal(false);
  readonly contentBlocks = signal<PublicContentBlock[]>([]);
  readonly selectedSkillBlockId = signal<string | null>(null);
  readonly savingBlockId = signal<string | null>(null);
  readonly editFeedback = signal<string | null>(null);
  readonly editError = signal<string | null>(null);

  readonly ui = computed(() =>
    this.currentLanguage() === 'es'
      ? {
          eyebrow: 'Skills',
          title: this.contentBlock('skills.hero')?.title ?? 'Stack técnico organizado por áreas clave.',
          intro:
            this.contentBlock('skills.hero')?.body ??
            'Tecnologías, herramientas y capacidades de trabajo organizadas en un flujo visual continuo, claro y profesional.',
          focusTitle: this.contentBlock('skills.hero')?.items?.[0] ?? 'Enfoque técnico',
          lanesTitle: this.contentBlock('skills.hero')?.items?.[1] ?? 'Stack por áreas',
          toggleShowAll: 'Ver todas',
          toggleShowAnimated: 'Skills',
          expandedTitle: 'Todas las skills por categoría',
          lanesDescription:
            this.contentBlock('skills.hero')?.items?.[2] ??
            'Cada fila reúne tecnologías o habilidades relacionadas dentro del mismo lenguaje visual, con movimiento suave y lectura rápida.',
          editTitle: 'Editar Skills',
          editDescription: 'Estos campos actualizan los bloques CMS del idioma activo. Publicado controla si la skill se ve publicamente.',
          editModeLabel: 'EditMode Skills',
          editTitleLabel: 'Titulo',
          editNameLabel: 'Nombre',
          editBodyLabel: 'Descripcion',
          editItemLabel: 'Detalle',
          editTagLabel: 'Tag',
          editNewItemLabel: 'Nuevo detalle',
          editNewTagLabel: 'Nuevo tag',
          editAddItemLabel: 'Agregar detalle',
          editAddTagLabel: 'Agregar tag',
          editRemoveLabel: 'Quitar',
          editPublishedLabel: 'Publicado',
          editDraftLabel: 'Oculta',
          editSaveLabel: 'Guardar bloque',
          editSavingLabel: 'Guardando...',
        }
      : {
          eyebrow: 'Skills',
          title: this.contentBlock('skills.hero')?.title ?? 'Technical stack organized by core areas.',
          intro:
            this.contentBlock('skills.hero')?.body ??
            'Technologies, tools, and working capabilities organized in a continuous, clear, and professional visual flow.',
          focusTitle: this.contentBlock('skills.hero')?.items?.[0] ?? 'Technical focus',
          lanesTitle: this.contentBlock('skills.hero')?.items?.[1] ?? 'Stack by area',
          toggleShowAll: 'View all',
          toggleShowAnimated: 'Skills',
          expandedTitle: 'All skills by category',
          lanesDescription:
            this.contentBlock('skills.hero')?.items?.[2] ??
            'Each lane groups related technologies or capabilities within the same visual language, with subtle motion and quick scanning.',
          editTitle: 'Edit Skills',
          editDescription: 'These fields update CMS blocks for the active language. Published controls whether the skill is public.',
          editModeLabel: 'Skills EditMode',
          editTitleLabel: 'Title',
          editNameLabel: 'Name',
          editBodyLabel: 'Description',
          editItemLabel: 'Detail',
          editTagLabel: 'Tag',
          editNewItemLabel: 'New detail',
          editNewTagLabel: 'New tag',
          editAddItemLabel: 'Add detail',
          editAddTagLabel: 'Add tag',
          editRemoveLabel: 'Remove',
          editPublishedLabel: 'Published',
          editDraftLabel: 'Hidden',
          editSaveLabel: 'Save block',
          editSavingLabel: 'Saving...',
        },
  );

  readonly categories = computed<CategoryView[]>(() => {
    const language = this.currentLanguage();

    return SKILL_CATEGORIES.map((category) => ({
      id: category.id,
      label: localizeText(category.label, language),
      description: localizeText(category.description, language),
      skills: PORTFOLIO_SKILLS.filter((skill) => skill.category === category.id)
        .map((skill) => {
          const level = SKILL_LEVELS[skill.id];
          const block = this.contentBlock(`skill.${skill.id}`);
          const hasCms = this.hasSkillCmsBlocks(language);

          if (hasCms && !block) {
            return null;
          }

          const published = block?.published ?? true;
          if (!published && !this.editModeService.isEnabled()) {
            return null;
          }

          const view: SkillView = {
            id: skill.id,
            icon: SKILL_ICONS[skill.icon],
            name: block?.title ?? skill.name,
            description: block?.body ?? localizeText(skill.description, language),
            tags: block?.items?.length ? block.items : (skill.tags ?? []).map((tag) => localizeText(tag, language)),
            level,
            levelLabel: level ? this.localizeLevel(level, language) : undefined,
            showLevel: skill.showLevel !== false && Boolean(level),
            published,
          };

          return view;
        })
        .filter((skill): skill is SkillView => Boolean(skill)),
    }));
  });

  readonly focusAreas = computed<FocusAreaView[]>(() =>
    this.categories()
      .filter((category) => TECHNICAL_FOCUS_IDS.includes(category.id))
      .map((category) => ({
        id: category.id,
        label: category.label,
        width: this.focusWidth(category.skills.length),
      })),
  );

  readonly showcaseLanes = computed<ShowcaseLaneView[]>(() => {
    const categoriesById = new Map(this.categories().map((category) => [category.id, category] as const));

    return LANE_ORDER.map((categoryId) => categoriesById.get(categoryId))
      .filter((category): category is CategoryView => Boolean(category))
      .map((category) => ({
        id: `lane-${category.id}`,
        label: category.label,
        direction: LANE_DIRECTION[category.id],
        duration: LANE_DURATION[category.id],
        skills: category.skills,
      }));
  });
  readonly editableSkillBlocks = computed(() => {
    const language = this.currentLanguage();
    return this.contentBlocks()
      .filter((block) => block.language === language && block.key.startsWith('skill.'))
      .sort((left, right) => left.displayOrder - right.displayOrder || left.title.localeCompare(right.title));
  });
  readonly heroBlock = computed(() => this.contentBlock('skills.hero'));

  constructor() {
    effect(() => {
      const editModeEnabled = this.editModeService.isEnabled();
      this.currentLanguage();
      void this.loadContentBlocks(editModeEnabled);
    });
  }

  trackBySkillId(_index: number, skill: SkillView): string {
    return skill.id;
  }

  trackByLaneId(_index: number, lane: ShowcaseLaneView): string {
    return lane.id;
  }

  trackByFocusId(_index: number, item: FocusAreaView): SkillCategoryId {
    return item.id;
  }

  trackByCategoryId(_index: number, item: CategoryView): SkillCategoryId {
    return item.id;
  }

  toggleSkillPresentation(): void {
    this.showAllSkills.update((current) => !current);
  }

  skillBlock(skillId: string): PublicContentBlock | null {
    return this.contentBlock(`skill.${skillId}`);
  }

  isSkillBlock(block: PublicContentBlock): boolean {
    return block.key.startsWith('skill.');
  }

  updateBlockTitle(id: string, value: string): void {
    this.updateBlock(id, (block) => ({ ...block, title: value }));
  }

  updateBlockBody(id: string, value: string): void {
    this.updateBlock(id, (block) => ({ ...block, body: value }));
  }

  updateBlockItem(id: string, index: number, value: string): void {
    this.updateBlock(id, (block) => {
      const items = [...block.items];
      items[index] = value;
      return { ...block, items };
    });
  }

  addBlockItem(id: string, value: string): void {
    this.updateBlock(id, (block) => ({ ...block, items: [...block.items, value] }));
  }

  removeBlockItem(id: string, index: number): void {
    this.updateBlock(id, (block) => ({ ...block, items: block.items.filter((_, itemIndex) => itemIndex !== index) }));
  }

  updateBlockPublished(id: string, published: boolean): void {
    this.updateBlock(id, (block) => ({ ...block, published }));
  }

  async saveSkillBlock(block: PublicContentBlock): Promise<void> {
    if (!this.editModeService.isEnabled() || this.savingBlockId()) {
      return;
    }

    this.savingBlockId.set(block.id);
    this.editFeedback.set(null);
    this.editError.set(null);

    try {
      const response = await firstValueFrom(this.publicContentAdminService.updateContentBlock(block.id, this.toBlockPayload(block)));
      if (response?.data) {
        this.replaceContentBlock(response.data);
      }
      this.editFeedback.set(this.currentLanguage() === 'es' ? 'Bloque actualizado.' : 'Block updated.');
    } catch (error) {
      this.editError.set(this.resolveEditErrorMessage(error));
    } finally {
      this.savingBlockId.set(null);
    }
  }

  private async loadContentBlocks(includeDrafts = false): Promise<void> {
    try {
      const response = await firstValueFrom(
        includeDrafts ? this.publicContentAdminService.listContentBlocks() : this.publicContentService.listPublicContentBlocks(),
      );
      this.contentBlocks.set(response?.data ?? []);
    } catch {
      this.contentBlocks.set([]);
    }
  }

  private contentBlock(key: string): PublicContentBlock | null {
    const language = this.currentLanguage();
    return this.contentBlocks().find((block) => block.key === key && block.language === language) ?? null;
  }

  private hasSkillCmsBlocks(language: 'es' | 'en'): boolean {
    return this.contentBlocks().some((block) => block.language === language && block.key.startsWith('skill.'));
  }

  private focusWidth(skillCount: number): string {
    const maxSkillCount = Math.max(
      1,
      ...this.categories()
        .filter((category) => TECHNICAL_FOCUS_IDS.includes(category.id))
        .map((category) => category.skills.length),
    );
    const width = Math.round((skillCount / maxSkillCount) * 100);
    return `${Math.max(36, Math.min(100, width))}%`;
  }

  private updateBlock(id: string, updater: (block: PublicContentBlock) => PublicContentBlock): void {
    this.contentBlocks.update((blocks) => blocks.map((block) => (block.id === id ? updater(block) : block)));
  }

  private replaceContentBlock(updated: PublicContentBlock): void {
    this.contentBlocks.update((blocks) => blocks.map((block) => (block.id === updated.id ? updated : block)));
  }

  private toBlockPayload(block: PublicContentBlock): PublicContentBlockUpdatePayload {
    return {
      title: block.title.trim(),
      body: block.body.trim(),
      items: block.items.map((item) => item.trim()).filter((item) => item.length > 0),
      documentId: block.documentId,
      published: block.published,
      displayOrder: block.displayOrder,
    };
  }

  private resolveEditErrorMessage(error: unknown): string {
    if (error instanceof HttpErrorResponse && typeof error.error?.message === 'string' && error.error.message.trim()) {
      return error.error.message;
    }

    return this.currentLanguage() === 'es' ? 'No se pudo guardar el cambio.' : 'The change could not be saved.';
  }

  private localizeLevel(level: SkillLevelId, language: 'es' | 'en'): string {
    if (language === 'es') {
      switch (level) {
        case 'basic':
          return 'Básico';
        case 'intermediate':
          return 'Intermedio';
        default:
          return 'Avanzado';
      }
    }

    switch (level) {
      case 'basic':
        return 'Basic';
      case 'intermediate':
        return 'Intermediate';
      default:
        return 'Advanced';
    }
  }
}
