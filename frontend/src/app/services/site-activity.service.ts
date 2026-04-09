import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import {
  SiteActivityEvent,
  SiteActivityEventType,
  SiteActivityListResponse,
  SiteActivityTrackRequest,
} from '../models/site-activity.models';

interface RouteActivityDescriptor {
  path: string;
  label: string;
  contactOpen?: boolean;
}

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
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);

  readonly storageError = signal<string | null>(null);
  readonly events = signal<SiteActivityEvent[]>([]);

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

  loadAdminEvents(limit = MAX_EVENTS): void {
    this.http
      .get<SiteActivityListResponse>(`/api/admin/events?limit=${limit}`)
      .pipe(
        map((response) => response.data),
        catchError(() => {
          this.storageError.set('No se pudo cargar la actividad persistida del backend.');
          return of([]);
        }),
      )
      .subscribe((events) => {
        this.storageError.set(null);
        this.events.set(events);
      });
  }

  trackProjectSelection(projectId: string): void {
    this.pushEvent('project_interaction', 'select_project', `Proyecto: ${projectId}`);
  }

  trackProjectDemoOpen(projectId: string): void {
    this.pushEvent('project_interaction', 'open_project_demo', `Demo: ${projectId}`);
  }

  trackCommercialQuotePreview(): void {
    this.pushEvent('quote_interaction', 'preview_commercial_quote', 'Preview comercial');
  }

  trackCommercialQuoteSave(): void {
    this.pushEvent('quote_interaction', 'save_commercial_quote', 'Guardar cotizacion comercial');
  }

  trackCommercialQuoteDiscard(): void {
    this.pushEvent('quote_interaction', 'discard_commercial_quote', 'Descartar cotizacion comercial');
  }

  trackCommercialQuoteReset(): void {
    this.pushEvent('quote_interaction', 'new_commercial_quote', 'Nueva cotizacion comercial');
  }

  trackEstimatorPreview(): void {
    this.pushEvent('estimator_interaction', 'preview_estimator', 'Preview de estimacion');
  }

  trackEstimatorSave(): void {
    this.pushEvent('estimator_interaction', 'save_estimator', 'Guardar estimacion');
  }

  trackEstimatorDiscard(): void {
    this.pushEvent('estimator_interaction', 'discard_estimator', 'Descartar estimacion');
  }

  trackEstimatorReset(): void {
    this.pushEvent('estimator_interaction', 'new_estimator', 'Nueva estimacion');
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
    this.trackBackendEvent(type, action, label, route);
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

  private trackBackendEvent(
    type: SiteActivityEventType,
    action: string,
    label: string,
    route: string | null,
  ): void {
    const payload: SiteActivityTrackRequest = {
      eventType: type,
      path: route,
      source: 'portfolio-web',
      reference: action,
      metadata: {
        action,
        label,
        route: route ?? '',
      },
    };

    this.http
      .post('/api/events', payload)
      .pipe(
        catchError(() => {
          this.storageError.set('No se pudo registrar la actividad del sitio en backend.');
          return of(null);
        }),
      )
      .subscribe(() => {
        this.storageError.set(null);
      });
  }
}
