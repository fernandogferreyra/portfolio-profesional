import { NO_ERRORS_SCHEMA, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { EditModeService } from '../../services/edit-mode.service';
import { PublicContentAdminService } from '../../services/public-content-admin.service';
import { PublicContentService } from '../../services/public-content.service';
import { SkillService } from '../../services/skill.service';
import { HomeComponent } from './home.component';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  const editModeEnabled = signal(false);

  beforeEach(async () => {
    editModeEnabled.set(false);

    await TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [HomeComponent],
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
          provide: SkillService,
          useValue: {
            listSkills: () => of({
              data: [
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
                      level: 'advanced',
                      tags: ['Spring'],
                      showLevel: true,
                      published: true,
                      displayOrder: 10,
                    },
                  ],
                },
              ],
            }),
          },
        },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('derives work areas from backend skills', () => {
    component.skillCatalog.set([
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
            level: 'advanced',
            tags: ['Spring'],
            showLevel: true,
            published: true,
            displayOrder: 10,
          },
        ],
      },
    ]);

    expect(component.workAreas()[0].label).toBe('Backend');
    expect(component.workAreas()[0].description).toBe('Java');
  });
});
