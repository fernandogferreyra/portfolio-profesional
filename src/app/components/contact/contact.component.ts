import { Component, computed, inject } from '@angular/core';

import { LanguageService } from '../../services/language.service';

@Component({
  selector: 'app-contact',
  standalone: false,
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss',
})
export class ContactComponent {
  private readonly languageService = inject(LanguageService);

  readonly emailHref =
    'mailto:fernandogabrielf@gmail.com?subject=Contacto%20profesional%20desde%20portfolio';
  readonly currentLanguage = this.languageService.language;
  readonly ui = computed(() =>
    this.currentLanguage() === 'es'
      ? {
          eyebrow: 'Contacto',
          title: 'Contacto profesional claro y directo.',
          intro:
            'La seccion concentra canales de contacto, disponibilidad y una guia breve para iniciar conversaciones con contexto tecnico.',
          channelsTitle: 'Canales directos',
          formTitle: 'Como prefiero recibir una propuesta',
          formDescription:
            'Comparti nombre, empresa o proyecto, objetivo del contacto y stack involucrado. Ese contexto me permite responder con mas precision.',
          formButtonLabel: 'Escribirme por email',
          formNote:
            'Tambien podes contactarme por LinkedIn para procesos formales o conversaciones iniciales.',
          availabilityTitle: 'Disponibilidad',
        }
      : {
          eyebrow: 'Contact',
          title: 'Clear and direct professional contact.',
          intro:
            'This section brings together direct channels, availability, and a short guide for starting conversations with useful technical context.',
          channelsTitle: 'Direct channels',
          formTitle: 'How I prefer to receive an opportunity brief',
          formDescription:
            'Share your name, company or project, the reason for the contact, and the stack involved. That context helps me respond with more precision.',
          formButtonLabel: 'Email me',
          formNote:
            'You can also reach out through LinkedIn for formal processes or an initial conversation.',
          availabilityTitle: 'Availability',
        },
  );
  readonly channels = computed(() =>
    this.currentLanguage() === 'es'
      ? [
          {
            id: 'email',
            badge: 'EM',
            label: 'Email',
            value: 'fernandogabrielf@gmail.com',
            note: 'Canal principal para oportunidades profesionales y conversaciones tecnicas.',
            href: 'mailto:fernandogabrielf@gmail.com',
          },
          {
            id: 'github',
            badge: 'GH',
            label: 'GitHub',
            value: 'github.com/fernandogferreyra',
            note: 'Codigo, experimentos y decisiones tecnicas visibles en repositorios publicos.',
            href: 'https://github.com/fernandogferreyra',
          },
          {
            id: 'linkedin',
            badge: 'LI',
            label: 'LinkedIn',
            value: 'linkedin.com/in/fernando-ferreyra-40a126328',
            note: 'Perfil profesional para procesos formales, networking y seguimiento.',
            href: 'https://www.linkedin.com/in/fernando-ferreyra-40a126328',
          },
          {
            id: 'cv',
            badge: 'CV',
            label: 'CV',
            value: 'Ver version actual',
            note: 'Resumen profesional actualizado con experiencia, stack y proyectos relevantes.',
            href: '/docs/cv-fernando-ferreyra.pdf',
          },
        ]
      : [
          {
            id: 'email',
            badge: 'EM',
            label: 'Email',
            value: 'fernandogabrielf@gmail.com',
            note: 'Primary channel for professional opportunities and technical conversations.',
            href: 'mailto:fernandogabrielf@gmail.com',
          },
          {
            id: 'github',
            badge: 'GH',
            label: 'GitHub',
            value: 'github.com/fernandogferreyra',
            note: 'Code, experiments, and visible technical decisions in public repositories.',
            href: 'https://github.com/fernandogferreyra',
          },
          {
            id: 'linkedin',
            badge: 'LI',
            label: 'LinkedIn',
            value: 'linkedin.com/in/fernando-ferreyra-40a126328',
            note: 'Professional profile for formal processes, networking, and follow-up.',
            href: 'https://www.linkedin.com/in/fernando-ferreyra-40a126328',
          },
          {
            id: 'cv',
            badge: 'CV',
            label: 'Resume',
            value: 'Open latest version',
            note: 'Updated professional summary with experience, stack, and relevant projects.',
            href: '/docs/cv-fernando-ferreyra.pdf',
          },
        ],
  );
  readonly briefItems = computed(() =>
    this.currentLanguage() === 'es'
      ? [
          {
            id: 'name',
            label: 'Nombre',
            value: 'Tu nombre, rol y empresa o equipo.',
          },
          {
            id: 'scope',
            label: 'Proyecto o contexto',
            value: 'Producto, area tecnica involucrada y objetivo del contacto.',
          },
          {
            id: 'stack',
            label: 'Stack y alcance',
            value: 'Tecnologias, modalidad de trabajo, alcance estimado y tiempos.',
          },
        ]
      : [
          {
            id: 'name',
            label: 'Name',
            value: 'Your name, role, and company or team.',
          },
          {
            id: 'scope',
            label: 'Project or context',
            value: 'Product, technical area involved, and reason for the contact.',
          },
          {
            id: 'stack',
            label: 'Stack and scope',
            value: 'Technologies, work mode, estimated scope, and timeline.',
          },
        ],
  );
  readonly availability = computed(() =>
    this.currentLanguage() === 'es'
      ? ['Oportunidades profesionales', 'Colaboracion tecnica', 'Proyectos freelance']
      : ['Professional opportunities', 'Technical collaboration', 'Freelance projects'],
  );
}
