# Handoff Control Center

Estado al 2026-05-11.

## 1. Estado actual del proyecto

- Frontend Angular 20 desacoplado en `frontend/`.
- Backend Spring Boot 3.3.5 desacoplado en `backend/`.
- Arquitectura backend consolidada en capas globales y sin `module/*`.
- Backend como source of truth para `Budget Builder`, estimador tecnico, `Mensajeria` y analytics.
- CI vigente para frontend + backend.
- Base de datos: PostgreSQL en local dev y en CI/test. Flyway activo.
- Se adopto SDD liviano para agentes: `docs/agent-operating-model.md` y templates en `docs/templates/` pasan a guiar specs, verificaciones y revisiones adversariales sin traer OpenSpec completo todavia.
- Si una base local vieja rechaza `SECTION_VIEW` u otros eventos nuevos en `event_logs`, reiniciar con la migracion `V6__align_event_logs_event_type_check.sql` aplicada por Flyway.
- Si una base local vieja rechaza `SPAM` o `TRASH` en `contact_messages.status`, reiniciar con la migracion `V10__align_contact_messages_status_check.sql` aplicada por Flyway.
- `develop` ya existe y fue publicada como rama integradora diaria.
- La base funcional mas completa hoy es la linea de `feature/mensajeria`, ya absorbida como base de `develop`.
- La limpieza Git para destrackear artefactos generados de `frontend/` y el `angular.json` legacy de la raiz se integra sobre `develop` via PR dedicado.

## 2. Estado funcional relevante

- `Budget Builder` privado ya opera contra backend oficial para configuracion activa, `preview`, `save`, historial y detalle.
- El backend de `Budget Builder` ya quedo alineado al modelo workbench: `preview` devuelve `technicalSummary`, `areaBreakdown` con modulos anidados, `monthlyBreakdown` para `SAAS` y `client` dentro de request, persistencia y respuestas admin.
- `Budget Builder` ya absorbio buena parte del cotizador historico: reglas comerciales, mantenimiento, stacks oficiales, presets rapidos, planilla por areas y costos por modulo oficiales desde backend.
- El estimador tecnico ya usa backend para `preview` y `save`, con PERT, buffer de riesgo, semanas estimadas y dependencias visibles.
- `Mensajeria` ya no es placeholder: existe inbox admin real, cambio de estado, reply y base de providers `noop|smtp|resend`.
- En `feature/messaging-inbox-client` la inbox admin ya quedo mas parecida a una casilla de correo tipo Outlook: rail lateral, carpetas/filtros, command bar, lista densa, panel de lectura, busqueda local tambien por preview, `messagePreview` oficial desde backend, metadata visible en detalle, reply desplegable, estado real `SPAM` para `No deseado`, estado real `TRASH` para `Papelera` y eliminacion definitiva via `DELETE`, sin abrir paginacion ni busqueda backend.
- En `feature/inbox-ui-polish` la bandeja admin queda mas cerca del comportamiento de email real: `Bandeja de entrada` muestra solo mensajes no leidos (`NEW`), el filtro separado `Nuevos` sale de la UI y un mensaje `NEW` pasa a `READ` automaticamente solo cuando el usuario lo abre manualmente, desapareciendo de entrada y quedando en `Leidos`. La etapa tambien amplia el `Control Center` al ancho visual del header, reemplaza `Modulos privados` por una navegacion mas vistosa, mejora el login admin y rediseña `Contacto > Canales directos` como hub animado de menu social/comentarios con botones circulares, orbitas, pulso central y bubble de detalle.
- `Actualizar` ya dejo de ser placeholder: existe una base editable minima para `projects` desde `Control Center`, con `GET/PATCH /api/admin/projects` y editor operativo de orden/copy/visibilidad.
- En `feature/public-content-cms-foundation-v2`, `Actualizar` suma bloques publicos editables para hero/about/contact/CV: `GET /api/content-blocks`, `GET/PATCH /api/admin/content-blocks`, migracion `V11__public_content_blocks.sql` y consumo con fallback en `About` y `Contact`.
- En `feature/cms-document-links`, los bloques publicos pueden asociar `documentId` y exponer descarga solo via bloque publicado (`GET /api/content-blocks/{key}/{language}/document`), preparando `contact.cv` para dejar de depender de una URL hardcodeada.
- En `feature/cms-document-ux`, `Actualizar` mejora el flujo documental: cada documento puede marcarse con `Usar en bloque`, el bloque CMS permite `Sacar documento`, y la UI aclara que asociar/quitar requiere guardar el bloque para publicar el cambio.
- En `feature/mistral-admin-ai-backend`, el backend incorpora la base admin de IA con Mistral dentro del monolito: `POST /api/admin/ai/translate`, `POST /api/admin/ai/chat`, variables `PORTFOLIO_MISTRAL_*` y llamada server-side sin exponer API key al frontend.
- En `feature/mistral-admin-ai-frontend`, `Actualizar` permite generar automaticamente la version inglesa de un bloque CMS desde su version espanola usando `POST /api/admin/ai/translate`.
- La promocion `#54` llevo la IA admin a `main` y GitHub/Vercel reporto deployment exitoso para `864e282c`; el codigo de `origin/main` contiene `Usar en bloque` y `Generar ingles con IA`, pero las URLs de Vercel consultadas devuelven `401` desde fuera y requieren validacion visual con sesion/alias correcto antes de mergear el release `#51`.
- En `feature/update-cms-loading-resilience`, `Actualizar` deja de esconder Documentos y CMS cuando la carga de proyectos queda pendiente; el editor de proyectos queda con estado propio y los controles CMS/documentales pueden mostrarse aunque `/api/admin/projects` tarde o falle.
- En la misma linea local se preparo la extension de CMS para canales de contacto: bloques `contact.email`, `contact.phone`, `contact.linkedin`, `contact.github` y `contact.cv`; Contact consume esos bloques, se eliminaron textos publicos que no aportaban, el login ya no muestra FERCHUZ como copy visible del modal, y la accion IA del CMS pasa a guardar el bloque actual y traducir al otro idioma.
- En `feature/document-cleanup-cv-resilience`, `Documentos internos` suma baja admin de documentos con `DELETE /api/admin/documents/{id}`. La baja desvincula bloques CMS asociados, borra el archivo fisico si existe y elimina la metadata, para limpiar casos donde `contact.cv` apuntaba a un documento cuyo archivo se perdio en storage.
- En `feature/edit-mode-foundation`, `Actualizar` deja de ser la UX principal del contenido publico: se agrega toggle `EditMode` en navbar para admin autenticado, se alinea el ancho global del sitio con el navbar mediante `--site-shell-width`, y el `Control Center` ya no muestra el modulo `Actualizar`.
- `document-storage-foundation` ya deja una base minima de persistencia documental: existen `GET/POST /api/admin/documents`, metadata persistida en PostgreSQL, storage local configurable, `purpose` minimo por documento, validacion explicita de tipos/tamano, `StorageService` dentro del monolito y uploader/listado minimo dentro de `Control Center > Actualizar`.
- Ya existe una base reproducible de CD/deploy: Dockerfiles para frontend/backend, compose de despliegue, perfil `prod` backend y workflow `CD` para construir bundle de deploy sobre `main` o manualmente.
- El `Budget Builder` ya quedo usable tambien a nivel funcional frontend: fallbacks de configuracion, modulos base, estimador visible, validacion minima para `save` y rail derecho sin superposiciones.
- `Skills` ya agrega un toggle visible `Ver todas / Skills` para alternar entre la animacion actual por lanes y una vista expandida con cards compactas agrupadas por categoria.
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
- Faltan conectar `Skills` y credenciales al CMS, mejorar UX de documentos por `purpose`, abrir descarga controlada con auditoria/token si hace falta, notas/uploads internos, `Paginas amigas`, PWA e integracion futura de bot/asistente.
- `GestionAsistente` de OBRASMART queda como referencia funcional para bot/IA, pero el portfolio mantiene por ahora la integracion IA dentro del backend monolitico.
- La build sigue cargando warnings de budgets en Angular aunque el flujo general ya compila.
- `release-please` ya pudo generar PRs limpios despues de corregir `changelog-path`: `#42` publico `frontend 0.1.0` / `backend 0.3.0` y `#46` publica `frontend 0.2.0` / `backend 0.4.0`, siempre con changelogs en rutas correctas.
- Despues de mergear un PR de `release-please` hacia `main`, sincronizar siempre esa metadata de release de vuelta a `develop` antes de abrir features nuevas o promover de nuevo.
- Los previews de Vercel usan `frontend/vercel.json` y reescriben `/api` hacia el backend productivo de Render. Si el frontend de un PR usa campos backend nuevos, el guardado real puede fallar/no persistir hasta que `main` y el backend productivo esten desplegados con esa API.
- El deployment GitHub/Vercel de `main` para `864e282c` figura en `success`, pero `webfetch` recibe `401` tanto en la URL reportada por el usuario como en la URL target del deployment; validar desde navegador autenticado o alias publico antes de asumir que produccion visual esta actualizada.
- La captura `actualizar2.jpg` no muestra frontend viejo sino `Actualizar` bloqueado en `Cargando proyectos...`; la causa de UX era que Documentos y CMS estaban anidados bajo `*ngIf="selectedProject()"`.
- El modelo actual de proyectos sigue siendo monolingue en backend; para resolver bien ES/EN en proyectos se necesita una etapa dedicada de contenido bilingue de proyectos. Como mitigacion inmediata, se prepara una migracion que corrige los summaries semilla en espanol para no mostrar ingles en la vista ES.
- El error `Linked document file not found` en `/api/content-blocks/contact.cv/es/document` significa metadata enlazada pero archivo fisico ausente. La correccion de UI/backend permite limpiar esa metadata, pero el fix operativo definitivo sigue requiriendo storage persistente en Render y re-subir/asociar el CV.
- `EditMode` debe reemplazar gradualmente `Actualizar`; Skills no deberia ofrecer borrado definitivo como accion normal, sino ocultar/despublicar.

## 5. Proximos pasos recomendados

- Trabajar desde `develop` con ramas cortas por alcance.
- Antes de features o bugs no triviales, usar el modelo SDD de `docs/agent-operating-model.md` y dejar criterios de aceptacion verificables.
- Mantener `docs/continuity-roadmap.md` como documento vivo de roadmap maestro.
- Sincronizar la metadata de release `frontend 0.2.0` / `backend 0.4.0` de vuelta a `develop` antes de abrir la siguiente feature.
- Mantener la nueva vista expandida de `Skills` como mejora frontend-only ya integrada, sin reintroducir logica en backend para esta etapa.
- Mantener `feature/inbox-ui-polish` como etapa ya integrada; los ajustes nuevos de inbox deben continuar desde ramas cortas nacidas en `develop`.
- Mantener `feature/messaging-inbox-client` como etapa ya absorbida en `develop`; los ajustes nuevos de inbox deben continuar desde ramas cortas nacidas en `develop`.
- En deploy productivo, revalidar entrega real de email de `Mensajeria` con provider activo, secretos, `PORTFOLIO_ALLOWED_ORIGINS`, `PORTFOLIO_CONTACT_FROM` y dominio/remitente verificado.
- Validar con entorno Java operativo la nueva base `GET/POST /api/admin/documents`, incluyendo `purpose`, validacion de tipos/tamano y uploader/listado admin en `Actualizar`.
- Cerrar `feature/mistral-admin-ai-frontend` con PR hacia `develop`; despues promover `develop` a `main` y configurar `PORTFOLIO_MISTRAL_ENABLED=true` + `PORTFOLIO_MISTRAL_API_KEY` en Render para activar traduccion real.
- Cuando `develop` acumule una integracion estable, abrir PR de `develop` hacia `main` y esperar CI/CD verde antes de mergear.
- Antes de mergear cualquier PR automatico de `release-please`, verificar que los changelogs sean `frontend/CHANGELOG.md` y `backend/CHANGELOG.md`, sin rutas duplicadas; despues devolver manifest/changelogs/versiones a `develop`.
- No mergear `#51 chore: release main` hasta confirmar visualmente que `Control Center > Actualizar` en el deployment correcto muestra `Usar en bloque` y `Generar ingles con IA`.
- Integrar la correccion de resiliencia de carga de `Actualizar` si se confirma que Vercel puede quedar temporalmente en estado de proyectos pendientes.
- Abrir una rama dedicada para `EditMode` visual: boton protegido por login, estado verde/rojo, vista publica intacta cuando esta desactivado y edicion contextual por seccion cuando esta activado. No mezclarlo con fixes de CMS/IA para evitar ampliar demasiado el alcance.
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
