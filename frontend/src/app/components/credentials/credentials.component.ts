import { Component, computed, inject } from '@angular/core';

import { LanguageService } from '../../services/language.service';

interface CredentialEntry {
  id: string;
  type: string;
  title: string;
  institution: string;
  description: string;
  mediaLabel: string;
}

@Component({
  selector: 'app-credentials',
  standalone: false,
  templateUrl: './credentials.component.html',
  styleUrl: './credentials.component.scss',
})
export class CredentialsComponent {
  private readonly languageService = inject(LanguageService);

  readonly currentLanguage = this.languageService.language;
  readonly ui = computed(() =>
    this.currentLanguage() === 'es'
      ? {
          eyebrow: 'Formacion y certificaciones',
          title: 'Formacion y certificaciones',
          intro:
            'Vista preparada para reunir estudios formales y credenciales tecnicas con contexto claro, referencia institucional y una presentacion consistente.',
          backLabel: 'Volver al inicio',
        }
      : {
          eyebrow: 'Education and certifications',
          title: 'Education and certifications',
          intro:
            'A structured view prepared to gather formal education and technical credentials with clear context, institutional reference, and a consistent presentation.',
          backLabel: 'Back to home',
        },
  );

  readonly entries = computed<CredentialEntry[]>(() =>
    this.currentLanguage() === 'es'
      ? [
          {
            id: 'utn-programacion',
            type: 'Formacion',
            title: 'Tecnicatura Universitaria en Programacion',
            institution: 'UTN FRC',
            description:
              'Base academica orientada a programacion, logica, bases de datos y desarrollo de software.',
            mediaLabel: 'Diploma / constancia',
          },
          {
            id: 'future-certifications',
            type: 'Certificaciones',
            title: 'Certificaciones tecnicas',
            institution: 'En preparacion',
            description:
              'Espacio reservado para incorporar credenciales futuras vinculadas a backend, APIs, arquitectura y herramientas de desarrollo.',
            mediaLabel: 'Imagen de certificado',
          },
        ]
      : [
          {
            id: 'utn-programacion',
            type: 'Education',
            title: 'University Programming Technician',
            institution: 'UTN FRC',
            description:
              'Academic foundation focused on programming, logic, databases, and software development.',
            mediaLabel: 'Diploma / record',
          },
          {
            id: 'future-certifications',
            type: 'Certifications',
            title: 'Technical certifications',
            institution: 'In preparation',
            description:
              'Reserved space to incorporate future credentials related to backend, APIs, architecture, and development tooling.',
            mediaLabel: 'Certificate image',
          },
        ],
  );
}
