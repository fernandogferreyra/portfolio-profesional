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
- En la misma rama, la foundation visual se ajusta: el toggle informa `EditMode Enabled`/`EditMode Disabled`, el navbar suma `Formacion y certificaciones` entre `Skills` y `Contacto`, el acceso privado visible se renombra a `Panel de control`, el panel privado usa sidebar sticky mas estable y el cotizador recibe una piel mas cercana a herramienta/formulario de escritorio.
- Validacion de esta pasada UX: `npx tsc -p tsconfig.app.json --noEmit` OK, `npx tsc -p tsconfig.spec.json --noEmit` OK, `git diff --check` sin errores; `npm run build` bloqueado localmente por binario `@esbuild/win32-x64` en WSL.
- La misma linea ahora implementa la primera edicion real de credenciales: tabla `credentials`, `GET /api/credentials`, `GET /api/credentials/{id}/document`, `GET/POST/PATCH /api/admin/credentials`, UI inline en `/credentials` con `Nuevo`, edicion de tipo/titulo/institucion/descripcion/orden/publicacion, subida/asociacion de documentacion y Home mostrando titulos reales cargados.
- Validacion credentials: `npx tsc -p tsconfig.app.json --noEmit` OK, `npx tsc -p tsconfig.spec.json --noEmit` OK, `mvnw.cmd -DskipTests clean test-compile` OK, `git diff --check` sin errores; `mvnw.cmd test` bloqueado localmente por Docker/Testcontainers no disponible.
- Fix visual credentials: cuando una credencial tiene `documentUrl`, `/credentials` ahora muestra una vista previa embebida del documento y mantiene el boton `Abrir documentacion`; antes solo habia enlace visible y el area no mostraba preview. Para evitar el bloqueo `localhost ha rechazado la conexion`, el backend envia `X-Frame-Options: SAMEORIGIN`, permitiendo embed solo desde el mismo origen.
- `Contacto > Canales directos` ya tiene primera edicion contextual con `EditMode`: permite editar bloques `contact.email`, `contact.phone`, `contact.linkedin`, `contact.github` y `contact.cv` desde la pagina publica, y subir/reemplazar CV usando la base documental admin existente.
- `Proyectos` ya tiene edicion contextual con `EditMode`: carga `GET /api/admin/projects`, muestra editor inline del proyecto seleccionado y guarda slug, nombre, ano, categoria, resumen, stack, repo, orden, destacado/publicado via `PATCH /api/admin/projects/{id}`. La asociacion del editor queda por `id` admin para no perder el panel si se edita el slug antes de guardar.
- `Proyectos` ahora normaliza parametros por aplicacion: `demoUrl`, `repositoryUrl`, `monographUrl`, `iconDocumentId` e `iconUrl`. La UI publica genera acciones `Ver demo`, `Codigo`, `Monografia` desde backend, por lo que `Portfolio Profesional` ya no queda con acciones genericas como `Ir a contacto`. Los iconos PNG/ICO se suben por documentos admin con `purpose=project-icon` y se sirven solo por `/api/projects/{slug}/icon` si el proyecto esta publicado; `/api/projects/**` queda permitida publicamente en seguridad para que iconos/documentos asociados no devuelvan `401`.
- `Proyectos` tambien deja editables las zonas de detalle que seguian estaticas: metricas, secciones, puntos destacados, documentacion multiple y capturas/fotos multiples. La etiqueta del panel derecho pasa a `Demo <nombre>`, las acciones publicas quedan como `Ver demo`, `Repositorio` y `Documentacion`, y los documentos/capturas asociados se sirven por `/api/projects/{slug}/documents/{documentId}` solo si el proyecto esta publicado.
- Ajuste UX final de `Proyectos`: metricas repetidas dejan de renderizarse publicamente, pero las secciones `Problema`, `Solucion`, `Arquitectura`, etc. se mantienen en el detalle y en `EditMode` se editan separadas por titulo/items. `Puntos destacados` queda como bloque editorial principal. El selector superior ya no repite chips de stack ni cards grandes; muestra iconos/wordmarks animados grandes con nombre debajo para cambiar el proyecto activo, con mark default si falta icono subido. El panel derecho mantiene el reproductor YouTube inline cuando hay demo, no usa thumbnails de YouTube como captura, elimina el bloque duplicado de logo/nombre debajo del demo y deja el carrusel horizontal solo si existen capturas reales. El label `Ano` pasa a `Año`, el stack queda en el detalle como cards verticales con iconos grandes consistentes y la navegacion activa suma brillo neon en la fuente.
- En `feature/edit-mode-skills-home`, `Inicio` y `Skills` dependen de CMS contextual: migracion `V18` siembra bloques `home.*`, `skills.hero` y `skill.<id>` en ES/EN; Home consume hero/about/base tecnica desde CMS con fallback local, permite crear nuevas experiencias tecnicas `home.technical.*`, deriva `Stack y enfoque` desde skills publicadas y ya no duplica credenciales porque quedan solo en `Formacion y certificaciones`; Skills consume copy/tags/publicacion desde CMS, permite agregar/quitar tags y ocultar skills con `published=false` en `EditMode` sin borrado definitivo. Se agrego `POST /api/admin/content-blocks` para alta admin generica de bloques CMS, preview admin de documentos de credenciales en borrador con `GET /api/admin/credentials/{id}/document` consumido como Blob autenticado desde Angular, y alta/baja admin de proyectos con confirmacion en UI antes de eliminar. La preview de credenciales intenta imagen primero y cae a iframe solo si falla, evitando depender del `content-type`. Tambien se agrego `.opencode/agent/modo-edicion.md` para reutilizar el patron en futuros sitios. Validacion local: typechecks frontend OK, `npm test` OK con `45 SUCCESS`, `npm run build:ci` OK con warnings de budget, backend `mvnw.cmd -DskipTests clean package` OK y package rapido OK tras el ajuste Blob.
- Fix operativo local previo: el backend caia por `Flyway checksum mismatch` en `V16__projects_editable_detail_assets.sql` porque la migracion ya aplicada se habia modificado. Se restauro `V16` y el ajuste posterior paso por `V17__projects_highlights_without_public_metrics.sql`. En esa pasada, `mvnw.cmd spring-boot:run -Dspring-boot.run.profiles=dev` valido 18 migraciones, aplico `V17` y Tomcat arranco en `8080`.
- Cierre operativo de la rama: el workflow `CI` ya corre tambien en `develop` y en PRs hacia `develop`; `.gitignore` evita trackear storage runtime local en `runtime/` y `backend/runtime/`, y mantiene `.vscode/settings.json` como configuracion local no versionada.
- Cierre CI pre-commit de la rama: el spec de `HomeComponent` se ajusto para mockear `CredentialService`, `frontend/angular.json` sube el budget de error `anyComponentStyle` a `16kB`, `npm test -- --watch=false --browsers=ChromeHeadless` queda OK con `42 SUCCESS` y `npm run build:ci` queda OK con warnings de budget. Backend empaqueta OK con `mvnw.cmd -DskipTests package`; la suite completa `mvnw.cmd test` sigue bloqueada localmente por Docker/Testcontainers no disponible. El primer CI backend del PR fallo porque `adminCanReadAndUpdateProjects` actualizaba el `demoUrl` semilla y contaminaba `projectsEndpointReturnsMockData`; el test admin se ajusto para preservar los links semilla antes de republicar.
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
- Faltan completar revision visual de `Inicio`/`Skills` con `EditMode`, mejorar UX de documentos por `purpose`, abrir descarga controlada con auditoria/token si hace falta, notas/uploads internos, `Paginas amigas`, PWA e integracion futura de bot/asistente.
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
- Los errores locales de IDE/backend vistos en capturas, incluido `ContactMessageRepository cannot be resolved to a type`, no reproducen en CLI: `mvnw.cmd -DskipTests clean test-compile` desde `backend/` con JDK 17 recompila main/test y termina `BUILD SUCCESS`. Tratarlo como indexacion/build path del IDE antes de tocar codigo o dependencias.
- Los archivos subidos en pruebas locales deben permanecer fuera de Git: `runtime/` y `backend/runtime/` son artefactos de storage local, no fuente versionada ni fixture oficial.

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
- Para los errores locales del IDE, refrescar/reimportar Maven con JDK 17 configurado; si aparece bloqueo de `backend/target`, cerrar IDE/procesos Java y ejecutar `backend\scripts\repair-maven-target.ps1 -Verify`.
- Revisar visualmente en desktop/mobile los ajustes de navbar, sidebar del panel privado y cotizador antes de mergear `#60`.
- Revisar visualmente `/credentials` en desktop/mobile con `EditMode Enabled`, crear un item, completar titulo/institucion/descripcion, subir documentacion y confirmar que Home muestra el titulo cargado.
- En esa revision visual, confirmar que la preview embebida del documento se ve en la card y que `Abrir documentacion` sigue abriendo el archivo en otra pestana.
- Revisar visualmente `Contacto` con `EditMode Enabled`: guardar email/LinkedIn/GitHub/telefono, subir CV y confirmar que los nodos publicos reflejan los cambios.
- Revisar visualmente `Proyectos` con `EditMode Enabled`: editar slug/nombre/summary/stack/repo/orden/publicacion, guardar y confirmar persistencia/reflejo en la vista publica.
- Revisar visualmente la normalizacion de `Proyectos`: cargar demo YouTube, repo, monografia e icono PNG/ICO, guardar y confirmar que cada card muestra icono propio y acciones `Ver demo`, `Codigo`, `Monografia` sin links genericos.
- Revisar visualmente `Inicio`, `Skills`, `Formacion y certificaciones` y `Proyectos` con `EditMode Enabled`: editar hero/about, crear una experiencia tecnica, agregar/quitar detalles/tags, ocultar una skill, subir documento en una credencial borrador y crear/eliminar proyecto confirmando que `Stack y enfoque` se deriva de skills y que credenciales solo aparecen en su pagina dedicada.
- Revisar visualmente desktop/mobile que los editores contextuales de `Inicio` y `Skills` no rompan la composicion publica cuando `EditMode` esta desactivado.
- Si aparecen `ECONNREFUSED` o `500` masivos en `/api/*` desde Vite, verificar primero que el backend este levantado con perfil `dev`; no tocar Contacto/Formaciones si el backend no arranca.
- Si aparece `401` en `icon` o assets de proyectos, revisar que este desplegado el fix de `SecurityConfiguration` con `/api/projects/**` publico; si pasa a `404`, el problema ya es asociacion/storage del documento.
- Validar en CI/Testcontainers la migracion `V14__credentials_catalog.sql` y los endpoints de credenciales antes de promocionar a `main`.
- Confirmar que un PR hacia `develop` dispara el workflow `CI` actualizado antes de usarlo como check obligatorio de integracion diaria.
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
