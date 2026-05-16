import { HttpErrorResponse } from '@angular/common/http';
import { Component, computed, effect, inject, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';

import { SkillCategoryResponse } from '../../models/skills.models';
import { DocumentAdminService } from '../../services/document-admin.service';
import { EditModeService } from '../../services/edit-mode.service';
import { LanguageService } from '../../services/language.service';
import { MotionService } from '../../services/motion.service';
import { ProfilePhotoService } from '../../services/profile-photo.service';
import {
  PublicContentBlock,
  PublicContentBlockCreatePayload,
  PublicContentBlockUpdatePayload,
  PublicContentService,
} from '../../services/public-content.service';
import { PublicContentAdminService } from '../../services/public-content-admin.service';
import { SkillService } from '../../services/skill.service';

type TechnicalBaseCategoryId = string;

interface TechnicalBaseCategory {
  id: TechnicalBaseCategoryId;
  key: string;
  label: string;
  description: string;
  items: string[];
  block: PublicContentBlock | null;
}

interface WorkArea {
  label: string;
  level: number;
  description: string;
}

@Component({
  selector: 'app-home',
  standalone: false,
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  private readonly languageService = inject(LanguageService);
  private readonly documentAdminService = inject(DocumentAdminService);
  private readonly motionService = inject(MotionService);
  private readonly profilePhotoService = inject(ProfilePhotoService);
  private readonly publicContentService = inject(PublicContentService);
  private readonly publicContentAdminService = inject(PublicContentAdminService);
  private readonly skillService = inject(SkillService);

  readonly editModeService = inject(EditModeService);
  readonly currentLanguage = this.languageService.language;
  readonly activeBaseCategoryId = signal<TechnicalBaseCategoryId>('electronics');
  readonly profileImageUrl = this.profilePhotoService.profilePhotoUrl;
  readonly failedProfileImageUrl = signal<string | null>(null);
  readonly profileImageAvailable = computed(() => this.failedProfileImageUrl() !== this.profileImageUrl());
  readonly contentBlocks = signal<PublicContentBlock[]>([]);
  readonly skillCatalog = signal<SkillCategoryResponse[]>([]);
  readonly savingBlockId = signal<string | null>(null);
  readonly uploadingProfilePhoto = signal(false);
  readonly editFeedback = signal<string | null>(null);
  readonly editError = signal<string | null>(null);
  readonly heroBlock = computed(() => this.contentBlock('home.hero'));
  readonly aboutBlock = computed(() => this.contentBlock('home.about'));
  readonly profilePhotoBlocks = computed(() => this.contentBlocks().filter((block) => block.key === 'site.profile-photo'));
  readonly editLabels = computed(() =>
    this.currentLanguage() === 'es'
      ? {
          mode: 'EditMode Inicio',
          titleLabel: 'Titulo',
          bodyLabel: 'Cuerpo',
          itemLabel: 'Detalle',
          newItemLabel: 'Nuevo detalle',
          addItemLabel: 'Agregar detalle',
          removeItemLabel: 'Quitar',
          saveLabel: 'Guardar bloque',
          savingLabel: 'Guardando...',
          uploadProfilePhotoLabel: 'Actualizar foto',
          uploadingProfilePhotoLabel: 'Subiendo foto...',
          profilePhotoSavedLabel: 'Foto actualizada.',
          addTechnicalLabel: 'Nueva experiencia tecnica',
        }
      : {
          mode: 'Home EditMode',
          titleLabel: 'Title',
          bodyLabel: 'Body',
          itemLabel: 'Detail',
          newItemLabel: 'New detail',
          addItemLabel: 'Add detail',
          removeItemLabel: 'Remove',
          saveLabel: 'Save block',
          savingLabel: 'Saving...',
          uploadProfilePhotoLabel: 'Update photo',
          uploadingProfilePhotoLabel: 'Uploading photo...',
          profilePhotoSavedLabel: 'Photo updated.',
          addTechnicalLabel: 'New technical experience',
        },
  );

  readonly ui = computed(() =>
    this.currentLanguage() === 'es'
      ? {
          eyebrow: 'Fernando G. Ferreyra',
          title: this.contentBlock('home.hero')?.title ?? 'Fullstack Developer',
          subtitle: this.contentBlock('home.hero')?.items?.[1] ?? 'Backend-focused | Java \u00B7 Spring Boot \u00B7 .NET \u00B7 APIs',
          lead:
            this.contentBlock('home.hero')?.body ??
            'Desarrollo aplicaciones de punta a punta, con especial foco en backend, arquitectura y diseño de APIs escalables.',
        }
      : {
          eyebrow: 'Fernando G. Ferreyra',
          title: this.contentBlock('home.hero')?.title ?? 'Fullstack Developer',
          subtitle: this.contentBlock('home.hero')?.items?.[1] ?? 'Backend-focused | Java \u00B7 Spring Boot \u00B7 .NET \u00B7 APIs',
          lead:
            this.contentBlock('home.hero')?.body ??
            'I build end-to-end applications with a strong focus on backend development, architecture, and scalable API design.',
        },
  );

  readonly profile = computed(() =>
    this.currentLanguage() === 'es'
      ? {
          alt: 'Foto personal de Fernando G. Ferreyra',
          fallbackLabel: 'FGF',
        }
      : {
          alt: 'Portrait of Fernando G. Ferreyra',
          fallbackLabel: 'FGF',
        },
  );

  readonly about = computed(() =>
    this.currentLanguage() === 'es'
      ? {
          eyebrow: 'Sobre mí',
          title: this.contentBlock('home.about')?.title ?? 'Recorrido y perfil actual',
          lead:
            this.contentBlock('home.about')?.body ??
            'Más de 15 años de experiencia técnica en electrónica e informática me dieron una base práctica para diagnosticar fallas, reparar equipos y resolver problemas complejos. Esa trayectoria hoy se complementa con mi formación como desarrollador y un perfil orientado al desarrollo fullstack.',
          paragraphs: this.blockItems(this.contentBlock('home.about'), [
            'Durante más de una década trabajé de forma hands-on en electrónica e informática, interviniendo equipos, analizando fallas y resolviendo problemas reales en hardware, audio, video y entornos de PC.',
            'Con el tiempo trasladé esa experiencia al software, completé la Tecnicatura Universitaria en Programación en UTN FRC y comencé a desarrollar aplicaciones web con frontend, backend, APIs y bases de datos.',
            'Hoy consolido un perfil técnico integral: combino criterio de diagnóstico, trabajo práctico y una formación reciente en desarrollo para aportar en proyectos con una mirada completa del problema.',
          ]),
        }
      : {
          eyebrow: 'About',
          title: this.contentBlock('home.about')?.title ?? 'Background and current profile',
          lead:
            this.contentBlock('home.about')?.body ??
            'More than 15 years of technical experience in electronics and IT gave me a practical foundation to diagnose failures, repair equipment, and solve complex problems. Today that path is complemented by my software training and a profile oriented toward fullstack development.',
          paragraphs: this.blockItems(this.contentBlock('home.about'), [
            'For more than a decade I worked hands-on in electronics and IT, intervening equipment, analyzing failures, and solving real problems across hardware, audio, video, and PC environments.',
            'Over time I brought that experience into software, completed the University Programming Technician degree at UTN FRC, and started building web applications across frontend, backend, APIs, and databases.',
            'Today I am consolidating a well-rounded technical profile: I combine diagnostic judgment, practical execution, and recent software training to contribute to projects with a complete view of the problem.',
          ]),
        },
  );

  readonly technicalBase = computed(() =>
    this.currentLanguage() === 'es'
      ? {
          eyebrow: 'Recorrido técnico',
          title: 'Experiencia técnica',
          description: '',
          ariaLabel: 'Categorías de experiencia técnica',
          categories: this.technicalCategories([
            {
              id: 'electronics',
              key: 'home.technical.electronics',
              label: 'Electrónica',
              description:
                'Experiencia práctica en audio y video, hardware de videojuegos, consolas, PC, monitores y arcades, con trabajo directo en diagnóstico, reparación y programación de memorias.',
              items: [
                'Audio y video',
                'Consolas y hardware de videojuegos',
                'PC, notebooks y periféricos',
                'Monitores y arcades',
                'Programación de memorias',
              ],
            },
            {
              id: 'it',
              key: 'home.technical.it',
              label: 'Informática',
              description: 'Soporte técnico, instalación, mantenimiento y puesta a punto de equipos y entornos de trabajo, con criterio para resolver fallas de hardware, software y conectividad.',
              items: [
                'Instalación y configuración',
                'Sistemas operativos',
                'Mantenimiento preventivo',
                'Redes y conectividad',
                'Soporte técnico',
              ],
            },
            {
              id: 'development',
              key: 'home.technical.development',
              label: 'Desarrollo',
              description: 'Desarrollo de aplicaciones web fullstack, trabajando tanto en frontend como en backend, con experiencia en APIs, bases de datos y buenas prácticas de desarrollo. Actualmente en etapa de consolidación profesional, ampliando experiencia en proyectos reales.',
              items: [
                'Frontend + Backend',
                'APIs',
                'Bases de datos',
                'Buenas prácticas',
                'Aprendizaje continuo',
              ],
            },
          ]),
        }
      : {
          eyebrow: 'Technical background',
          title: 'Technical experience',
          description: '',
          ariaLabel: 'Technical experience categories',
          categories: this.technicalCategories([
            {
              id: 'electronics',
              key: 'home.technical.electronics',
              label: 'Electronics',
              description: 'Hands-on experience in audio and video equipment, gaming hardware, consoles, PCs, monitors, and arcade systems, including diagnostics, repair, and memory programming.',
              items: [
                'Audio and video',
                'Consoles and gaming hardware',
                'PCs, laptops, and peripherals',
                'Monitors and arcades',
                'Memory programming',
              ],
            },
            {
              id: 'it',
              key: 'home.technical.it',
              label: 'IT',
              description: 'Technical support, installation, maintenance, and workstation setup with a practical approach to hardware, software, and connectivity issues.',
              items: [
                'Installation and setup',
                'Operating systems',
                'Preventive maintenance',
                'Networking and connectivity',
                'Technical support',
              ],
            },
            {
              id: 'development',
              key: 'home.technical.development',
              label: 'Development',
              description: 'Fullstack web application development across frontend and backend, with experience in APIs, databases, and development practices while building real-project experience.',
              items: [
                'Frontend + Backend',
                'APIs',
                'Databases',
                'Best practices',
                'Continuous learning',
              ],
            },
          ]),
        },
  );

  readonly workAreasSection = computed(() =>
    this.currentLanguage() === 'es'
      ? {
          eyebrow: 'Perfil técnico',
          title: 'Stack y enfoque',
          description:
            'Distribución estimada de mi stack actual y de las áreas donde hoy aporto más valor dentro del desarrollo de software.',
        }
      : {
          eyebrow: 'Technical profile',
          title: 'Stack and focus',
          description:
            'Estimated view of my current stack and the areas where I currently bring the most value in software development.',
        },
  );

  readonly workAreas = computed<WorkArea[]>(() => this.skillDerivedWorkAreas());

  readonly activeBaseCategory = computed(() => {
    const selectedCategoryId = this.activeBaseCategoryId();
    return (
      this.technicalBase().categories.find((category) => category.id === selectedCategoryId) ??
      this.technicalBase().categories[0]
    );
  });

  constructor() {
    effect(() => {
      const editModeEnabled = this.editModeService.isEnabled();
      const language = this.currentLanguage();
      void this.loadContentBlocks(editModeEnabled);
      void this.loadSkillCatalog(language);
    });
  }

  setBaseCategory(categoryId: TechnicalBaseCategoryId): void {
    if (categoryId === this.activeBaseCategoryId()) {
      return;
    }

    this.motionService.runWithViewTransition(() => {
      this.activeBaseCategoryId.set(categoryId);
    });
  }

  isBaseCategoryActive(categoryId: TechnicalBaseCategoryId): boolean {
    return this.activeBaseCategoryId() === categoryId;
  }

  onProfileImageError(): void {
    this.failedProfileImageUrl.set(this.profileImageUrl());
  }

  async onProfilePhotoSelected(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement | null;
    const file = input?.files?.item(0) ?? null;
    const photoBlocks = this.profilePhotoBlocks();
    if (!file || !this.editModeService.isEnabled() || this.uploadingProfilePhoto() || photoBlocks.length === 0) {
      return;
    }

    this.uploadingProfilePhoto.set(true);
    this.editFeedback.set(null);
    this.editError.set(null);

    try {
      const uploadResponse = await firstValueFrom(this.documentAdminService.uploadDocument(file, 'profile-photo'));

      for (const block of photoBlocks) {
        const response = await firstValueFrom(
          this.publicContentAdminService.updateContentBlock(block.id, {
            ...this.toBlockPayload(block),
            documentId: uploadResponse.data.id,
          }),
        );

        if (response?.data) {
          this.replaceContentBlock(response.data);
        }
      }

      this.profilePhotoService.setDocumentUrl(this.profilePhotoBlockUrl());
      this.editFeedback.set(this.editLabels().profilePhotoSavedLabel);
    } catch (error) {
      this.editError.set(this.resolveEditErrorMessage(error));
    } finally {
      this.uploadingProfilePhoto.set(false);
      if (input) {
        input.value = '';
      }
    }
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

  addBlockItem(id: string): void {
    this.updateBlock(id, (block) => ({ ...block, items: [...block.items, this.editLabels().newItemLabel] }));
  }

  removeBlockItem(id: string, index: number): void {
    this.updateBlock(id, (block) => ({ ...block, items: block.items.filter((_, itemIndex) => itemIndex !== index) }));
  }

  async createTechnicalBlock(): Promise<void> {
    if (!this.editModeService.isEnabled() || this.savingBlockId()) {
      return;
    }

    this.savingBlockId.set('new-technical');
    this.editFeedback.set(null);
    this.editError.set(null);

    const timestamp = Date.now();
    const language = this.currentLanguage();
    const payload: PublicContentBlockCreatePayload = {
      key: `home.technical.custom-${timestamp}`,
      language,
      title: language === 'es' ? 'Nueva experiencia' : 'New experience',
      body: language === 'es' ? 'Describe la experiencia tecnica.' : 'Describe the technical experience.',
      items: [language === 'es' ? 'Nuevo detalle' : 'New detail'],
      documentId: null,
      published: true,
      displayOrder: this.nextTechnicalDisplayOrder(),
    };

    try {
      const response = await firstValueFrom(this.publicContentAdminService.createContentBlock(payload));
      if (response?.data) {
        this.contentBlocks.update((blocks) => [...blocks, response.data]);
        this.activeBaseCategoryId.set(this.technicalIdFromKey(response.data.key));
      }
      this.editFeedback.set(language === 'es' ? 'Experiencia creada.' : 'Experience created.');
    } catch (error) {
      this.editError.set(this.resolveEditErrorMessage(error));
    } finally {
      this.savingBlockId.set(null);
    }
  }

  async saveHomeBlock(block: PublicContentBlock): Promise<void> {
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
      const blocks = response?.data ?? [];
      this.contentBlocks.set(blocks);
      this.profilePhotoService.setFromBlocks(blocks, this.currentLanguage());
    } catch {
      this.contentBlocks.set([]);
      this.profilePhotoService.setFromBlocks([], this.currentLanguage());
    }
  }

  private async loadSkillCatalog(language: string): Promise<void> {
    try {
      const response = await firstValueFrom(this.skillService.listSkills(language));
      this.skillCatalog.set(response?.data ?? []);
    } catch {
      this.skillCatalog.set([]);
    }
  }

  private contentBlock(key: string): PublicContentBlock | null {
    const language = this.currentLanguage();
    return this.contentBlocks().find((block) => block.key === key && block.language === language) ?? null;
  }

  private profilePhotoBlockUrl(): string | null {
    const language = this.currentLanguage();
    return (
      this.contentBlocks().find((block) => block.key === 'site.profile-photo' && block.language === language)?.documentUrl ??
      this.contentBlocks().find((block) => block.key === 'site.profile-photo' && block.documentUrl)?.documentUrl ??
      null
    );
  }

  private blockItems(block: PublicContentBlock | null, fallback: string[]): string[] {
    return block?.items?.length ? block.items : fallback;
  }

  private technicalCategories(fallbacks: Omit<TechnicalBaseCategory, 'block'>[]): TechnicalBaseCategory[] {
    const language = this.currentLanguage();
    const fallbackKeys = new Set(fallbacks.map((category) => category.key));
    const fallbackCategories = fallbacks.map((category) => {
      const block = this.contentBlocks().find((candidate) => candidate.key === category.key && candidate.language === language) ?? null;
      return {
        ...category,
        label: block?.title ?? category.label,
        description: block?.body ?? category.description,
        items: block?.items?.length ? block.items : category.items,
        block,
      };
    });
    const customCategories = this.contentBlocks()
      .filter((block) => block.language === language && block.key.startsWith('home.technical.') && !fallbackKeys.has(block.key))
      .sort((left, right) => left.displayOrder - right.displayOrder || left.title.localeCompare(right.title))
      .map((block) => ({
        id: this.technicalIdFromKey(block.key),
        key: block.key,
        label: block.title,
        description: block.body,
        items: block.items,
        block,
      }));

    return [...fallbackCategories, ...customCategories];
  }

  private skillDerivedWorkAreas(): WorkArea[] {
    return this.skillCatalog()
      .filter((category) => category.skills.length > 0)
      .map((category, index) => ({
        label: category.label,
        level: this.skillCategoryLevel(index, category.skills.length),
        description: category.skills
          .slice(0, 4)
          .map((skill) => skill.name)
          .join(' · '),
      }));
  }

  private skillCategoryLevel(index: number, skillCount: number): number {
    const baseLevel = Math.max(56, 88 - index * 6);
    return Math.min(96, Math.max(48, baseLevel + Math.min(skillCount, 4)));
  }

  private technicalIdFromKey(key: string): string {
    return key.replace('home.technical.', '');
  }

  private nextTechnicalDisplayOrder(): number {
    const language = this.currentLanguage();
    const lastOrder = this.contentBlocks()
      .filter((block) => block.language === language && block.key.startsWith('home.technical.'))
      .reduce((max, block) => Math.max(max, block.displayOrder), 220);
    return Math.min(999, lastOrder + 1);
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
}
