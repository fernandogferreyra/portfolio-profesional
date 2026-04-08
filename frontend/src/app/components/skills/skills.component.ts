import { Component, computed, inject } from '@angular/core';

import { PORTFOLIO_SKILLS, SKILL_CATEGORIES, SKILL_ICONS, SKILL_LEVELS } from '../../data/portfolio.data';
import {
  SkillCategoryId,
  SkillIconDefinition,
  SkillLevelId,
  localizeText,
} from '../../data/portfolio.models';
import { LanguageService } from '../../services/language.service';

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

const FOCUS_WIDTH: Record<SkillCategoryId, string> = {
  backend: '96%',
  frontend: '74%',
  data: '64%',
  tools: '82%',
  ai: '68%',
  soft: '0%',
};

@Component({
  selector: 'app-skills',
  standalone: false,
  templateUrl: './skills.component.html',
  styleUrl: './skills.component.scss',
})
export class SkillsComponent {
  private readonly languageService = inject(LanguageService);

  readonly currentLanguage = this.languageService.language;
  readonly laneCopies = [0, 1] as const;

  readonly ui = computed(() =>
    this.currentLanguage() === 'es'
      ? {
          eyebrow: 'Skills',
          title: 'Stack técnico organizado por áreas clave.',
          intro:
            'Tecnologías, herramientas y capacidades de trabajo organizadas en un flujo visual continuo, claro y profesional.',
          focusTitle: 'Enfoque técnico',
          lanesTitle: 'Stack por áreas',
          lanesDescription:
            'Cada fila reúne tecnologías o habilidades relacionadas dentro del mismo lenguaje visual, con movimiento suave y lectura rápida.',
        }
      : {
          eyebrow: 'Skills',
          title: 'Technical stack organized by core areas.',
          intro:
            'Technologies, tools, and working capabilities organized in a continuous, clear, and professional visual flow.',
          focusTitle: 'Technical focus',
          lanesTitle: 'Stack by area',
          lanesDescription:
            'Each lane groups related technologies or capabilities within the same visual language, with subtle motion and quick scanning.',
        },
  );

  readonly categories = computed<CategoryView[]>(() => {
    const language = this.currentLanguage();

    return SKILL_CATEGORIES.map((category) => ({
      id: category.id,
      label: localizeText(category.label, language),
      description: localizeText(category.description, language),
      skills: PORTFOLIO_SKILLS.filter((skill) => skill.category === category.id).map((skill) => {
        const level = SKILL_LEVELS[skill.id];

        return {
          id: skill.id,
          icon: SKILL_ICONS[skill.icon],
          name: skill.name,
          description: localizeText(skill.description, language),
          tags: (skill.tags ?? []).map((tag) => localizeText(tag, language)),
          level,
          levelLabel: level ? this.localizeLevel(level, language) : undefined,
          showLevel: skill.showLevel !== false && Boolean(level),
        };
      }),
    }));
  });

  readonly focusAreas = computed<FocusAreaView[]>(() =>
    this.categories()
      .filter((category) => TECHNICAL_FOCUS_IDS.includes(category.id))
      .map((category) => ({
        id: category.id,
        label: category.label,
        width: FOCUS_WIDTH[category.id],
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

  trackBySkillId(_index: number, skill: SkillView): string {
    return skill.id;
  }

  trackByLaneId(_index: number, lane: ShowcaseLaneView): string {
    return lane.id;
  }

  trackByFocusId(_index: number, item: FocusAreaView): SkillCategoryId {
    return item.id;
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
