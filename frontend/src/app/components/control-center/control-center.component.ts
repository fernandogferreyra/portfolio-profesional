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
          title: 'Workspace privado FERCHUZ',
          lead:
            'Mesa de trabajo privada para cotizar, estimar y revisar actividad con backend como fuente de verdad.',
          statusLabel: 'Sesion activa',
          sessionLiveLabel: 'Online',
          sessionUserLabel: 'Usuario',
          sessionRoleLabel: 'Rol',
          sessionStateLabel: 'Estado',
          sessionStateValue: 'Acceso operativo',
          moduleCount: 3,
          modulesLabel: 'workspaces activos',
          accessLabel: 'backend seguro',
          toolsEyebrow: 'Workspace operativo',
          toolsTitle: 'Superficies internas para cerrar alcance, esfuerzo y precio sin salir del dashboard.',
          toolsLead:
            'No es un panel de marketing. Es una mesa de trabajo para leer impacto en vivo y guardar decisiones tecnicas o comerciales.',
          workspaceCards: [
            {
              title: 'Cotizacion en vivo',
              description:
                'Budget Builder recalcula total inicial, mensualidad, recargos, descuentos y horas al mover opciones clave.',
              tag: 'Comercial',
              cta: 'Ir a Budget Builder',
              href: '#budget-builder-workspace',
            },
            {
              title: 'Estimacion tecnica',
              description:
                'El estimador expone PERT, buffer de riesgo, timeline y desglose por modulo para validar esfuerzo rapido.',
              tag: 'Tecnico',
              cta: 'Ir a Estimador',
              href: '#technical-estimator-workspace',
            },
            {
              title: 'Panel activo',
              description:
                'Actividad del sitio, estado operativo y lectura rapida del workspace sin salir del dashboard.',
              tag: 'Operacion',
              cta: 'Ir a Actividad',
              href: '#site-activity-workspace',
            },
          ],
          quickLinks: [
            { href: '#budget-builder-workspace', label: 'Ir a Budget Builder' },
            { href: '#technical-estimator-workspace', label: 'Ir a Estimador' },
            { href: '#site-activity-workspace', label: 'Ir a Actividad' },
          ],
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
          title: 'FERCHUZ private workspace',
          lead:
            'Private operating desk to quote, estimate, and review activity with backend as the source of truth.',
          statusLabel: 'Active session',
          sessionLiveLabel: 'Online',
          sessionUserLabel: 'User',
          sessionRoleLabel: 'Role',
          sessionStateLabel: 'State',
          sessionStateValue: 'Operational access',
          moduleCount: 3,
          modulesLabel: 'active workspaces',
          accessLabel: 'secure backend',
          toolsEyebrow: 'Operating workspace',
          toolsTitle: 'Internal surfaces to close scope, effort, and pricing without leaving the dashboard.',
          toolsLead:
            'This is not a marketing panel. It is a workbench to read live impact and store technical or commercial decisions.',
          workspaceCards: [
            {
              title: 'Live quoting',
              description:
                'Budget Builder recalculates one-time total, monthly billing, surcharges, discounts, and hours as key options move.',
              tag: 'Commercial',
              cta: 'Go to Budget Builder',
              href: '#budget-builder-workspace',
            },
            {
              title: 'Technical estimation',
              description:
                'The estimator exposes PERT, risk buffer, timeline, and per-module breakdown to validate effort quickly.',
              tag: 'Technical',
              cta: 'Go to Estimator',
              href: '#technical-estimator-workspace',
            },
            {
              title: 'Active panel',
              description:
                'Site activity, operating state, and fast workspace reading without leaving the dashboard.',
              tag: 'Operations',
              cta: 'Go to Activity',
              href: '#site-activity-workspace',
            },
          ],
          quickLinks: [
            { href: '#budget-builder-workspace', label: 'Go to Budget Builder' },
            { href: '#technical-estimator-workspace', label: 'Go to Estimator' },
            { href: '#site-activity-workspace', label: 'Go to Activity' },
          ],
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
