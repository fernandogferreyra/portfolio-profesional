import { Component, computed, inject } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from '../../services/auth.service';
import { LanguageService } from '../../services/language.service';

@Component({
  selector: 'app-control-center',
  standalone: false,
  templateUrl: './control-center.component.html',
  styleUrl: './control-center.component.scss',
})
export class ControlCenterComponent {
  private readonly router = inject(Router);
  private readonly languageService = inject(LanguageService);

  readonly authService = inject(AuthService);
  readonly content = computed(() =>
    this.languageService.language() === 'es'
      ? {
          eyebrow: 'Centro de Mando',
          title: 'Panel privado FERCHUZ',
          lead:
            'Base inicial para operaciones internas. El portfolio público sigue intacto y este espacio concentra accesos administrativos futuros.',
          statusLabel: 'Sesión activa',
          logoutLabel: 'Cerrar sesión',
          modules: [
            {
              title: 'Cotizador',
              description:
                'Entrada para cálculo de servicios, alcance, complejidad y armado de propuesta comercial.',
              tag: 'Pipeline privado',
              status: 'Placeholder listo',
              action: 'Próximamente',
            },
            {
              title: 'Mensajería',
              description:
                'Bandeja para seguimiento de conversaciones, leads y automatizaciones operativas desde un único punto.',
              tag: 'Canal interno',
              status: 'Placeholder listo',
              action: 'Próximamente',
            },
            {
              title: 'Analytics',
              description:
                'Vista futura para eventos, embudo del portfolio y señales de uso relevantes para toma de decisiones.',
              tag: 'Inteligencia operativa',
              status: 'Placeholder listo',
              action: 'Próximamente',
            },
            {
              title: 'Presupuestos PDF',
              description:
                'Generación y gestión de documentos comerciales exportables con trazabilidad de versión y cliente.',
              tag: 'Documentación',
              status: 'Placeholder listo',
              action: 'Próximamente',
            },
          ],
        }
      : {
          eyebrow: 'Control Center',
          title: 'FERCHUZ private hub',
          lead:
            'Initial internal operations layer. The public portfolio remains untouched and this space centralizes future admin access points.',
          statusLabel: 'Active session',
          logoutLabel: 'Sign out',
          modules: [
            {
              title: 'Quote Engine',
              description:
                'Entry point for pricing workflows, service scope, complexity, and proposal preparation.',
              tag: 'Private pipeline',
              status: 'Placeholder ready',
              action: 'Coming soon',
            },
            {
              title: 'Messaging',
              description:
                'Inbox space for conversations, leads, and operational automations from a single internal surface.',
              tag: 'Internal channel',
              status: 'Placeholder ready',
              action: 'Coming soon',
            },
            {
              title: 'Analytics',
              description:
                'Future view for events, portfolio funnel signals, and internal usage metrics that matter.',
              tag: 'Operational intelligence',
              status: 'Placeholder ready',
              action: 'Coming soon',
            },
            {
              title: 'PDF Estimates',
              description:
                'Generation and management layer for exportable commercial documents with client/version traceability.',
              tag: 'Documentation',
              status: 'Placeholder ready',
              action: 'Coming soon',
            },
          ],
        },
  );

  logout(): void {
    this.authService.logout();
    void this.router.navigate(['/'], { fragment: 'home-top' });
  }
}
