import { Component, computed, inject } from '@angular/core';

import { LanguageService } from '../../services/language.service';

type ContactChannelIconId = 'email' | 'phone' | 'linkedin' | 'github' | 'document';

interface ContactChannel {
  id: string;
  icon: ContactChannelIconId;
  accent: string;
  label: string;
  value: string;
  note: string;
  href?: string;
  newTab?: boolean;
}

interface ContactChannelIcon {
  viewBox: string;
  paths: string[];
}

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
  readonly channelIcons: Record<ContactChannelIconId, ContactChannelIcon> = {
    email: {
      viewBox: '0 0 24 24',
      paths: ['M4 7h16v10H4Z', 'M4 8.5 12 14l8-5.5'],
    },
    phone: {
      viewBox: '0 0 24 24',
      paths: ['M12 21a8 8 0 1 0-5.6-2.3L4 21l2.5-2.2A8 8 0 0 0 12 21Z', 'M9 9.2c.6 2.1 1.7 3.7 3.8 5.2', 'M9.7 10.2 8.5 11.4', 'M14.2 14.7l1.3-1.2'],
    },
    linkedin: {
      viewBox: '0 0 24 24',
      paths: ['M5 8h3v11H5Z', 'M6.5 5.5a.1.1 0 1 0 0 .1', 'M11 11h3v8h-3Z', 'M14 14c0-2 1.2-3 3-3s3 1.3 3 3v5h-3v-4.5c0-.7-.4-1.5-1.4-1.5S14 13.8 14 14.7'],
    },
    github: {
      viewBox: '0 0 24 24',
      paths: ['M9 18c-1.5 0-5-.7-5-4.5 0-1.2.4-2.2 1-3-.2-.6-.4-1.6 0-3.2 0 0 1-.3 3.3 1.1a11.5 11.5 0 0 1 6 0C18 7.3 19 7.6 19 7.6c.4 1.6.2 2.6 0 3.2.6.8 1 1.8 1 3 0 3.8-3.5 4.5-5 4.5', 'M9.5 18v-2.1c-2 .4-2.7-.8-3-1.5', 'M14.5 18v-2.1c2 .4 2.7-.8 3-1.5'],
    },
    document: {
      viewBox: '0 0 24 24',
      paths: ['M7 4h7l4 4v12H7Z', 'M14 4v4h4', 'M10 12h4', 'M10 16h4'],
    },
  };
  readonly ui = computed(() =>
    this.currentLanguage() === 'es'
      ? {
          eyebrow: 'Contacto',
          title: 'Si queres conversar sobre una oportunidad o un proyecto, podemos hablar.',
          intro:
            'Estoy abierto a conversaciones profesionales sobre roles, colaboraciones y desarrollo de software. Abajo tenes los canales directos y la informacion que me ayuda a responder con contexto.',
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
          title: 'If you want to discuss an opportunity or a project, we can talk.',
          intro:
            'I am open to professional conversations about roles, collaborations, and software development work. Below you will find direct channels and the context that helps me respond clearly.',
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
  readonly channels = computed<ContactChannel[]>(() =>
    this.currentLanguage() === 'es'
      ? [
          {
            id: 'email',
            icon: 'email',
            accent: '#ef4444',
            label: 'Gmail / Email',
            value: 'fernandogabrielf@gmail.com',
            note: 'Canal principal para oportunidades profesionales y conversaciones tecnicas.',
            href: 'mailto:fernandogabrielf@gmail.com',
          },
          {
            id: 'phone',
            icon: 'phone',
            accent: '#22c55e',
            label: 'Telefono / WhatsApp',
            value: 'Disponible a pedido',
            note: 'Canal directo para intercambio rapido cuando el proceso ya requiere una conversacion mas puntual.',
          },
          {
            id: 'linkedin',
            icon: 'linkedin',
            accent: '#0a66c2',
            label: 'LinkedIn',
            value: 'linkedin.com/in/fernando-ferreyra-40a126328',
            note: 'Perfil profesional para procesos formales, networking y seguimiento.',
            href: 'https://www.linkedin.com/in/fernando-ferreyra-40a126328',
            newTab: true,
          },
          {
            id: 'github',
            icon: 'github',
            accent: '#94a3b8',
            label: 'GitHub',
            value: 'github.com/fernandogferreyra',
            note: 'Codigo, experimentos y decisiones tecnicas visibles en repositorios publicos.',
            href: 'https://github.com/fernandogferreyra',
            newTab: true,
          },
          {
            id: 'cv',
            icon: 'document',
            accent: '#eab308',
            label: 'CV',
            value: 'Ver version actual',
            note: 'Resumen profesional actualizado con experiencia, stack y proyectos relevantes.',
            href: '/docs/cv-fernando-ferreyra.pdf',
            newTab: true,
          },
        ]
      : [
          {
            id: 'email',
            icon: 'email',
            accent: '#ef4444',
            label: 'Gmail / Email',
            value: 'fernandogabrielf@gmail.com',
            note: 'Primary channel for professional opportunities and technical conversations.',
            href: 'mailto:fernandogabrielf@gmail.com',
          },
          {
            id: 'phone',
            icon: 'phone',
            accent: '#22c55e',
            label: 'Phone / WhatsApp',
            value: 'Available on request',
            note: 'Direct channel for faster communication once a process requires a more specific conversation.',
          },
          {
            id: 'linkedin',
            icon: 'linkedin',
            accent: '#0a66c2',
            label: 'LinkedIn',
            value: 'linkedin.com/in/fernando-ferreyra-40a126328',
            note: 'Professional profile for formal processes, networking, and follow-up.',
            href: 'https://www.linkedin.com/in/fernando-ferreyra-40a126328',
            newTab: true,
          },
          {
            id: 'github',
            icon: 'github',
            accent: '#94a3b8',
            label: 'GitHub',
            value: 'github.com/fernandogferreyra',
            note: 'Code, experiments, and visible technical decisions in public repositories.',
            href: 'https://github.com/fernandogferreyra',
            newTab: true,
          },
          {
            id: 'cv',
            icon: 'document',
            accent: '#eab308',
            label: 'Resume',
            value: 'Open latest version',
            note: 'Updated professional summary with experience, stack, and relevant projects.',
            href: '/docs/cv-fernando-ferreyra.pdf',
            newTab: true,
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

  hasHref(channel: ContactChannel): boolean {
    return Boolean(channel.href);
  }
}
