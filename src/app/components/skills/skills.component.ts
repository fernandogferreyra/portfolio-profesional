import { Component, computed, inject, signal } from '@angular/core';

import { PORTFOLIO_SKILLS, SKILL_CATEGORIES, SKILL_ICONS } from '../../data/portfolio.data';
import { SkillCategoryId, SkillIconId, localizeText } from '../../data/portfolio.models';
import { LanguageService } from '../../services/language.service';

type SkillsFilterId = 'all' | SkillCategoryId;

interface SkillView {
  id: string;
  icon: SkillIconId;
  name: string;
  description: string;
  categoryId: SkillCategoryId;
  categoryLabel: string;
  featured: boolean;
}

interface CategoryView {
  id: SkillCategoryId;
  label: string;
  description: string;
  skills: SkillView[];
}

@Component({
  selector: 'app-skills',
  standalone: false,
  templateUrl: './skills.component.html',
  styleUrl: './skills.component.scss',
})
export class SkillsComponent {
  private readonly languageService = inject(LanguageService);

  readonly currentLanguage = this.languageService.language;
  readonly activeFilter = signal<SkillsFilterId>('all');
  readonly skillIcons = SKILL_ICONS;
  readonly totalSkills = PORTFOLIO_SKILLS.length;
  readonly totalCategories = SKILL_CATEGORIES.length;
  readonly featuredCount = PORTFOLIO_SKILLS.filter((skill) => skill.featured).length;

  readonly ui = computed(() =>
    this.currentLanguage() === 'es'
      ? {
          eyebrow: 'Skills',
          title: 'Skills organizadas como un mapa tecnico claro y consistente.',
          intro:
            'Tecnologias principales y stack ampliado conviven en una sola experiencia ordenada por categorias, sin duplicar informacion.',
          overviewTitle: 'Mapa tecnico',
          overviewDescription:
            'Cada skill se presenta con icono, categoria y una descripcion tecnica concreta, manteniendo el lenguaje visual actual.',
          filtersAriaLabel: 'Filtrar skills por categoria',
          allLabel: 'Todas',
          skillStatLabel: 'skills mapeadas',
          categoryStatLabel: 'categorias visibles',
          featuredStatLabel: 'skills destacadas',
        }
      : {
          eyebrow: 'Skills',
          title: 'Skills organized as a clear and consistent technical map.',
          intro:
            'Core technologies and the extended stack live in one category-based experience without duplicating information.',
          overviewTitle: 'Technical map',
          overviewDescription:
            'Each skill is presented with an icon, category, and concrete technical description while preserving the current visual language.',
          filtersAriaLabel: 'Filter skills by category',
          allLabel: 'All',
          skillStatLabel: 'mapped skills',
          categoryStatLabel: 'visible categories',
          featuredStatLabel: 'featured skills',
        },
  );

  readonly categories = computed<CategoryView[]>(() => {
    const language = this.currentLanguage();

    return SKILL_CATEGORIES.map((category) => ({
      id: category.id,
      label: localizeText(category.label, language),
      description: localizeText(category.description, language),
      skills: PORTFOLIO_SKILLS.filter((skill) => skill.category === category.id).map((skill) => ({
        id: skill.id,
        icon: skill.icon,
        name: skill.name,
        description: localizeText(skill.description, language),
        categoryId: category.id,
        categoryLabel: localizeText(category.label, language),
        featured: Boolean(skill.featured),
      })),
    }));
  });

  readonly featuredSkills = computed(() =>
    this.categories()
      .flatMap((category) => category.skills)
      .filter((skill) => skill.featured),
  );

  readonly filterOptions = computed(() => [
    {
      id: 'all' as const,
      label: this.ui().allLabel,
    },
    ...this.categories().map((category) => ({
      id: category.id,
      label: category.label,
    })),
  ]);

  readonly visibleCategories = computed(() => {
    const activeFilter = this.activeFilter();
    return activeFilter === 'all'
      ? this.categories()
      : this.categories().filter((category) => category.id === activeFilter);
  });

  setFilter(filter: SkillsFilterId): void {
    this.activeFilter.set(filter);
  }

  isFilterActive(filter: SkillsFilterId): boolean {
    return this.activeFilter() === filter;
  }

  trackByCategoryId(_index: number, category: CategoryView): SkillCategoryId {
    return category.id;
  }

  trackBySkillId(_index: number, skill: SkillView): string {
    return skill.id;
  }
}
