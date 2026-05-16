import { NO_ERRORS_SCHEMA, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { DocumentAdminService } from '../../services/document-admin.service';
import { EditModeService } from '../../services/edit-mode.service';
import { PublicContentAdminService } from '../../services/public-content-admin.service';
import { PublicContentBlock, PublicContentService } from '../../services/public-content.service';
import { SkillAdminService } from '../../services/skill-admin.service';
import { SkillService } from '../../services/skill.service';
import { SkillsComponent } from './skills.component';

describe('SkillsComponent', () => {
  let component: SkillsComponent;
  let fixture: ComponentFixture<SkillsComponent>;
  const editModeEnabled = signal(false);

  beforeEach(async () => {
    editModeEnabled.set(false);

    await TestBed.configureTestingModule({
      declarations: [SkillsComponent],
      providers: [
        {
          provide: EditModeService,
          useValue: {
            isEnabled: editModeEnabled,
          },
        },
        {
          provide: PublicContentService,
          useValue: {
            listPublicContentBlocks: () => of({ data: [] }),
          },
        },
        {
          provide: PublicContentAdminService,
          useValue: {
            listContentBlocks: () => of({ data: [] }),
            updateContentBlock: (_id: string, payload: unknown) => of({ data: payload }),
          },
        },
        {
          provide: DocumentAdminService,
          useValue: {
            uploadDocument: () => of({ data: { id: 'document-id' } }),
          },
        },
        {
          provide: SkillService,
          useValue: {
            listSkills: () => of({ data: skillCatalog() }),
          },
        },
        {
          provide: SkillAdminService,
          useValue: {
            listSkills: () => of({ data: skillCatalog() }),
            createSkill: () => of({ data: skillCatalog()[0].skills[0] }),
            updateSkill: (_id: string, payload: unknown) => of({ data: payload }),
            deleteSkill: () => of({ data: null }),
            createCategory: () => of({ data: skillCatalog()[0] }),
            updateCategory: (_id: string, payload: unknown) => of({ data: payload }),
            deleteCategory: () => of({ data: null }),
          },
        },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(SkillsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('uses backend skill catalog as source of truth', () => {
    component.skillCatalog.set(skillCatalog());

    const skills = component.categories().flatMap((category) => category.skills);

    expect(skills.map((skill) => skill.name)).toContain('Java');
    expect(skills.find((skill) => skill.slug === 'java')?.description).toBe('Backend real');
  });

  it('includes soft skills in technical focus when published by backend', () => {
    component.skillCatalog.set(skillCatalog());

    const focusLabels = component.focusAreas().map((area) => area.label);

    expect(focusLabels).toContain('Backend');
    expect(focusLabels).toContain('Soft skills');
  });

  function skillCatalog() {
    return [
      {
        id: 'backend-category',
        language: 'es',
        slug: 'backend',
        label: 'Backend',
        description: 'Servicios',
        published: true,
        displayOrder: 10,
        skills: [
          {
            id: 'java-id',
            language: 'es',
            slug: 'java',
            name: 'Java',
            description: 'Backend real',
            categoryId: 'backend-category',
            categorySlug: 'backend',
            icon: 'java',
            iconDocumentId: null,
            iconUrl: null,
            accentColor: '#f89820',
            level: 'advanced',
            tags: ['Spring'],
            showLevel: true,
            published: true,
            displayOrder: 10,
          },
        ],
      },
      {
        id: 'soft-category',
        language: 'es',
        slug: 'soft',
        label: 'Soft skills',
        description: 'Colaboracion',
        published: true,
        displayOrder: 20,
        skills: [
          {
            id: 'teamwork-id',
            language: 'es',
            slug: 'teamwork',
            name: 'Trabajo en equipo',
            description: 'Colaboracion real',
            categoryId: 'soft-category',
            categorySlug: 'soft',
            icon: 'teamwork',
            iconDocumentId: null,
            iconUrl: null,
            accentColor: '#60a5fa',
            level: 'basic',
            tags: [],
            showLevel: false,
            published: true,
            displayOrder: 20,
          },
        ],
      },
    ];
  }

  function contentBlock(
    key: string,
    title: string,
    body: string,
    items: string[],
    published: boolean,
  ): PublicContentBlock {
    return {
      id: key,
      key,
      language: 'es',
      title,
      body,
      items,
      documentId: null,
      documentUrl: null,
      published,
      displayOrder: 1,
      createdAt: '2026-05-15T00:00:00Z',
      updatedAt: '2026-05-15T00:00:00Z',
    };
  }
});
