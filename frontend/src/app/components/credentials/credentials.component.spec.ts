import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { CredentialsComponent } from './credentials.component';
import { CredentialItem, CredentialService } from '../../services/credential.service';
import { DocumentAdminService } from '../../services/document-admin.service';
import { EditModeService } from '../../services/edit-mode.service';

describe('CredentialsComponent', () => {
  let fixture: ComponentFixture<CredentialsComponent>;
  let component: CredentialsComponent;
  let documentBlob: Blob;

  beforeEach(async () => {
    documentBlob = new Blob(['credential-pdf-content'], { type: 'application/pdf' });

    await TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [CredentialsComponent],
      providers: [
        {
          provide: CredentialService,
          useValue: {
            listCredentials: () => of({ success: true, message: 'ok', data: [credential()] }),
            listAdminCredentials: () => of({ success: true, message: 'ok', data: [credential()] }),
            createCredential: () => of({ success: true, message: 'ok', data: credential('new-id') }),
            updateCredential: (_: string, payload: Partial<CredentialItem>) =>
              of({ success: true, message: 'ok', data: { ...credential(), ...payload } }),
            downloadCredentialDocument: () => of(documentBlob),
          },
        },
        {
          provide: DocumentAdminService,
          useValue: {
            uploadDocument: () => of({ success: true, message: 'ok', data: { id: 'doc-1' } }),
          },
        },
        {
          provide: EditModeService,
          useValue: {
            isEnabled: () => false,
          },
        },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(CredentialsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
  });

  it('renders backend credentials and does not render the old placeholder', () => {
    const textContent = fixture.nativeElement.textContent as string;

    expect(component.visibleEntries()[0].title).toBe('Tecnicatura Universitaria en Programacion');
    expect(textContent).toContain('Tecnicatura Universitaria en Programacion');
    expect(textContent).not.toContain('Certificaciones tecnicas');
    expect(textContent).not.toContain('En preparacion');
  });

  it('renders a document preview and keeps the open document link', async () => {
    await (component as unknown as { loadDocumentPreview: (entry: CredentialItem, force: boolean) => Promise<void> }).loadDocumentPreview(
      component.visibleEntries()[0],
      true,
    );
    fixture.detectChanges();

    const iframe = fixture.nativeElement.querySelector('.credential-card__document-preview') as HTMLIFrameElement | null;
    const link = fixture.nativeElement.querySelector('.credential-card__document-link') as HTMLAnchorElement | null;

    expect(iframe).not.toBeNull();
    expect(iframe?.title).toContain('Vista previa de documentacion');
    expect(iframe?.getAttribute('src')).toContain('view=FitH');
    expect(link?.getAttribute('href')).toContain('blob:');
    expect(link?.textContent).toContain('Abrir documentacion');
  });

  it('uses height fitting for landscape PDF previews', async () => {
    documentBlob = new Blob(['%PDF-1.7\n/Page /MediaBox [0 0 842 595]\n'], { type: 'application/pdf' });

    await (component as unknown as { loadDocumentPreview: (entry: CredentialItem, force: boolean) => Promise<void> }).loadDocumentPreview(
      component.visibleEntries()[0],
      true,
    );
    fixture.detectChanges();

    const iframe = fixture.nativeElement.querySelector('.credential-card__document-preview') as HTMLIFrameElement | null;

    expect(iframe?.getAttribute('src')).toContain('view=FitV');
  });
});

function credential(id = 'cred-1', documentUrl: string | null = '/api/credentials/cred-1/document'): CredentialItem {
  return {
    id,
    language: 'es',
    type: 'Formacion',
    title: 'Tecnicatura Universitaria en Programacion',
    institution: 'UTN FRC',
    description: 'Base academica orientada a programacion.',
    documentId: documentUrl ? 'doc-1' : null,
    documentUrl,
    published: true,
    displayOrder: 10,
    createdAt: '2026-05-13T00:00:00Z',
    updatedAt: '2026-05-13T00:00:00Z',
  };
}
