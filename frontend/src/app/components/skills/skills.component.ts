import { HttpErrorResponse } from '@angular/common/http';
import { Component, computed, effect, inject, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';

import { SKILL_ICONS } from '../../data/portfolio.data';
import { SkillIconDefinition } from '../../data/portfolio.models';
import { SkillCategoryResponse, SkillItemResponse, SkillUpdatePayload } from '../../models/skills.models';
import { EditModeService } from '../../services/edit-mode.service';
import { LanguageService } from '../../services/language.service';
import { PublicContentBlock, PublicContentService } from '../../services/public-content.service';
import { SkillAdminService } from '../../services/skill-admin.service';
import { SkillService } from '../../services/skill.service';

type ShowcaseLaneDirection = 'left' | 'right';

interface SkillView extends SkillItemResponse {
  iconDefinition: SkillIconDefinition;
  levelLabel?: string;
}

interface CategoryView extends SkillCategoryResponse {
  skills: SkillView[];
}

interface FocusAreaView {
  id: string;
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

const LANE_DURATIONS = ['78s', '72s', '74s', '84s', '76s', '88s', '82s'];

@Component({
  selector: 'app-skills',
  standalone: false,
  templateUrl: './skills.component.html',
  styleUrl: './skills.component.scss',
})
export class SkillsComponent {
  private readonly languageService = inject(LanguageService);
  private readonly publicContentService = inject(PublicContentService);
  private readonly skillService = inject(SkillService);
  private readonly skillAdminService = inject(SkillAdminService);

  readonly editModeService = inject(EditModeService);
  readonly currentLanguage = this.languageService.language;
  readonly laneCopies = [0, 1] as const;
  readonly showAllSkills = signal(false);
  readonly contentBlocks = signal<PublicContentBlock[]>([]);
  readonly skillCatalog = signal<SkillCategoryResponse[]>([]);
  readonly savingSkillId = signal<string | null>(null);
  readonly savingCategoryId = signal<string | null>(null);
  readonly selectedSkillId = signal<string | null>(null);
  readonly selectedCategoryId = signal<string | null>(null);
  readonly editFeedback = signal<string | null>(null);
  readonly editError = signal<string | null>(null);
  readonly iconOptions = Object.keys(SKILL_ICONS).sort();

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
          editModeLabel: 'EditMode Skills',
          editBodyLabel: 'Descripcion',
          editAddItemLabel: 'Agregar detalle',
          editRemoveLabel: 'Quitar',
          editSavingLabel: 'Guardando...',
          editDraftLabel: 'Oculta',
          editActionLabel: 'Editar',
          newSkillLabel: 'Nueva skill',
          newCategoryLabel: 'Nueva categoria',
          editCategoryLabel: 'Editar categoria',
          deleteCategoryLabel: 'Eliminar categoria',
          slugLabel: 'Slug',
          nameLabel: 'Nombre',
          categoryLabel: 'Categoria',
          iconLabel: 'Icono',
          levelLabel: 'Nivel',
          tagsLabel: 'Tags',
          showLevelLabel: 'Mostrar nivel',
          publishedLabel: 'Publicado',
          orderLabel: 'Orden',
          basicLabel: 'Basico',
          intermediateLabel: 'Intermedio',
          advancedLabel: 'Avanzado',
          saveSkillLabel: 'Guardar skill',
          saveCategoryLabel: 'Guardar categoria',
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
          editModeLabel: 'Skills EditMode',
          editBodyLabel: 'Description',
          editAddItemLabel: 'Add detail',
          editRemoveLabel: 'Remove',
          editSavingLabel: 'Saving...',
          editDraftLabel: 'Hidden',
          editActionLabel: 'Edit',
          newSkillLabel: 'New skill',
          newCategoryLabel: 'New category',
          editCategoryLabel: 'Edit category',
          deleteCategoryLabel: 'Delete category',
          slugLabel: 'Slug',
          nameLabel: 'Name',
          categoryLabel: 'Category',
          iconLabel: 'Icon',
          levelLabel: 'Level',
          tagsLabel: 'Tags',
          showLevelLabel: 'Show level',
          publishedLabel: 'Published',
          orderLabel: 'Order',
          basicLabel: 'Basic',
          intermediateLabel: 'Intermediate',
          advancedLabel: 'Advanced',
          saveSkillLabel: 'Save skill',
          saveCategoryLabel: 'Save category',
        },
  );

  readonly categories = computed<CategoryView[]>(() =>
    this.skillCatalog().map((category) => ({
      ...category,
      skills: category.skills.map((skill) => this.toSkillView(skill)),
    })),
  );

  readonly focusAreas = computed<FocusAreaView[]>(() =>
    this.categories()
      .filter((category) => category.skills.some((skill) => skill.published || this.editModeService.isEnabled()))
      .map((category) => ({
        id: category.id,
        label: category.label,
        width: this.focusWidth(category.skills.length),
      })),
  );

  readonly showcaseLanes = computed<ShowcaseLaneView[]>(() =>
    this.categories()
      .filter((category) => category.skills.length > 0 || this.editModeService.isEnabled())
      .map((category, index) => ({
        id: `lane-${category.id}`,
        label: category.label,
        direction: index % 2 === 0 ? 'left' : 'right',
        duration: LANE_DURATIONS[index % LANE_DURATIONS.length],
        skills: category.skills,
      })),
  );

  readonly categoryOptions = computed(() => this.categories().map((category) => ({ id: category.id, label: category.label })));

  constructor() {
    effect(() => {
      const editModeEnabled = this.editModeService.isEnabled();
      const language = this.currentLanguage();
      if (editModeEnabled) {
        this.showAllSkills.set(true);
      }
      void this.loadContentBlocks();
      void this.loadSkillCatalog(language, editModeEnabled);
    });
  }

  trackBySkillId(_index: number, skill: SkillView): string {
    return skill.id;
  }

  trackByLaneId(_index: number, lane: ShowcaseLaneView): string {
    return lane.id;
  }

  trackByFocusId(_index: number, item: FocusAreaView): string {
    return item.id;
  }

  trackByCategoryId(_index: number, item: CategoryView): string {
    return item.id;
  }

  trackByIcon(_index: number, icon: string): string {
    return icon;
  }

  toggleSkillPresentation(): void {
    this.showAllSkills.update((current) => !current);
  }

  selectSkill(skillId: string): void {
    this.selectedSkillId.set(this.selectedSkillId() === skillId ? null : skillId);
  }

  selectCategory(categoryId: string): void {
    this.selectedCategoryId.set(this.selectedCategoryId() === categoryId ? null : categoryId);
  }

  updateSkillField(id: string, field: keyof SkillUpdatePayload, value: string | boolean | number | null): void {
    this.skillCatalog.update((categories) =>
      categories.map((category) => ({
        ...category,
        skills: category.skills.map((skill) => (skill.id === id ? { ...skill, [field]: value } : skill)),
      })),
    );
  }

  updateSkillTag(id: string, index: number, value: string): void {
    this.updateSkill(id, (skill) => {
      const tags = [...skill.tags];
      tags[index] = value;
      return { ...skill, tags };
    });
  }

  addSkillTag(id: string): void {
    this.updateSkill(id, (skill) => ({ ...skill, tags: [...skill.tags, this.currentLanguage() === 'es' ? 'Nuevo tag' : 'New tag'] }));
  }

  removeSkillTag(id: string, index: number): void {
    this.updateSkill(id, (skill) => ({ ...skill, tags: skill.tags.filter((_, tagIndex) => tagIndex !== index) }));
  }

  updateCategoryField(id: string, field: 'slug' | 'label' | 'description' | 'published' | 'displayOrder', value: string | boolean | number): void {
    this.skillCatalog.update((categories) => categories.map((category) => (category.id === id ? { ...category, [field]: value } : category)));
  }

  async createSkill(): Promise<void> {
    if (!this.editModeService.isEnabled() || this.savingSkillId()) {
      return;
    }

    this.savingSkillId.set('new');
    this.showAllSkills.set(true);
    this.resetFeedback();

    try {
      const response = await firstValueFrom(
        this.skillAdminService.createSkill({
          language: this.currentLanguage(),
          slug: '',
          name: this.currentLanguage() === 'es' ? 'Nueva skill' : 'New skill',
          description: '',
          categoryId: this.categoryOptions()[0]?.id ?? null,
          icon: 'frontend',
          level: 'basic',
          tags: [],
          showLevel: true,
          published: false,
          displayOrder: this.nextSkillOrder(),
        }),
      );
      await this.loadSkillCatalog(this.currentLanguage(), true);
      this.selectedSkillId.set(response.data.id);
      this.editFeedback.set(this.currentLanguage() === 'es' ? 'Skill creada como borrador.' : 'Skill created as draft.');
    } catch (error) {
      this.editError.set(this.resolveEditErrorMessage(error));
    } finally {
      this.savingSkillId.set(null);
    }
  }

  async saveSkill(skill: SkillView): Promise<void> {
    if (!this.editModeService.isEnabled() || this.savingSkillId()) {
      return;
    }

    this.savingSkillId.set(skill.id);
    this.resetFeedback();

    try {
      await firstValueFrom(this.skillAdminService.updateSkill(skill.id, this.toSkillPayload(skill)));
      await this.loadSkillCatalog(this.currentLanguage(), true);
      this.editFeedback.set(this.currentLanguage() === 'es' ? 'Skill actualizada.' : 'Skill updated.');
    } catch (error) {
      this.editError.set(this.resolveEditErrorMessage(error));
    } finally {
      this.savingSkillId.set(null);
    }
  }

  async createCategory(): Promise<void> {
    if (!this.editModeService.isEnabled() || this.savingCategoryId()) {
      return;
    }

    const pendingCategory = this.categories().find((category) => this.isPendingNewCategory(category));
    if (pendingCategory) {
      this.showAllSkills.set(true);
      this.selectedCategoryId.set(pendingCategory.id);
      this.editFeedback.set(this.currentLanguage() === 'es' ? 'Completa la categoria pendiente.' : 'Complete the pending category.');
      return;
    }

    this.savingCategoryId.set('new');
    this.showAllSkills.set(true);
    this.resetFeedback();

    try {
      const response = await firstValueFrom(
        this.skillAdminService.createCategory({
          language: this.currentLanguage(),
          slug: '',
          label: this.currentLanguage() === 'es' ? 'Nueva categoria' : 'New category',
          description: '',
          published: true,
          displayOrder: this.nextCategoryOrder(),
        }),
      );
      await this.loadSkillCatalog(this.currentLanguage(), true);
      this.selectedCategoryId.set(response.data.id);
      this.editFeedback.set(this.currentLanguage() === 'es' ? 'Categoria creada.' : 'Category created.');
    } catch (error) {
      this.editError.set(this.resolveEditErrorMessage(error));
    } finally {
      this.savingCategoryId.set(null);
    }
  }

  async saveCategory(category: CategoryView): Promise<void> {
    if (!this.editModeService.isEnabled() || this.savingCategoryId()) {
      return;
    }

    this.savingCategoryId.set(category.id);
    this.resetFeedback();

    try {
      await firstValueFrom(
        this.skillAdminService.updateCategory(category.id, {
          slug: category.slug,
          label: category.label,
          description: category.description,
          published: category.published,
          displayOrder: category.displayOrder,
        }),
      );
      await this.loadSkillCatalog(this.currentLanguage(), true);
      this.editFeedback.set(this.currentLanguage() === 'es' ? 'Categoria actualizada.' : 'Category updated.');
    } catch (error) {
      this.editError.set(this.resolveEditErrorMessage(error));
    } finally {
      this.savingCategoryId.set(null);
    }
  }

  async deleteCategory(category: CategoryView): Promise<void> {
    if (!this.editModeService.isEnabled() || this.savingCategoryId()) {
      return;
    }

    const confirmed = window.confirm(
      this.currentLanguage() === 'es'
        ? `Eliminar categoria "${category.label}"? Las skills pasaran a Otras.`
        : `Delete category "${category.label}"? Skills will move to Other.`,
    );
    if (!confirmed) {
      return;
    }

    this.savingCategoryId.set(category.id);
    this.resetFeedback();

    try {
      await firstValueFrom(this.skillAdminService.deleteCategory(category.id));
      await this.loadSkillCatalog(this.currentLanguage(), true);
      this.selectedCategoryId.set(null);
      this.editFeedback.set(this.currentLanguage() === 'es' ? 'Categoria eliminada.' : 'Category deleted.');
    } catch (error) {
      this.editError.set(this.resolveEditErrorMessage(error));
    } finally {
      this.savingCategoryId.set(null);
    }
  }

  private async loadContentBlocks(): Promise<void> {
    try {
      const response = await firstValueFrom(this.publicContentService.listPublicContentBlocks());
      this.contentBlocks.set(response?.data ?? []);
    } catch {
      this.contentBlocks.set([]);
    }
  }

  private async loadSkillCatalog(language: string, includeDrafts = false): Promise<void> {
    try {
      const response = await firstValueFrom(
        includeDrafts ? this.skillAdminService.listSkills(language) : this.skillService.listSkills(language),
      );
      this.skillCatalog.set(response?.data ?? []);
    } catch {
      this.skillCatalog.set([]);
    }
  }

  private contentBlock(key: string): PublicContentBlock | null {
    const language = this.currentLanguage();
    return this.contentBlocks().find((block) => block.key === key && block.language === language) ?? null;
  }

  private focusWidth(skillCount: number): string {
    const maxSkillCount = Math.max(1, ...this.categories().map((category) => category.skills.length));
    const width = Math.round((skillCount / maxSkillCount) * 100);
    return `${Math.max(36, Math.min(100, width))}%`;
  }

  private updateSkill(id: string, updater: (skill: SkillItemResponse) => SkillItemResponse): void {
    this.skillCatalog.update((categories) =>
      categories.map((category) => ({
        ...category,
        skills: category.skills.map((skill) => (skill.id === id ? updater(skill) : skill)),
      })),
    );
  }

  private toSkillPayload(skill: SkillView): SkillUpdatePayload {
    return {
      slug: skill.slug,
      name: skill.name.trim(),
      description: skill.description.trim(),
      categoryId: skill.categoryId,
      icon: skill.icon,
      level: skill.level,
      tags: skill.tags.map((tag) => tag.trim()).filter((tag) => tag.length > 0),
      showLevel: skill.showLevel,
      published: skill.published,
      displayOrder: Number(skill.displayOrder) || 0,
    };
  }

  private toSkillView(skill: SkillItemResponse): SkillView {
    const icon = SKILL_ICONS[skill.icon as keyof typeof SKILL_ICONS] ?? SKILL_ICONS.frontend;
    return {
      ...skill,
      iconDefinition: icon,
      levelLabel: this.localizeLevel(skill.level),
    };
  }

  private resetFeedback(): void {
    this.editFeedback.set(null);
    this.editError.set(null);
  }

  private nextSkillOrder(): number {
    return Math.max(0, ...this.categories().flatMap((category) => category.skills.map((skill) => skill.displayOrder))) + 10;
  }

  private nextCategoryOrder(): number {
    return Math.max(0, ...this.categories().map((category) => category.displayOrder)) + 10;
  }

  private isPendingNewCategory(category: CategoryView): boolean {
    const label = category.label.trim().toLowerCase();
    return category.skills.length === 0 && (label === 'nueva categoria' || label === 'new category');
  }

  private resolveEditErrorMessage(error: unknown): string {
    if (error instanceof HttpErrorResponse && typeof error.error?.message === 'string' && error.error.message.trim()) {
      return error.error.message;
    }

    return this.currentLanguage() === 'es' ? 'No se pudo guardar el cambio.' : 'The change could not be saved.';
  }

  private localizeLevel(level: string): string {
    if (this.currentLanguage() === 'es') {
      switch (level) {
        case 'basic':
          return 'Basico';
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
