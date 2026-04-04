import { Component, computed, inject, signal } from '@angular/core';

import { PORTFOLIO_SKILLS, SKILL_CATEGORIES, SKILL_ICONS } from '../../data/portfolio.data';
import { SkillCategoryId, SkillIconId, localizeText } from '../../data/portfolio.models';
import { LanguageService } from '../../services/language.service';
import { MotionService } from '../../services/motion.service';

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
  private readonly motionService = inject(MotionService);

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
          title: 'Stack tecnico organizado por areas de trabajo.',
          intro:
            'Tecnologias y herramientas utilizadas en backend, frontend, data y flujo de desarrollo.',
          overviewTitle: 'Stack profesional',
          overviewDescription:
            'Conjunto de tecnologias con las que trabajo en desarrollo fullstack, con foco principal en backend.',
          filtersAriaLabel: 'Filtrar skills por categoria',
          allLabel: 'Todas',
          skillStatLabel: 'tecnologias',
          categoryStatLabel: 'areas',
          featuredStatLabel: 'skills foco',
        }
      : {
          eyebrow: 'Skills',
          title: 'Technical stack organized by work area.',
          intro:
            'Technologies and tools used across backend, frontend, data, and the development workflow.',
          overviewTitle: 'Professional stack',
          overviewDescription:
            'Set of technologies I use in fullstack development, with a primary focus on backend work.',
          filtersAriaLabel: 'Filter skills by category',
          allLabel: 'All',
          skillStatLabel: 'technologies',
          categoryStatLabel: 'areas',
          featuredStatLabel: 'focus skills',
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
  readonly showFeaturedSkills = computed(() => this.activeFilter() === 'all');

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
    if (filter === this.activeFilter()) {
      return;
    }

    this.motionService.runWithViewTransition(() => {
      this.activeFilter.set(filter);
    });
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
