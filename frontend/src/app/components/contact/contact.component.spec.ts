import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { ContactComponent } from './contact.component';
import { DocumentAdminService } from '../../services/document-admin.service';
import { EditModeService } from '../../services/edit-mode.service';
import { PublicContentAdminService } from '../../services/public-content-admin.service';
import { PublicContentService } from '../../services/public-content.service';

describe('ContactComponent', () => {
  let component: ContactComponent;
  let fixture: ComponentFixture<ContactComponent>;
  let editModeEnabled: boolean;
  let publicContentAdminService: jasmine.SpyObj<PublicContentAdminService>;
  let documentAdminService: jasmine.SpyObj<DocumentAdminService>;

  beforeEach(async () => {
    editModeEnabled = false;
    publicContentAdminService = jasmine.createSpyObj<PublicContentAdminService>('PublicContentAdminService', [
      'listContentBlocks',
      'updateContentBlock',
    ]);
    publicContentAdminService.listContentBlocks.and.returnValue(of({ success: true, message: 'ok', data: [] }));
    publicContentAdminService.updateContentBlock.and.callFake((id, payload) =>
      of({
        success: true,
        message: 'ok',
        data: { ...contentBlock('contact.email', 'es', payload.title, payload.body, payload.items), id },
      }),
    );
    documentAdminService = jasmine.createSpyObj<DocumentAdminService>('DocumentAdminService', ['uploadDocument']);
    documentAdminService.uploadDocument.and.returnValue(
      of({
        success: true,
        message: 'ok',
        data: {
          id: 'doc-1',
          purpose: 'cv',
          originalFilename: 'cv.pdf',
          storedFilename: 'cv.pdf',
          contentType: 'application/pdf',
          sizeBytes: 1,
          storagePath: 'runtime/documents/cv.pdf',
          createdAt: '2026-05-14T00:00:00Z',
          updatedAt: '2026-05-14T00:00:00Z',
        },
      }),
    );

    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, ReactiveFormsModule, RouterTestingModule],
      declarations: [ContactComponent],
      providers: [
        {
          provide: PublicContentService,
          useValue: {
            listPublicContentBlocks: () => of({ success: true, message: 'ok', data: [] }),
          },
        },
        {
          provide: PublicContentAdminService,
          useValue: publicContentAdminService,
        },
        {
          provide: DocumentAdminService,
          useValue: documentAdminService,
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

    fixture = TestBed.createComponent(ContactComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('uses editable CMS blocks for each direct contact channel', () => {
    component.contentBlocks.set([
      contentBlock('contact.email', 'es', 'Email laboral', 'Para propuestas concretas.', [
        'hola@example.com',
        'mailto:hola@example.com',
      ]),
      contentBlock('contact.phone', 'es', 'WhatsApp', 'Solo coordinado previamente.', ['+54 9 351 000 0000']),
      contentBlock('contact.linkedin', 'es', 'LinkedIn Fer', 'Perfil profesional actualizado.', [
        'linkedin.com/in/fer-test',
        'https://linkedin.com/in/fer-test',
      ]),
      contentBlock('contact.github', 'es', 'Repos publicos', 'Codigo publico.', [
        'github.com/fer-test',
        'https://github.com/fer-test',
      ]),
      contentBlock('contact.cv', 'es', 'CV actualizado', 'Documento profesional.', ['/legacy-cv.pdf'], '/api/cv.pdf'),
    ]);

    const channels = component.channels();

    expect(channels.find((channel) => channel.id === 'email')).toEqual(
      jasmine.objectContaining({ label: 'Email laboral', value: 'hola@example.com', href: 'mailto:hola@example.com' }),
    );
    expect(channels.find((channel) => channel.id === 'phone')).toEqual(
      jasmine.objectContaining({ label: 'WhatsApp', value: '+54 9 351 000 0000' }),
    );
    expect(channels.find((channel) => channel.id === 'linkedin')).toEqual(
      jasmine.objectContaining({ label: 'LinkedIn Fer', href: 'https://linkedin.com/in/fer-test' }),
    );
    expect(channels.find((channel) => channel.id === 'github')).toEqual(
      jasmine.objectContaining({ label: 'Repos publicos', href: 'https://github.com/fer-test' }),
    );
    expect(channels.find((channel) => channel.id === 'cv')).toEqual(
      jasmine.objectContaining({ label: 'CV actualizado', value: 'Abrir CV', href: '/api/cv.pdf' }),
    );
  });

  it('does not render implementation notes in the public contact UI', () => {
    fixture.detectChanges();

    const textContent = fixture.nativeElement.textContent as string;

    expect(textContent).not.toContain('endpoint real');
    expect(textContent).not.toContain('Menu rapido');
  });

  it('renders channel editors only when EditMode is enabled', () => {
    component.contentBlocks.set([
      contentBlock('contact.email', 'es', 'Email laboral', 'Para propuestas concretas.', [
        'hola@example.com',
        'mailto:hola@example.com',
      ]),
    ]);
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).not.toContain('Editar canales directos');

    editModeEnabled = true;
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Editar canales directos');
  });

  it('saves edited contact channel blocks through the admin CMS service', async () => {
    editModeEnabled = true;
    component.contentBlocks.set([
      contentBlock('contact.email', 'es', 'Email laboral', 'Para propuestas concretas.', [
        'hola@example.com',
        'mailto:hola@example.com',
      ]),
    ]);
    component.updateBlockTitle('contact.email-es', 'Email nuevo');

    await component.saveContactBlock(component.editableChannelBlocks()[0]);

    expect(publicContentAdminService.updateContentBlock).toHaveBeenCalledWith(
      'contact.email-es',
      jasmine.objectContaining({ title: 'Email nuevo', items: ['hola@example.com', 'mailto:hola@example.com'] }),
    );
  });
});

function contentBlock(
  key: string,
  language: string,
  title: string,
  body: string,
  items: string[],
  documentUrl: string | null = null,
) {
  return {
    id: `${key}-${language}`,
    key,
    language,
    title,
    body,
    items,
    documentId: null,
    documentUrl,
    published: true,
    displayOrder: 1,
    createdAt: '2026-05-12T00:00:00Z',
    updatedAt: '2026-05-12T00:00:00Z',
  };
}
