import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { NEVER, of } from 'rxjs';

import { ControlCenterUpdateComponent } from './control-center-update.component';
import { AdminAiService } from '../../services/admin-ai.service';
import { DocumentAdminService } from '../../services/document-admin.service';
import { ProjectAdminService } from '../../services/project-admin.service';
import { PublicContentAdminService } from '../../services/public-content-admin.service';
import { PublicContentBlock } from '../../services/public-content.service';

describe('ControlCenterUpdateComponent', () => {
  let fixture: ComponentFixture<ControlCenterUpdateComponent>;
  let component: ControlCenterUpdateComponent;
  let projectAdminService: jasmine.SpyObj<ProjectAdminService>;
  let documentAdminService: jasmine.SpyObj<DocumentAdminService>;
  let publicContentAdminService: jasmine.SpyObj<PublicContentAdminService>;
  let adminAiService: jasmine.SpyObj<AdminAiService>;

  beforeEach(async () => {
    projectAdminService = jasmine.createSpyObj<ProjectAdminService>('ProjectAdminService', [
      'listProjects',
      'updateProject',
    ]);
    documentAdminService = jasmine.createSpyObj<DocumentAdminService>('DocumentAdminService', [
      'listDocuments',
      'uploadDocument',
      'deleteDocument',
    ]);
    publicContentAdminService = jasmine.createSpyObj<PublicContentAdminService>('PublicContentAdminService', [
      'listContentBlocks',
      'updateContentBlock',
    ]);
    adminAiService = jasmine.createSpyObj<AdminAiService>('AdminAiService', ['translate']);

    projectAdminService.listProjects.and.returnValue(of({ success: true, message: 'ok', data: [] }));
    documentAdminService.listDocuments.and.returnValue(of({ success: true, message: 'ok', data: [] }));
    publicContentAdminService.listContentBlocks.and.returnValue(
      of({ success: true, message: 'ok', data: [block('es-block', 'contact.email', 'es'), block('en-block', 'contact.email', 'en')] }),
    );

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      declarations: [ControlCenterUpdateComponent],
      providers: [
        { provide: ProjectAdminService, useValue: projectAdminService },
        { provide: DocumentAdminService, useValue: documentAdminService },
        { provide: PublicContentAdminService, useValue: publicContentAdminService },
        { provide: AdminAiService, useValue: adminAiService },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  it('keeps documents and CMS sections visible while projects are still loading', async () => {
    projectAdminService.listProjects.and.returnValue(NEVER);
    fixture = TestBed.createComponent(ControlCenterUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    const textContent = fixture.nativeElement.textContent as string;

    expect(component.loading()).toBeTrue();
    expect(textContent).toContain('Documentos internos');
    expect(textContent).toContain('Bloques publicos');
  });

  it('saves the current block before translating the linked language with AI', async () => {
    fixture = TestBed.createComponent(ControlCenterUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();

    component.selectContentBlock(block('es-block', 'contact.email', 'es'));
    component.contentBlockForm.patchValue({
      title: 'Email laboral',
      body: 'Canal para oportunidades.',
      items: 'hola@example.com\nmailto:hola@example.com',
      documentId: '',
      displayOrder: 42,
      published: true,
    });
    publicContentAdminService.updateContentBlock.and.callFake((id, payload) =>
      of({
        success: true,
        message: 'ok',
        data: block(id, 'contact.email', id === 'es-block' ? 'es' : 'en', payload.title, payload.body, payload.items),
      }),
    );
    adminAiService.translate.and.callFake((payload) =>
      of({
        success: true,
        message: 'ok',
        data: {
          translatedText: `en:${payload.text}`,
          sourceLanguage: payload.sourceLanguage,
          targetLanguage: payload.targetLanguage,
          provider: 'mistral',
          model: 'test',
        },
      }),
    );

    await component.translateSelectedContentBlockToEnglish();

    expect(publicContentAdminService.updateContentBlock.calls.argsFor(0)).toEqual([
      'es-block',
      jasmine.objectContaining({
        title: 'Email laboral',
        body: 'Canal para oportunidades.',
        items: ['hola@example.com', 'mailto:hola@example.com'],
      }),
    ]);
    expect(publicContentAdminService.updateContentBlock.calls.argsFor(1)).toEqual([
      'en-block',
      jasmine.objectContaining({
        title: 'en:Email laboral',
        body: 'en:Canal para oportunidades.',
        items: ['en:hola@example.com', 'mailto:hola@example.com'],
      }),
    ]);
    expect(adminAiService.translate).toHaveBeenCalledWith(
      jasmine.objectContaining({ sourceLanguage: 'es', targetLanguage: 'en' }),
    );
  });

  it('deletes an internal document and clears linked CMS blocks locally', async () => {
    const document = {
      id: 'doc-1',
      purpose: 'cv',
      originalFilename: 'old-cv.pdf',
      storedFilename: 'stored.pdf',
      contentType: 'application/pdf',
      sizeBytes: 128,
      storagePath: 'stored.pdf',
      createdAt: '2026-05-12T00:00:00Z',
      updatedAt: '2026-05-12T00:00:00Z',
    };
    documentAdminService.listDocuments.and.returnValue(of({ success: true, message: 'ok', data: [document] }));
    documentAdminService.deleteDocument.and.returnValue(of({ success: true, message: 'ok', data: null }));
    publicContentAdminService.listContentBlocks.and.returnValue(
      of({ success: true, message: 'ok', data: [block('cv-block', 'contact.cv', 'es', 'CV', 'Resume', [], 'doc-1')] }),
    );
    spyOn(window, 'confirm').and.returnValue(true);

    fixture = TestBed.createComponent(ControlCenterUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();

    await component.deleteDocument(document);

    expect(documentAdminService.deleteDocument).toHaveBeenCalledWith('doc-1');
    expect(component.documents()).toEqual([]);
    expect(component.contentBlocks()[0].documentId).toBeNull();
    expect(component.contentBlockForm.controls.documentId.value).toBe('');
  });
});

function block(
  id: string,
  key: string,
  language: string,
  title = `${language} title`,
  body = `${language} body`,
  items: string[] = [],
  documentId: string | null = null,
): PublicContentBlock {
  return {
    id,
    key,
    language,
    title,
    body,
    items,
    documentId,
    documentUrl: documentId ? `/api/content-blocks/${key}/${language}/document` : null,
    published: true,
    displayOrder: language === 'es' ? 42 : 43,
    createdAt: '2026-05-12T00:00:00Z',
    updatedAt: '2026-05-12T00:00:00Z',
  };
}
