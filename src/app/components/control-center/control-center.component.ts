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
            'Base inicial para operaciones internas. El portfolio publico sigue intacto y este espacio concentra accesos administrativos futuros.',
          statusLabel: 'Sesion activa',
          sessionLiveLabel: 'Online',
          sessionUserLabel: 'Usuario',
          sessionRoleLabel: 'Rol',
          sessionStateLabel: 'Estado',
          sessionStateValue: 'Acceso operativo',
          moduleCount: 5,
          modulesLabel: 'modulos listos',
          accessLabel: 'acceso seguro',
          toolsEyebrow: 'Workspace privado',
          toolsTitle: 'Herramientas internas preparadas para crecer sin ensuciar el portfolio publico.',
          toolsLead:
            'Cada modulo ya tiene un espacio claro dentro del dashboard. El siguiente paso puede implementarse sobre esta base sin rehacer el layout.',
          logoutLabel: 'Cerrar sesion',
          modules: [
            {
              title: 'Mensajeria',
              description:
                'Bandeja para seguimiento de conversaciones, leads y automatizaciones operativas desde un unico punto.',
              tag: 'Canal interno',
              status: 'Placeholder listo',
              action: 'Proximamente',
            },
            {
              title: 'Presupuestos PDF',
              description:
                'Generacion y gestion de documentos comerciales exportables con trazabilidad de version y cliente.',
              tag: 'Documentacion',
              status: 'Placeholder listo',
              action: 'Proximamente',
            },
          ],
        }
      : {
          eyebrow: 'Control Center',
          title: 'FERCHUZ private hub',
          lead:
            'Initial internal operations layer. The public portfolio remains untouched and this space centralizes future admin access points.',
          statusLabel: 'Active session',
          sessionLiveLabel: 'Online',
          sessionUserLabel: 'User',
          sessionRoleLabel: 'Role',
          sessionStateLabel: 'State',
          sessionStateValue: 'Operational access',
          moduleCount: 5,
          modulesLabel: 'modules ready',
          accessLabel: 'secure access',
          toolsEyebrow: 'Private workspace',
          toolsTitle: 'Internal tools arranged to scale without disturbing the public portfolio.',
          toolsLead:
            'Each module already has a clear place inside the dashboard. The next feature can plug into this layout without a visual reset.',
          logoutLabel: 'Sign out',
          modules: [
            {
              title: 'Messaging',
              description:
                'Inbox space for conversations, leads, and operational automations from a single internal surface.',
              tag: 'Internal channel',
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
