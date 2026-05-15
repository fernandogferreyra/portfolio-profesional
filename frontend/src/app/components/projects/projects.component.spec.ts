import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { ProjectsComponent } from './projects.component';
import { EditModeService } from '../../services/edit-mode.service';
import { ProjectAdminItem, ProjectAdminService, ProjectAdminUpdatePayload } from '../../services/project-admin.service';
import { ProjectsService } from '../../services/projects.service';

describe('ProjectsComponent', () => {
  let component: ProjectsComponent;
  let fixture: ComponentFixture<ProjectsComponent>;
  let editModeEnabled: boolean;
  let projectsService: jasmine.SpyObj<ProjectsService>;
  let projectAdminService: jasmine.SpyObj<ProjectAdminService>;

  beforeEach(async () => {
    editModeEnabled = false;
    projectsService = jasmine.createSpyObj<ProjectsService>('ProjectsService', ['getProjects']);
    projectsService.getProjects.and.returnValue(of([]));
    projectAdminService = jasmine.createSpyObj<ProjectAdminService>('ProjectAdminService', ['listProjects', 'updateProject']);
    projectAdminService.listProjects.and.returnValue(of({ success: true, message: 'ok', data: [adminProject()] }));
    projectAdminService.updateProject.and.callFake((id: string, payload: ProjectAdminUpdatePayload) =>
      of({ success: true, message: 'ok', data: { ...adminProject(id), ...payload } }),
    );

    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
      declarations: [ProjectsComponent],
      providers: [
        {
          provide: ProjectsService,
          useValue: projectsService,
        },
        {
          provide: ProjectAdminService,
          useValue: projectAdminService,
        },
        {
          provide: EditModeService,
          useValue: {
            isEnabled: () => editModeEnabled,
          },
        },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  it('should create', () => {
    createComponent();

    expect(component).toBeTruthy();
  });

  it('does not render project editor for visitors', () => {
    createComponent();

    expect(projectsService.getProjects).toHaveBeenCalled();
    expect(projectAdminService.listProjects).not.toHaveBeenCalled();
    expect(fixture.nativeElement.textContent).not.toContain('Editar proyecto seleccionado');
  });

  it('loads admin projects and renders editor when EditMode is enabled', async () => {
    editModeEnabled = true;

    createComponent();
    await flushPromises();
    fixture.detectChanges();

    expect(projectAdminService.listProjects).toHaveBeenCalled();
    expect(fixture.nativeElement.textContent).toContain('Editar proyecto seleccionado');
    expect(component.activeProject()?.actions.map((action) => action.label)).toEqual(['Ver demo', 'Repositorio', 'Documentacion']);
    expect(component.activeProject()?.iconUrl).toBe('/api/projects/budget-builder/icon');
  });

  it('keeps the active admin project while editing slug and saves through PATCH', async () => {
    editModeEnabled = true;

    createComponent();
    await flushPromises();
    fixture.detectChanges();

    component.updateProjectField('slug', 'nuevo-slug');
    component.updateProjectField('name', 'Proyecto editado');
    component.updateProjectField('repositoryUrl', 'https://github.com/example/edited');
    component.updateProjectField('demoUrl', 'https://www.youtube.com/watch?v=edited12345');
    component.updateProjectField('monographUrl', '/docs/proyecto-editado.pdf');
    component.updateProjectStack('Angular, Spring Boot');

    expect(component.activeAdminProject()).toEqual(jasmine.objectContaining({ slug: 'nuevo-slug' }));

    await component.saveActiveProject();

    expect(projectAdminService.updateProject).toHaveBeenCalledWith(
      'project-1',
      jasmine.objectContaining({
        slug: 'nuevo-slug',
        name: 'Proyecto editado',
        repositoryUrl: 'https://github.com/example/edited',
        demoUrl: 'https://www.youtube.com/watch?v=edited12345',
        monographUrl: '/docs/proyecto-editado.pdf',
        iconDocumentId: 'doc-icon-1',
        metrics: [{ value: '1', label: 'metrica' }],
        sections: [{ title: 'Objetivo', items: ['Editar proyectos'] }],
        features: ['Editable'],
        documentationDocumentIds: ['doc-1'],
        screenshotDocumentIds: ['shot-1'],
        stack: ['Angular', 'Spring Boot'],
      }),
    );
    expect(component.activeProject()?.name).toBe('Proyecto editado');
    expect(component.selectedProjectId()).toBe('nuevo-slug');
  });

  function createComponent(): void {
    fixture = TestBed.createComponent(ProjectsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }
});

function adminProject(id = 'project-1'): ProjectAdminItem {
  return {
    id,
    slug: 'budget-builder',
    name: 'Budget Builder',
    year: '2026',
    category: 'Backend + Angular',
    summary: 'Sistema de presupuestos backend-first.',
    stack: ['Angular', 'Spring Boot'],
    featured: true,
    published: true,
    displayOrder: 1,
    repositoryUrl: 'https://github.com/example/budget-builder',
    demoUrl: 'https://www.youtube.com/watch?v=8qTf_oowQiY',
    monographUrl: '/docs/budget-builder.pdf',
    iconDocumentId: 'doc-icon-1',
    iconUrl: '/api/projects/budget-builder/icon',
    metrics: [{ value: '1', label: 'metrica' }],
    sections: [{ title: 'Objetivo', items: ['Editar proyectos'] }],
    features: ['Editable'],
    documentation: [{ id: 'doc-1', filename: 'documento.pdf', contentType: 'application/pdf', url: '/api/projects/budget-builder/documents/doc-1' }],
    screenshots: [{ id: 'shot-1', filename: 'captura.png', contentType: 'image/png', url: '/api/projects/budget-builder/documents/shot-1' }],
    createdAt: '2026-05-14T00:00:00Z',
    updatedAt: '2026-05-14T00:00:00Z',
  };
}

function flushPromises(): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve));
}
