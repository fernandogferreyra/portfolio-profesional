import { Component, OnInit, computed, inject, signal } from '@angular/core';

import { SiteActivityEvent } from '../../models/site-activity.models';
import { LanguageService } from '../../services/language.service';
import { SiteActivityService } from '../../services/site-activity.service';

interface ActivityDistributionItem {
  label: string;
  count: number;
  percent: number;
}

interface ActivitySnapshot {
  totalEvents: number;
  sectionVisits: number;
  projectClicks: number;
  contactOpens: number;
  toolUsage: number;
  topAction: ActivityDistributionItem | null;
  sectionDistribution: ActivityDistributionItem[];
  actionDistribution: ActivityDistributionItem[];
}

@Component({
  selector: 'app-control-center-site-activity',
  standalone: false,
  templateUrl: './control-center-site-activity.component.html',
  styleUrl: './control-center-site-activity.component.scss',
})
export class ControlCenterSiteActivityComponent implements OnInit {
  private readonly languageService = inject(LanguageService);
  private readonly siteActivityService = inject(SiteActivityService);

  readonly currentLanguage = this.languageService.language;
  readonly loading = signal(true);
  readonly error = this.siteActivityService.storageError;
  readonly events = this.siteActivityService.events;

  readonly content = computed(() =>
    this.currentLanguage() === 'es'
      ? {
          eyebrow: 'Actividad del Sitio',
          title: 'Lectura MVP de comportamiento dentro de la SPA',
          lead:
            'Resumen liviano de visitas e interacciones registradas desde este frontend para entender uso real sin agregar una capa externa.',
          loading: 'Cargando actividad del sitio...',
          empty: 'Todavia no hay actividad suficiente para mostrar el panel.',
          totalEventsLabel: 'Eventos totales',
          sectionVisitsLabel: 'Visitas a secciones',
          projectClicksLabel: 'Clicks en proyectos',
          contactOpensLabel: 'Aperturas de contacto',
          toolUsageLabel: 'Uso de herramientas',
          topActionLabel: 'Top accion',
          noData: 'Sin datos',
          distributionTitle: 'Distribuciones simples',
          distributionLead: 'Porcentajes claros para detectar rapido que se usa mas.',
          sectionsTitle: 'Secciones mas visitadas',
          actionsTitle: 'Acciones mas frecuentes',
          interactionsUnit: 'eventos',
        }
      : {
          eyebrow: 'Site Activity',
          title: 'Lightweight SPA behavior snapshot',
          lead:
            'A compact summary of visits and interactions captured in this frontend to understand usage without external analytics tooling.',
          loading: 'Loading site activity...',
          empty: 'There is not enough activity yet to show this panel.',
          totalEventsLabel: 'Total events',
          sectionVisitsLabel: 'Section visits',
          projectClicksLabel: 'Project clicks',
          contactOpensLabel: 'Contact opens',
          toolUsageLabel: 'Tool usage',
          topActionLabel: 'Top action',
          noData: 'No data',
          distributionTitle: 'Simple distributions',
          distributionLead: 'Clear percentages to spot what gets used the most.',
          sectionsTitle: 'Most visited sections',
          actionsTitle: 'Most frequent actions',
          interactionsUnit: 'events',
        },
  );

  readonly analytics = computed(() => this.buildSnapshot(this.events()));
  readonly metricCards = computed(() => {
    const snapshot = this.analytics();

    return [
      {
        label: this.content().totalEventsLabel,
        value: String(snapshot.totalEvents),
        helper: this.content().interactionsUnit,
      },
      {
        label: this.content().sectionVisitsLabel,
        value: String(snapshot.sectionVisits),
        helper: snapshot.sectionDistribution[0]?.label ?? this.content().noData,
      },
      {
        label: this.content().projectClicksLabel,
        value: String(snapshot.projectClicks),
        helper: this.content().interactionsUnit,
      },
      {
        label: this.content().contactOpensLabel,
        value: String(snapshot.contactOpens),
        helper: this.content().interactionsUnit,
      },
      {
        label: this.content().toolUsageLabel,
        value: String(snapshot.toolUsage),
        helper: this.content().interactionsUnit,
      },
      {
        label: this.content().topActionLabel,
        value: snapshot.topAction?.label ?? this.content().noData,
        helper: snapshot.topAction
          ? `${snapshot.topAction.count} - ${snapshot.topAction.percent.toFixed(0)}%`
          : this.content().noData,
      },
    ];
  });

  ngOnInit(): void {
    this.loading.set(false);
  }

  trackByLabel(_: number, item: { label: string }): string {
    return item.label;
  }

  private buildSnapshot(events: SiteActivityEvent[]): ActivitySnapshot {
    const sectionEvents = events.filter((event) => event.type === 'section_view');
    const projectEvents = events.filter((event) => event.type === 'project_interaction');
    const contactEvents = events.filter((event) => event.action === 'open_contact');
    const toolEvents = events.filter(
      (event) => event.type === 'quote_interaction' || event.type === 'estimator_interaction',
    );
    const actionEvents = events.filter((event) => event.type !== 'section_view');

    return {
      totalEvents: events.length,
      sectionVisits: sectionEvents.length,
      projectClicks: projectEvents.length,
      contactOpens: contactEvents.length,
      toolUsage: toolEvents.length,
      topAction: this.buildDistribution(actionEvents)[0] ?? null,
      sectionDistribution: this.buildDistribution(sectionEvents),
      actionDistribution: this.buildDistribution(actionEvents),
    };
  }

  private buildDistribution(events: SiteActivityEvent[]): ActivityDistributionItem[] {
    const buckets = new Map<string, number>();

    for (const event of events) {
      const localizedLabel = this.localizeEventLabel(event);
      buckets.set(localizedLabel, (buckets.get(localizedLabel) ?? 0) + 1);
    }

    return [...buckets.entries()]
      .map(([label, count]) => ({
        label,
        count,
        percent: events.length > 0 ? (count / events.length) * 100 : 0,
      }))
      .sort((left, right) => right.count - left.count || left.label.localeCompare(right.label));
  }

  private localizeEventLabel(event: SiteActivityEvent): string {
    const language = this.currentLanguage();

    if (event.type === 'section_view') {
      return this.localizeRouteLabel(event.route, language);
    }

    switch (event.action) {
      case 'open_contact':
        return language === 'es' ? 'Apertura de contacto' : 'Contact open';
      case 'select_project':
        return language === 'es' ? 'Seleccion de proyecto' : 'Project selection';
      case 'open_project_demo':
        return language === 'es' ? 'Apertura de demo' : 'Demo open';
      case 'preview_quote':
      case 'preview_commercial_quote':
        return language === 'es' ? 'Preview comercial' : 'Commercial quote preview';
      case 'save_commercial_quote':
        return language === 'es' ? 'Guardar cotizacion comercial' : 'Save commercial quote';
      case 'discard_commercial_quote':
        return language === 'es' ? 'Descartar cotizacion comercial' : 'Discard commercial quote';
      case 'new_commercial_quote':
        return language === 'es' ? 'Nueva cotizacion comercial' : 'New commercial quote';
      case 'preview_estimator':
        return language === 'es' ? 'Preview de estimacion' : 'Estimate preview';
      case 'save_estimator':
        return language === 'es' ? 'Guardar estimacion' : 'Save estimate';
      case 'discard_estimator':
        return language === 'es' ? 'Descartar estimacion' : 'Discard estimate';
      case 'new_estimator':
        return language === 'es' ? 'Nueva estimacion' : 'New estimate';
      default:
        return event.label;
    }
  }

  private localizeRouteLabel(route: string | null, language: 'es' | 'en'): string {
    switch (route) {
      case '':
      case '/home':
        return language === 'es' ? 'Inicio' : 'Home';
      case '/projects':
        return language === 'es' ? 'Proyectos' : 'Projects';
      case '/skills':
        return language === 'es' ? 'Skills' : 'Skills';
      case '/credentials':
        return language === 'es' ? 'Credenciales' : 'Credentials';
      case '/contact':
        return language === 'es' ? 'Contacto' : 'Contact';
      case '/control-center':
        return language === 'es' ? 'Centro de Mando' : 'Control Center';
      default:
        return language === 'es' ? 'Seccion desconocida' : 'Unknown section';
    }
  }
}
