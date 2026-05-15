import { NO_ERRORS_SCHEMA, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { EditModeService } from '../../services/edit-mode.service';
import { PublicContentAdminService } from '../../services/public-content-admin.service';
import { PublicContentBlock, PublicContentService } from '../../services/public-content.service';
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

  it('uses CMS skill copy when blocks are available', () => {
    component.contentBlocks.set([
      contentBlock('skill.java', 'Java CMS', 'Backend desde CMS', ['API'], true),
      contentBlock('skill.angular', 'Angular CMS', 'Frontend desde CMS', ['UI'], true),
    ]);

    const skills = component.categories().flatMap((category) => category.skills);

    expect(skills.map((skill) => skill.name)).toContain('Java CMS');
    expect(skills.find((skill) => skill.id === 'java')?.description).toBe('Backend desde CMS');
  });

  it('hides unpublished CMS skills outside edit mode', () => {
    component.contentBlocks.set([
      contentBlock('skill.java', 'Java CMS', 'Backend desde CMS', ['API'], false),
      contentBlock('skill.angular', 'Angular CMS', 'Frontend desde CMS', ['UI'], true),
    ]);

    const skills = component.categories().flatMap((category) => category.skills);

    expect(skills.map((skill) => skill.id)).not.toContain('java');
    expect(skills.map((skill) => skill.id)).toContain('angular');
  });

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
