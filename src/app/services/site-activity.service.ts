import { inject, Injectable, signal } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';

import { SiteActivityEvent, SiteActivityEventType } from '../models/site-activity.models';

interface RouteActivityDescriptor {
  path: string;
  label: string;
  contactOpen?: boolean;
}

const STORAGE_KEY = 'portfolio.site-activity';
const MAX_EVENTS = 400;
const ROUTE_TRACK_DEDUP_MS = 1200;

const ROUTE_ACTIVITY_MAP: RouteActivityDescriptor[] = [
  { path: '', label: 'Inicio' },
  { path: '/home', label: 'Inicio' },
  { path: '/projects', label: 'Proyectos' },
  { path: '/skills', label: 'Skills' },
  { path: '/credentials', label: 'Credenciales' },
  { path: '/contact', label: 'Contacto', contactOpen: true },
  { path: '/control-center', label: 'Centro de Mando' },
];

@Injectable({
  providedIn: 'root',
})
export class SiteActivityService {
  private readonly router = inject(Router);

  readonly storageError = signal<string | null>(null);
  readonly events = signal<SiteActivityEvent[]>(this.readStoredEvents());

  private lastTrackedRoutePath: string | null = null;
  private lastTrackedRouteAt = 0;

  constructor() {
    this.router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe((event) => {
        this.trackRouteVisit(event.urlAfterRedirects);
      });

    this.trackRouteVisit(this.router.url);
  }

  trackProjectSelection(projectId: string): void {
    this.pushEvent('project_interaction', 'select_project', `Proyecto: ${projectId}`);
  }

  trackProjectDemoOpen(projectId: string): void {
    this.pushEvent('project_interaction', 'open_project_demo', `Demo: ${projectId}`);
  }

  trackQuotePreview(): void {
    this.pushEvent('quote_interaction', 'preview_quote', 'Preview de cotizacion');
  }

  trackQuoteSave(): void {
    this.pushEvent('quote_interaction', 'save_quote', 'Guardar cotizacion');
  }

  trackQuoteDiscard(): void {
    this.pushEvent('quote_interaction', 'discard_quote', 'Descartar preview');
  }

  trackQuoteReset(): void {
    this.pushEvent('quote_interaction', 'new_quote', 'Nueva cotizacion');
  }

  private trackRouteVisit(url: string): void {
    const normalizedPath = this.normalizeRoute(url);
    const mappedRoute = ROUTE_ACTIVITY_MAP.find((route) => route.path === normalizedPath);

    if (!mappedRoute) {
      return;
    }

    const now = Date.now();
    if (
      this.lastTrackedRoutePath === mappedRoute.path &&
      now - this.lastTrackedRouteAt < ROUTE_TRACK_DEDUP_MS
    ) {
      return;
    }

    this.lastTrackedRoutePath = mappedRoute.path;
    this.lastTrackedRouteAt = now;

    this.pushEvent('section_view', `view:${mappedRoute.path || 'home'}`, mappedRoute.label, mappedRoute.path);

    if (mappedRoute.contactOpen) {
      this.pushEvent('contact_interaction', 'open_contact', 'Apertura de contacto', mappedRoute.path);
    }
  }

  private pushEvent(
    type: SiteActivityEventType,
    action: string,
    label: string,
    route: string | null = this.normalizeRoute(this.router.url),
  ): void {
    const nextEvents = [
      {
        id: this.generateEventId(),
        type,
        action,
        label,
        route,
        createdAt: new Date().toISOString(),
      },
      ...this.events(),
    ].slice(0, MAX_EVENTS);

    this.events.set(nextEvents);
    this.writeStoredEvents(nextEvents);
  }

  private normalizeRoute(url: string): string {
    const [path] = url.split('?');
    const [cleanPath] = path.split('#');
    return cleanPath === '/' ? '' : cleanPath;
  }

  private generateEventId(): string {
    if (globalThis.crypto?.randomUUID) {
      return globalThis.crypto.randomUUID();
    }

    return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  }

  private readStoredEvents(): SiteActivityEvent[] {
    try {
      const rawValue = globalThis.localStorage?.getItem(STORAGE_KEY);
      this.storageError.set(null);

      if (!rawValue) {
        return [];
      }

      const parsedValue = JSON.parse(rawValue);
      if (!Array.isArray(parsedValue)) {
        return [];
      }

      return parsedValue.filter(
        (item): item is SiteActivityEvent =>
          Boolean(
            item &&
              typeof item.id === 'string' &&
              typeof item.type === 'string' &&
              typeof item.action === 'string' &&
              typeof item.label === 'string' &&
              typeof item.createdAt === 'string',
          ),
      );
    } catch {
      this.storageError.set('No se pudo leer la actividad local almacenada.');
      return [];
    }
  }

  private writeStoredEvents(events: SiteActivityEvent[]): void {
    try {
      globalThis.localStorage?.setItem(STORAGE_KEY, JSON.stringify(events));
      this.storageError.set(null);
    } catch {
      this.storageError.set('No se pudo persistir la actividad local del sitio.');
    }
  }
}
