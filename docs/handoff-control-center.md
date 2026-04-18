# Handoff Control Center

Estado al 2026-04-18.

## 1. Estado actual del proyecto

- Frontend Angular 20 desacoplado en `frontend/`.
- Backend Spring Boot 3.3.5 desacoplado en `backend/`.
- Arquitectura backend consolidada en capas globales y sin `module/*`.
- Backend como source of truth para `Budget Builder`, estimador tecnico, `Mensajeria` y analytics.
- CI vigente para frontend + backend.
- Base de datos: PostgreSQL en local dev y en CI/test. Flyway activo.
- Si una base local vieja rechaza `SECTION_VIEW` u otros eventos nuevos en `event_logs`, reiniciar con la migracion `V6__align_event_logs_event_type_check.sql` aplicada por Flyway.
- `develop` ya existe y fue publicada como rama integradora diaria.
- La base funcional mas completa hoy es la linea de `feature/mensajeria`, ya absorbida como base de `develop`.
- La limpieza Git para destrackear artefactos generados de `frontend/` y el `angular.json` legacy de la raiz se integra sobre `develop` via PR dedicado.

## 2. Estado funcional relevante

- `Budget Builder` privado ya opera contra backend oficial para configuracion activa, `preview`, `save`, historial y detalle.
- El backend de `Budget Builder` ya quedo alineado al modelo workbench: `preview` devuelve `technicalSummary`, `areaBreakdown` con modulos anidados, `monthlyBreakdown` para `SAAS` y `client` dentro de request, persistencia y respuestas admin.
- `Budget Builder` ya absorbio buena parte del cotizador historico: reglas comerciales, mantenimiento, stacks oficiales, presets rapidos, planilla por areas y costos por modulo oficiales desde backend.
- El estimador tecnico ya usa backend para `preview` y `save`, con PERT, buffer de riesgo, semanas estimadas y dependencias visibles.
- `Mensajeria` ya no es placeholder: existe inbox admin real, cambio de estado, reply y base de providers `noop|smtp|resend`.
- El `Budget Builder` ya quedo usable tambien a nivel funcional frontend: fallbacks de configuracion, modulos base, estimador visible, validacion minima para `save` y rail derecho sin superposiciones.
- `Site Activity` ya es backend-first.
- El portfolio publico sigue operativo y `ProjectsComponent` ya puede consumir `GET /api/projects`.

## 2.1 Direccion UI vigente para Presupuesto

- La direccion correcta ya no es dashboard con cards ni wizard largo.
- La siguiente etapa frontend debe implementar una sola pantalla tipo planilla/workbench.
- Layout objetivo:
  - izquierda: configuracion / planilla por secciones
  - derecha: resultado vivo
- El resumen vivo debe apoyarse en el contrato backend ya mergeado:
  - `technicalSummary` para resumen tecnico
  - `areaBreakdown` para negociacion principal por areas
  - `monthlyBreakdown` para lectura `SAAS`

## 3. Decisiones tecnicas importantes

- Frontend vive solo en `frontend/` y mantiene consumo relativo de `/api`.
- Backend vive solo en `backend/` y no debe reintroducir `module/*`.
- La logica critica no debe volver al frontend.
- Estrategia Git adoptada:
  - `develop` es la rama integradora diaria.
  - Las nuevas ramas deben nacer desde `develop`.
  - Los PRs normales van hacia `develop`.
  - `main` recibe solo PRs desde `develop` cuando se quiera integrar una version estable.

## 4. Problemas detectados y deudas tecnicas

- Parte del historial reciente sigue repartido en ramas historicas, de backup o de higiene que deberian limpiarse cuando ya no aporten nada.
- El commit local mas nuevo heredado de `feature/mensajeria` tiene un mensaje que no refleja bien su contenido real de email/configuracion.
- Faltan UX mas clara de `Mensajeria`, CMS editable del sitio publico, persistencia documental, notas/uploads, `Paginas amigas`, PWA, docker/deploy e integracion futura de bot/asistente.
- La build sigue cargando warnings de budgets en Angular aunque el flujo general ya compila.
- `release-please` ya esta configurado, pero todavia no debe considerarse el motor central del flujo diario hasta que el camino `develop -> main` quede mas rutinario.

## 5. Proximos pasos recomendados

- Trabajar desde `develop` con ramas cortas por alcance.
- Mantener `docs/continuity-roadmap.md` como documento vivo de roadmap maestro.
- Proxima etapa recomendada: `feature/messages-inbox-ux`.
- Despues abrir la base editable del sitio publico y la persistencia documental.
- Cuando `develop` acumule una integracion estable, abrir PR de `develop` hacia `main`.
- Borrar ramas de backup, higiene o features absorbidas una vez que ya no agreguen valor.

## 6. CI y validacion

- Frontend:
  - `npm run build`
  - `npm test -- --watch=false --browsers=ChromeHeadless`
- Backend:
  - `mvnw.cmd test` en Windows o wrapper equivalente con entorno valido
  - `mvnw.cmd package`
- Revisar CI verde antes de mergear a `develop` o `main`.

## 7. Que no romper

- No reintroducir `module/*`.
- No mover logica critica al frontend.
- No romper el contrato admin `ROLE_FERCHUZ`.
- No hardcodear URLs absolutas al backend en frontend; mantener `/api`.
- No mezclar de nuevo cotizador comercial y estimador tecnico.
- No abrir ramas nuevas desde ramas historicas si `develop` ya existe.
