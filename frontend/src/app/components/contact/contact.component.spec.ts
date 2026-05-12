import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { ContactComponent } from './contact.component';
import { PublicContentService } from '../../services/public-content.service';

describe('ContactComponent', () => {
  let component: ContactComponent;
  let fixture: ComponentFixture<ContactComponent>;

  beforeEach(async () => {
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
