import { Component, computed, inject, signal } from '@angular/core';
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
  readonly activeWorkspace = signal<'budget' | 'update' | 'links' | 'messages'>('budget');
  readonly content = computed(() =>
    this.languageService.language() === 'es'
      ? {
          eyebrow: 'Modo privado',
          title: 'Panel de trabajo FERCHUZ',
          lead: 'Espacio privado para cotizar, actualizar el portfolio y gestionar recursos utiles sin tocar codigo.',
          statusLabel: 'Sesion activa',
          sessionLiveLabel: 'Online',
          sessionUserLabel: 'Usuario',
          sessionRoleLabel: 'Rol',
          sessionStateLabel: 'Estado',
          sessionStateValue: 'Acceso operativo',
          moduleCount: 4,
          modulesLabel: 'modulos privados',
          accessLabel: 'backend seguro',
          workspaces: [
            {
              id: 'budget',
              title: 'Presupuesto',
              description: 'Cotiza una propuesta completa y usa la estimacion tecnica como calculadora auxiliar.',
            },
            {
              id: 'update',
              title: 'Actualizar',
              description: 'Editar contenido del portfolio publico: perfil, skills, proyectos, CV y media.',
            },
            {
              id: 'links',
              title: 'Paginas amigas',
              description: 'Guardar recursos, documentacion y links utiles para referencia operativa.',
            },
            {
              id: 'messages',
              title: 'Mensajeria',
              description: 'Revisar contactos y consultas recibidas desde el sitio publico.',
            },
          ],
          logoutLabel: 'Cerrar sesion',
          budgetTitle: 'Presupuesto',
          budgetLead:
            'Completa datos del cliente, requerimientos, arquitectura y alcance para cotizar sin salir del mismo flujo.',
          estimatorNote:
            'La estimacion tecnica queda integrada como calculadora auxiliar para justificar horas, buffer y timeline.',
          updateTitle: 'Actualizar portfolio',
          updateLead:
            'Seccion para editar foto, CV, skills, datos de contacto, proyectos, diplomas y media del sitio publico.',
          linksTitle: 'Paginas amigas',
          linksLead:
            'Biblioteca privada para guardar links utiles, documentacion, referencias y recursos de trabajo.',
          messagesTitle: 'Mensajeria',
          messagesLead:
            'Bandeja para revisar consultas del formulario de contacto y su contexto operativo.',
          placeholderReady: 'Se prepara en la siguiente etapa.',
        }
      : {
          eyebrow: 'Private mode',
          title: 'FERCHUZ work panel',
          lead: 'Private space to quote, update the portfolio, and manage useful resources without touching code.',
          statusLabel: 'Active session',
          sessionLiveLabel: 'Online',
          sessionUserLabel: 'User',
          sessionRoleLabel: 'Role',
          sessionStateLabel: 'State',
          sessionStateValue: 'Operational access',
          moduleCount: 4,
          modulesLabel: 'private modules',
          accessLabel: 'secure backend',
          workspaces: [
            {
              id: 'budget',
              title: 'Budget',
              description: 'Quote a complete proposal and use technical estimation as an auxiliary calculator.',
            },
            {
              id: 'update',
              title: 'Update',
              description: 'Edit public portfolio content: profile, skills, projects, CV, and media.',
            },
            {
              id: 'links',
              title: 'Friendly pages',
              description: 'Store useful links, documentation, references, and work resources.',
            },
            {
              id: 'messages',
              title: 'Messaging',
              description: 'Review contact form inquiries and their operating context.',
            },
          ],
          logoutLabel: 'Sign out',
          budgetTitle: 'Budget',
          budgetLead:
            'Complete client data, requirements, architecture, and scope to quote inside a single flow.',
          estimatorNote:
            'Technical estimation stays integrated as an auxiliary calculator to justify hours, risk buffer, and timeline.',
          updateTitle: 'Update portfolio',
          updateLead:
            'Section to edit profile, CV, skills, contact details, projects, diplomas, and media from the public site.',
          linksTitle: 'Friendly pages',
          linksLead: 'Private library for useful links, documentation, references, and work resources.',
          messagesTitle: 'Messaging',
          messagesLead: 'Inbox to review contact-form inquiries and their operating context.',
          placeholderReady: 'Prepared for the next stage.',
        },
  );

  setWorkspace(workspace: string): void {
    if (workspace === 'budget' || workspace === 'update' || workspace === 'links' || workspace === 'messages') {
      this.activeWorkspace.set(workspace);
    }
  }

  logout(): void {
    this.authService.logout();
    void this.router.navigate(['/'], { fragment: 'home-top' });
  }
}
