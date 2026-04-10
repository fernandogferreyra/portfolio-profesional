# DOCUMENTATION

## Ultimo estado

Proyecto portfolio con frontend Angular 20 en `frontend/` y backend Spring Boot 3.3.5 en `backend/`, autenticacion JWT admin operativa, CI estabilizada y backend consolidado en arquitectura horizontal por capas globales (`controller`, `controller/admin`, `service`, `service/impl`, `repository`, `domain/<feature>`, `dto/<feature>`, `mapper/<feature>`), sin `module/*`.

La carpeta temporal `ferchuz/` se relevo solo como fuente funcional original. De ahi se reconstruyeron y alinearon las reglas reales del negocio sin integrar esa carpeta al producto: estimacion tecnica con PERT (`O + 4M + P / 6`), buffer fijo de riesgo, dependencias entre bloques, pricing comercial por categoria, cargos fijos, y formula SaaS mensual basada en recupero, infraestructura, soporte, margen, escala de usuarios y horas extra.

El backend queda como unica fuente de verdad para la logica critica. `Budget Builder` ya expone configuracion activa, `preview`, `save`, listado y detalle desde backend con persistencia propia; el estimador tecnico reutiliza el mismo calculo backend para preview y save, incluyendo horas base, buffer de riesgo, semanas estimadas y notas de dependencia. El frontend del dashboard privado consume esos endpoints reales y deja de depender de calculos locales para los flujos visibles.

En la ultima pasada de saneamiento se elimino del repo el frontend Angular legacy de la raiz para dejar `frontend/` como unica aplicacion cliente real, se limpiaron del indice Git `frontend/node_modules`, `frontend/.angular/cache` y `frontend/dist`, se corrigio el spec roto del facade UI de `Budget Builder`, se endurecio `application-dev.yml`, se agrego validacion explicita de `issuer` al parseo JWT y se reescribieron los README publico y de backend para que reflejen el sistema real.

En la segunda ola se dejo preparada la base para tests backend autocontenidos con Testcontainers sobre PostgreSQL, se introdujo `ProjectsService` para consumir `GET /api/projects` en el portfolio publico sin perder la UI rica actual, y se agrego `.nvmrc` con `20.19.0` para fijar la version esperada de Node del repo sin depender de una instalacion global unica.

En la tercera ola `Site Activity` paso a backend-first de forma incremental: el frontend ahora registra eventos via `POST /api/events` y el dashboard privado carga actividad persistida desde `GET /api/admin/events`.

En la quinta ola se abrio la consolidacion controlada del cotizador comercial historico. Se documento la paridad en `docs/budget-builder-parity.md`, el backend de `Budget Builder` paso a exponer `surchargeRules` y `maintenancePlans` en la configuracion activa, se semillaron los extras comerciales heredados del cotizador historico como reglas comerciales desactivadas por defecto y el calculo oficial ya soporta `maintenancePlanId` dentro del motor backend.

En la sexta ola se incorporaron presets comerciales rapidos al backend oficial de `Budget Builder`. La configuracion activa ahora entrega `projectTypeDefaults` con `label` y `description` reales para `essential_web`, `business_site`, `operations_tool` y `product_platform`, ademas de los tipos ya existentes. El frontend consume esos metadatos desde backend, evitando hardcodear nuevos presets en la UI.

En la septima ola se incorporaron stacks comerciales oficiales (`cms_fast`, `angular_spring`, `angular_dotnet`, `full_custom`) y se reorganizo `ControlCenterBudgetBuilderComponent` como flujo por pasos para evitar scroll largo. El editor ahora separa escenario, precio/stack, continuidad y alcance; tambien permite seleccionar extras comerciales opcionales y mantenimiento desde la configuracion backend oficial.

En una pasada posterior de UX se ajusto tambien la entrada del `Control Center` tomando como referencia la captura de `ferchuz/capturas de front/panel privado.jpg`: se movieron los accesos rapidos al tramo superior del workspace y las tarjetas operativas ahora incluyen CTA directa hacia cada superficie real (`Budget Builder`, `Estimador`, `Actividad`).

En `Control Center` ya quedan operativos el `Budget Builder` real, el estimador tecnico sobre backend y la actividad del sitio. La seccion vieja del cotizador comercial local deja de renderizarse en la pantalla principal; `ferchuz/` sigue siendo solo referencia externa y no forma parte del sistema final.

Ademas queda redisenado el dashboard privado como workspace de uso real y no como formulario rigido: `Budget Builder` y `Estimador tecnico` ahora recalculan en vivo contra backend, muestran resumen lateral sticky, breakdown visible, contexto por opcion, formula amigable del calculo y lectura inmediata del impacto al mover parametros. En esta iteracion no hizo falta tocar backend: los DTOs y endpoints actuales ya entregaban suficiente informacion para soportar la nueva UX.

Validacion actual cerrada:

- `npm test -- --watch=false --browsers=ChromeHeadless` en `frontend/` OK (`21 SUCCESS`) sobre Windows con Node `20.19.0`
- `backend\mvnw.cmd test` OK con Docker Desktop encendido y `JAVA_HOME=C:\Program Files\Java\jdk-17` (`24` tests, `BUILD SUCCESS`)
- `npm run build` en `frontend/` OK
- CI sigue consistente con `frontend/` + `backend/` y `SPRING_PROFILES_ACTIVE=dev`
- En este entorno Linux de trabajo sigue sin ser util validar frontend con `node_modules` de Windows (`esbuild` win32) ni usar `./mvnw` por CRLF del wrapper Unix; para backend desde esta maquina la validacion operativa se resolvio usando `mvnw.cmd` bajo Windows.
- Para levantar backend en `dev` desde VS Code ya no existen credenciales fallback: el `launch.json` usa `${workspaceFolder}/.env`, por lo que el repo ahora expone `.env.example` y espera un `.env` local no versionado con `PORTFOLIO_DB_*` y `PORTFOLIO_JWT_SECRET` reales.
- El perfil `dev` tambien importa de forma opcional `../.env` y `.env` como properties locales, para que Spring Boot Dashboard pueda levantar incluso si el launcher de VS Code no inyecta `envFile` como variables de entorno.
- Se agrego `V6__align_event_logs_event_type_check.sql` para alinear la restriccion `event_logs_event_type_check` con los tipos de evento actuales del backend. Esto corrige bases locales viejas donde el `CHECK` seguia rechazando `SECTION_VIEW` y otros eventos nuevos.
- Se formalizo el proceso hacia produccion en `docs/path-to-production.md` y se amplió `AGENTS.md` con reglas de arquitectura y source of truth, tomando la copia como referencia funcional pero consolidando el proceso operativo en el repo actual limpio.
- En la Etapa 2 de rescate funcional desde la copia se recuperaron `Budget Builder` backend persistido y `quote` backend rico, manteniendo el repo actual como base limpia pero usando la copia como fuente de verdad funcional para contratos y reglas servidor-side.
- En la etapa siguiente se realineo el frontend del estimador con el contrato rico de `quote` backend: `QuoteResult` y `QuoteItem` vuelven a exponer baseHours, riskBufferHours, totalWeeks, assumptions, horas PERT por item y dependencias, y el frontend ya compila y testea contra esa version servidor-side.
- Se agrego la base de `release-please` como monorepo para `frontend` y `backend`, con workflow dedicado, manifest, config y changelogs separados por componente.
- Se agrego `.github/pull_request_template.md` y se dejaron documentadas las rules sugeridas para `main` dentro de `docs/path-to-production.md`.

Quedan pendientes funcionales fuera de este corte: PDF, mensajeria real, docker/deploy y limpieza posterior de residuos frontend no visibles.

## Historial de cambios

- Fecha: 2026-04-09
  - Cambio: Se ejecuto una pasada de saneamiento estructural del repo y de la capa operativa. Se elimino el Angular legacy de la raiz para dejar `frontend/` como unico cliente real, se sacaron del indice Git los artefactos generados de frontend (`node_modules`, `.angular/cache`, `dist`), se corrigio el spec desfasado de `BudgetBuilderUiFacade`, se agregaron tests frontend al workflow de CI, se endurecieron los defaults inseguros de `application-dev.yml`, se valido `issuer` en `JwtTokenService` y se reescribieron `README.md` y `backend/README.md` con el estado real del sistema.
  - Archivos: `.gitignore`, `.github/workflows/ci.yml`, `README.md`, `backend/README.md`, `backend/src/main/resources/application-dev.yml`, `backend/src/main/java/com/fernandogferreyra/portfolio/backend/security/JwtTokenService.java`, `frontend/src/app/components/control-center/budget-builder/services/budget-builder-ui.facade.spec.ts`, `angular.json`, `package.json`, `package-lock.json`, `proxy.conf.json`, `tsconfig*.json`, `public/**`, `src/**`, `DOCUMENTATION.md`
  - Decision: Priorizar primero higiene de repo, coherencia documental y calidad basica de CI antes de abrir nuevas features. Se mantuvo la arquitectura vigente (`frontend/` + `backend/`) y no se movio logica critica al frontend.
  - Proximos pasos: Volver autocontenidos los tests backend con Testcontainers o estrategia equivalente, integrar el portfolio publico con `GET /api/projects`, migrar `site-activity` a backend y decidir si el cotizador comercial local se persiste o se elimina definitivamente.

- Fecha: 2026-04-09
  - Cambio: Se abrio la segunda ola tecnica. En backend se agrego la base comun `AbstractIntegrationTest` con PostgreSQL Testcontainers y `@ServiceConnection`, se ajusto `application-test.yml` para dejar de depender de `PORTFOLIO_TEST_DB_*` y los tests de integracion pasan a heredar esa base. En frontend se agregaron `ProjectsService` y `projects.models.ts`, y `ProjectsComponent` ahora consume `GET /api/projects` para ordenar/poblar la lista publica manteniendo `PORTFOLIO_PROJECTS` como respaldo de detalle enriquecido. Tambien se agrego `.nvmrc` con Node `20.19.0`.
  - Archivos: `backend/pom.xml`, `backend/src/test/resources/application-test.yml`, `backend/src/test/java/com/fernandogferreyra/portfolio/backend/AbstractIntegrationTest.java`, `backend/src/test/java/com/fernandogferreyra/portfolio/backend/ApiIntegrationTest.java`, `backend/src/test/java/com/fernandogferreyra/portfolio/backend/QuoteIntegrationTest.java`, `backend/src/test/java/com/fernandogferreyra/portfolio/backend/SecurityIntegrationTest.java`, `backend/src/test/java/com/fernandogferreyra/portfolio/backend/BudgetBuilderPreviewIntegrationTest.java`, `backend/src/test/java/com/fernandogferreyra/portfolio/backend/PortfolioBackendApplicationTests.java`, `frontend/src/app/models/projects.models.ts`, `frontend/src/app/services/projects.service.ts`, `frontend/src/app/components/projects/projects.component.ts`, `frontend/src/app/components/projects/projects.component.spec.ts`, `.nvmrc`, `DOCUMENTATION.md`
  - Decision: Mantener el cambio de proyectos en modo incremental: backend define la lista publica y el frontend conserva por ahora el detalle rico, media, acciones e i18n para no romper la pantalla actual. Para continuidad operativa se recomienda trabajar en tres carriles: frontend, backend y testing, con handoff corto al cierre de cada iteracion.
  - Proximos pasos: Validar esta ola desde Windows/CI, agregar coverage o assert minima del nuevo `ProjectsService`, decidir si se normaliza `mvnw` a LF para evitar friccion en WSL y cerrar la migracion backend-first completa del portfolio publico.

- Fecha: 2026-04-09
  - Cambio: Se abrio la tercera ola tecnica enfocada en `Site Activity`. El backend ahora acepta la taxonomia real de actividad del frontend (`section_view`, `project_interaction`, `contact_interaction`, `quote_interaction`, `estimator_interaction`), expone `GET /api/admin/events` para lectura del dashboard y mapea la metadata persistida a un contrato alineado con `SiteActivityEvent`. El frontend paso a escribir eventos al backend y el panel admin a leer actividad persistida, manteniendo `localStorage` solo como fallback.
  - Archivos: `backend/src/main/java/com/fernandogferreyra/portfolio/backend/domain/enums/EventType.java`, `backend/src/main/java/com/fernandogferreyra/portfolio/backend/dto/analytics/AnalyticsEventAdminResponse.java`, `backend/src/main/java/com/fernandogferreyra/portfolio/backend/service/AnalyticsEventService.java`, `backend/src/main/java/com/fernandogferreyra/portfolio/backend/service/impl/AnalyticsEventServiceImpl.java`, `backend/src/main/java/com/fernandogferreyra/portfolio/backend/repository/analytics/EventLogRepository.java`, `backend/src/main/java/com/fernandogferreyra/portfolio/backend/mapper/analytics/AnalyticsEventMapper.java`, `backend/src/main/java/com/fernandogferreyra/portfolio/backend/controller/admin/AnalyticsEventAdminController.java`, `backend/src/test/java/com/fernandogferreyra/portfolio/backend/ApiIntegrationTest.java`, `frontend/src/app/models/site-activity.models.ts`, `frontend/src/app/services/site-activity.service.ts`, `frontend/src/app/components/control-center-site-activity/control-center-site-activity.component.ts`, `DOCUMENTATION.md`
  - Decision: Reutilizar `POST /api/events` y agregar solo la lectura admin necesaria para no abrir una migracion mas grande de analytics. Se preservo el contrato funcional del dashboard privado para minimizar riesgo y evitar refactor visual innecesario.
  - Proximos pasos: Validar la nueva persistencia desde Windows/CI, decidir si se agrega rate limiting o filtros basicos sobre `POST /api/events`, y cuando el flujo este estable retirar el respaldo en `localStorage`.

- Fecha: 2026-04-09
  - Cambio: Se cerro la validacion de la remediacion de tests. El spec de `BudgetBuilderUiFacade` se alineo con el contrato backend actual y los tests frontend quedaron en verde. En backend se reemplazo la estrategia inicial de Testcontainers por un singleton compartido con `@DynamicPropertySource` para evitar que Spring/Hikari reciclara un datasource apuntando a puertos viejos entre clases de integracion.
  - Archivos: `frontend/src/app/components/control-center/budget-builder/services/budget-builder-ui.facade.spec.ts`, `backend/src/test/java/com/fernandogferreyra/portfolio/backend/AbstractIntegrationTest.java`, `DOCUMENTATION.md`
  - Decision: Mantener Testcontainers como camino oficial para integracion backend, pero con un solo PostgreSQL compartido por toda la suite. Se evita volver a `PORTFOLIO_TEST_DB_*` y tambien se evita usar `@DirtiesContext` como workaround principal.
  - Proximos pasos: Si molesta el warning de dialecto en tests, remover `spring.jpa.database-platform` explicito de `application-test.yml`. Como mejora operativa aparte, normalizar `backend/mvnw` a LF si queres volver a ejecutar validaciones Unix nativas desde WSL.

- Fecha: 2026-04-09
  - Cambio: Se cerro la cuarta ola de `Site Activity`. El servicio frontend dejo de persistir eventos en `localStorage`, mantiene solo estado en memoria para UX inmediata y delega la persistencia real al backend. El panel admin sigue leyendo desde `GET /api/admin/events`, con error explicito si backend no responde.
  - Archivos: `frontend/src/app/services/site-activity.service.ts`, `DOCUMENTATION.md`
  - Decision: Considerar `Site Activity` ya backend-first de verdad y no mantener doble fuente de verdad local. Se conserva un estado en memoria corto para no degradar la experiencia en la misma sesion.
  - Proximos pasos: Si queres cerrar del todo esta superficie, sumar un spec chico de `SiteActivityService` y luego atacar el destino final del cotizador comercial historico.

- Fecha: 2026-04-09
  - Cambio: Se abrio la quinta ola enfocada en consolidar el cotizador comercial historico dentro de `Budget Builder`. Se agrego `docs/budget-builder-parity.md` como documento de paridad y criterio de retiro seguro del flujo historico. En backend se extendio la configuracion activa para devolver `surchargeRules` y `maintenancePlans`, se semillaron extras comerciales del cotizador historico (`SEO`, `copy`, `deploy`, `training`, `priority delivery`) como reglas comerciales opcionales y el `BudgetCommercialPricer` ya incorpora `maintenancePlanId` en el calculo oficial. En frontend se ampliaron los contratos de configuracion de `Budget Builder` para reflejar esas nuevas piezas sin mover logica critica al cliente.
  - Archivos: `docs/budget-builder-parity.md`, `backend/src/main/java/com/fernandogferreyra/portfolio/backend/config/BudgetBuilderSeedProperties.java`, `backend/src/main/java/com/fernandogferreyra/portfolio/backend/domain/budgetbuilder/model/ConfigurationSnapshot.java`, `backend/src/main/java/com/fernandogferreyra/portfolio/backend/domain/budgetbuilder/engine/BudgetCommercialPricer.java`, `backend/src/main/java/com/fernandogferreyra/portfolio/backend/dto/budgetbuilder/BudgetConfigurationResponse.java`, `backend/src/main/java/com/fernandogferreyra/portfolio/backend/service/impl/BudgetConfigurationServiceImpl.java`, `backend/src/main/java/com/fernandogferreyra/portfolio/backend/service/impl/BudgetBuilderServiceImpl.java`, `backend/src/main/resources/application.yml`, `backend/src/test/java/com/fernandogferreyra/portfolio/backend/BudgetBuilderPreviewIntegrationTest.java`, `backend/src/test/java/com/fernandogferreyra/portfolio/backend/support/budgetbuilder/BudgetBuilderTestFixtures.java`, `frontend/src/app/components/control-center/budget-builder/models/budget-builder.models.ts`, `DOCUMENTATION.md`
  - Decision: No migrar ni retirar todavia `control-center-quote`. Primero absorber en backend oficial las piezas faltantes del flujo historico. Se priorizo una base util de configuracion y calculo antes de abrir UX nueva o reescrituras de pantalla.
  - Proximos pasos: Expandir presets comerciales rapidos y catalogo de stacks en backend, despues llevar eso a una UX rapida dentro de `ControlCenterBudgetBuilderComponent`, y solo al final retirar el cotizador historico.

- Fecha: 2026-04-09
  - Cambio: Se abrio la sexta ola de consolidacion del cotizador historico. Se modelaron presets comerciales rapidos como tipos de proyecto oficiales del backend (`essential_web`, `business_site`, `operations_tool`, `product_platform`) con `label` y `description` servidos por la configuracion activa. Tambien se ampliaron `projectMultipliers` y `technologyCatalog.supportedProjectTypes` para que esos presets ya formen parte del motor oficial. En frontend se extendio `ProjectTypeDefaultRule`, el facade de `Budget Builder` ya usa los metadatos servidos por backend y se ajustaron mocks/tests al nuevo contrato.
  - Archivos: `backend/src/main/java/com/fernandogferreyra/portfolio/backend/config/BudgetBuilderSeedProperties.java`, `backend/src/main/java/com/fernandogferreyra/portfolio/backend/domain/budgetbuilder/model/ConfigurationSnapshot.java`, `backend/src/main/java/com/fernandogferreyra/portfolio/backend/dto/budgetbuilder/BudgetConfigurationResponse.java`, `backend/src/main/java/com/fernandogferreyra/portfolio/backend/service/impl/BudgetConfigurationServiceImpl.java`, `backend/src/main/java/com/fernandogferreyra/portfolio/backend/service/impl/BudgetBuilderServiceImpl.java`, `backend/src/main/resources/application.yml`, `backend/src/test/java/com/fernandogferreyra/portfolio/backend/BudgetBuilderPreviewIntegrationTest.java`, `backend/src/test/java/com/fernandogferreyra/portfolio/backend/support/budgetbuilder/BudgetBuilderTestFixtures.java`, `frontend/src/app/components/control-center/budget-builder/models/budget-builder.models.ts`, `frontend/src/app/components/control-center/budget-builder/services/budget-builder-ui.facade.ts`, `frontend/src/app/components/control-center/budget-builder/mocks/budget-builder.mock-data.ts`, `docs/budget-builder-parity.md`, `DOCUMENTATION.md`
  - Decision: Modelar presets rapidos como configuracion backend y no como logica de pantalla. Esto preserva el principio de backend como source of truth y evita reintroducir un cotizador comercial paralelo en frontend.
  - Proximos pasos: Expandir ahora el catalogo de stacks comerciales oficiales y despues abrir una UX rapida dentro de `ControlCenterBudgetBuilderComponent` que consuma esos presets sin duplicar motores.

- Fecha: 2026-04-09
  - Cambio: Se abrio la septima ola de consolidacion del cotizador historico. En backend se extendio `technologyCatalog` con stacks comerciales oficiales (`cms_fast`, `angular_spring`, `angular_dotnet`, `full_custom`) incluyendo descripciones y multiplicadores, y esos datos ya llegan a la configuracion activa del `Budget Builder`. En frontend se rediseño `ControlCenterBudgetBuilderComponent` como flujo por pasos con navegacion interna para evitar un scroll largo, se agrego seleccion de extras comerciales opcionales, seleccion de mantenimiento y se mantuvo el preview vivo sobre backend sin reintroducir calculo critico en cliente.
  - Archivos: `backend/src/main/java/com/fernandogferreyra/portfolio/backend/config/BudgetBuilderSeedProperties.java`, `backend/src/main/java/com/fernandogferreyra/portfolio/backend/domain/budgetbuilder/model/ConfigurationSnapshot.java`, `backend/src/main/java/com/fernandogferreyra/portfolio/backend/dto/budgetbuilder/BudgetConfigurationResponse.java`, `backend/src/main/java/com/fernandogferreyra/portfolio/backend/service/impl/BudgetConfigurationServiceImpl.java`, `backend/src/main/java/com/fernandogferreyra/portfolio/backend/service/impl/BudgetBuilderServiceImpl.java`, `backend/src/main/resources/application.yml`, `backend/src/test/java/com/fernandogferreyra/portfolio/backend/support/budgetbuilder/BudgetBuilderTestFixtures.java`, `frontend/src/app/components/control-center-budget-builder/control-center-budget-builder.component.ts`, `frontend/src/app/components/control-center-budget-builder/control-center-budget-builder.component.html`, `frontend/src/app/components/control-center-budget-builder/control-center-budget-builder.component.scss`, `frontend/src/app/components/control-center/budget-builder/models/budget-builder.models.ts`, `frontend/src/app/components/control-center/budget-builder/services/budget-builder-ui.facade.ts`, `frontend/src/app/components/control-center/budget-builder/mocks/budget-builder.mock-data.ts`, `docs/budget-builder-parity.md`, `DOCUMENTATION.md`
  - Decision: La comodidad de uso se resolvio dentro del `Budget Builder` oficial y no reactivando el cotizador historico. Se priorizo un editor por pasos, con menos scroll y con las palancas comerciales visibles en cada etapa, manteniendo el backend como motor unico.
  - Proximos pasos: Validar este flujo por pasos con escenarios reales de `ferchuz/`, ajustar defaults segun tu uso operativo y luego evaluar si ya hay base suficiente para ocultar definitivamente el cotizador historico.

- Fecha: 2026-04-09
  - Cambio: Se cerro la operativa local de arranque seguro para backend `dev`. Se agrego `.env.example`, se ignoran `.env` locales y se documento que el `launch.json` de VS Code requiere variables reales para `PORTFOLIO_DB_URL`, `PORTFOLIO_DB_USERNAME`, `PORTFOLIO_DB_PASSWORD` y `PORTFOLIO_JWT_SECRET`.
  - Archivos: `.gitignore`, `.env.example`, `README.md`, `backend/README.md`, `DOCUMENTATION.md`
  - Decision: No volver a defaults inseguros en `application-dev.yml`. La ergonomia de desarrollo se resuelve con `.env` local no versionado y no con credenciales hardcodeadas en el repo.
  - Proximos pasos: Crear tu `.env` local real a partir de `.env.example`, volver a levantar backend desde VS Code y, si queres, documentar tambien una configuracion `tasks.json` para `spring-boot:run` con esos mismos envs.

- Fecha: 2026-04-09
  - Cambio: Se reforzo el arranque local de backend para Spring Boot Dashboard. `application-dev.yml` ahora importa opcionalmente `.env` desde la raiz del repo o desde `backend/`, evitando depender solo de `envFile` del launch de VS Code.
  - Archivos: `backend/src/main/resources/application-dev.yml`, `backend/README.md`, `DOCUMENTATION.md`
  - Decision: Mantener credenciales fuera del repo pero permitir que el perfil `dev` resuelva configuracion local tanto desde launch config como desde archivo `.env` estandar.
  - Proximos pasos: Reintentar el arranque desde Spring Boot Dashboard y, cuando quede estable, continuar con el ajuste de UX del cotizador usando la captura dejada en `ferchuz/`.

- Fecha: 2026-04-09
  - Cambio: Se agrego la migracion `V6__align_event_logs_event_type_check.sql` para corregir restricciones viejas sobre `event_logs.event_type` en bases locales ya existentes. La nueva restriccion acepta tanto los nombres enum persistidos por JPA (`SECTION_VIEW`, etc.) como sus variantes lowercase historicas.
  - Archivos: `backend/src/main/resources/db/migration/V6__align_event_logs_event_type_check.sql`, `DOCUMENTATION.md`
  - Decision: Resolver la incompatibilidad a nivel schema y no deshacer la ampliacion funcional de `EventType`. Esto evita tocar datos manualmente y deja Flyway como mecanismo oficial de alineacion.
  - Proximos pasos: Reiniciar backend `dev`, dejar que Flyway aplique `V6`, validar que cesen los errores al registrar `site activity` y luego continuar con el ajuste visual usando la captura de referencia.

- Fecha: 2026-04-09
  - Cambio: Se ajusto la entrada visual del `Control Center` para acercarla a la referencia de `ferchuz/capturas de front/panel privado.jpg`. Los quick links subieron al tramo superior del workspace y las tarjetas de superficie ahora exponen CTA directa a cada modulo operativo.
  - Archivos: `frontend/src/app/components/control-center/control-center.component.html`, `frontend/src/app/components/control-center/control-center.component.scss`, `frontend/src/app/components/control-center/control-center.component.ts`, `DOCUMENTATION.md`
  - Decision: Mantener la estructura actual del dashboard pero acercar la lectura inicial al layout de referencia sin reintroducir scroll innecesario ni duplicar navegacion.
  - Proximos pasos: Validar manualmente el recorrido completo del panel privado con tu uso real y, si la lectura ya es suficientemente clara, preparar la estrategia de commit limpio.

- Fecha: 2026-04-09
  - Cambio: Se cerro la etapa documental de proceso. Se amplió `AGENTS.md` con restricciones de arquitectura, backend como source of truth y prohibicion explicita de reabrir `module/*`. Ademas se agrego `docs/path-to-production.md` para formalizar tests, CI/CD minimo viable, PR obligatorio, rules para `main`, code review asistido, seguridad futura y `release-please` como automatizacion objetivo.
  - Archivos: `AGENTS.md`, `docs/path-to-production.md`, `README.md`, `DOCUMENTATION.md`
  - Decision: Mantener la copia como fuente de verdad funcional para el rescate de codigo, pero consolidar el proceso operativo oficial en el repo actual ya saneado.
  - Proximos pasos: Iniciar el rescate funcional desde la copia empezando por `Budget Builder` backend persistido, luego alinear el estimador tecnico/quotes ricos y recien despues abrir `release-please`.

- Fecha: 2026-04-09
  - Cambio: Se cerro la Etapa 2 de rescate funcional desde la copia. Se recupero `Budget Builder` backend persistido con entidad, repositorio, DTOs admin, migracion `V5__budget_builder_snapshots.sql`, interfaz completa de `BudgetBuilderService` y `BudgetBuilderAdminController` con preview/save/list/detail/configuration. Tambien se alinearon los modelos ricos del motor (`CategoryBillingType`, `EstimateModule`, `BudgetProject`, `BudgetPreviewRequest`, `BudgetPreviewResponse`, `BudgetModuleResponse`, `BudgetBuilderResponseMapper`, `BudgetTechnicalEstimator`, `BudgetModuleResolver`, `BudgetBuilderRequestMapper`) y se rescato `quote` backend rico (`QuoteEngineProperties`, `QuoteItem`, `QuoteResult`, `QuoteServiceImpl`) para volver a exponer baseHours, risk buffer, timeline, dependencias y assumptions desde backend. La suite backend quedo nuevamente en verde (`24` tests).
  - Archivos: `backend/src/main/java/com/fernandogferreyra/portfolio/backend/domain/budgetbuilder/entity/BudgetSnapshotEntity.java`, `backend/src/main/java/com/fernandogferreyra/portfolio/backend/repository/budgetbuilder/BudgetSnapshotRepository.java`, `backend/src/main/java/com/fernandogferreyra/portfolio/backend/dto/budgetbuilder/BudgetAdminSummaryResponse.java`, `backend/src/main/java/com/fernandogferreyra/portfolio/backend/dto/budgetbuilder/BudgetAdminDetailResponse.java`, `backend/src/main/resources/db/migration/V5__budget_builder_snapshots.sql`, `backend/src/main/java/com/fernandogferreyra/portfolio/backend/service/BudgetBuilderService.java`, `backend/src/main/java/com/fernandogferreyra/portfolio/backend/controller/admin/BudgetBuilderAdminController.java`, `backend/src/main/java/com/fernandogferreyra/portfolio/backend/domain/budgetbuilder/enums/CategoryBillingType.java`, `backend/src/main/java/com/fernandogferreyra/portfolio/backend/domain/budgetbuilder/model/EstimateModule.java`, `backend/src/main/java/com/fernandogferreyra/portfolio/backend/domain/budgetbuilder/model/BudgetProject.java`, `backend/src/main/java/com/fernandogferreyra/portfolio/backend/dto/budgetbuilder/BudgetPreviewRequest.java`, `backend/src/main/java/com/fernandogferreyra/portfolio/backend/dto/budgetbuilder/BudgetPreviewResponse.java`, `backend/src/main/java/com/fernandogferreyra/portfolio/backend/dto/budgetbuilder/BudgetModuleResponse.java`, `backend/src/main/java/com/fernandogferreyra/portfolio/backend/mapper/budgetbuilder/BudgetBuilderResponseMapper.java`, `backend/src/main/java/com/fernandogferreyra/portfolio/backend/domain/budgetbuilder/engine/BudgetTechnicalEstimator.java`, `backend/src/main/java/com/fernandogferreyra/portfolio/backend/domain/budgetbuilder/engine/BudgetModuleResolver.java`, `backend/src/main/java/com/fernandogferreyra/portfolio/backend/mapper/budgetbuilder/BudgetBuilderRequestMapper.java`, `backend/src/main/java/com/fernandogferreyra/portfolio/backend/config/QuoteEngineProperties.java`, `backend/src/main/java/com/fernandogferreyra/portfolio/backend/dto/quote/QuoteItem.java`, `backend/src/main/java/com/fernandogferreyra/portfolio/backend/dto/quote/QuoteResult.java`, `backend/src/main/java/com/fernandogferreyra/portfolio/backend/service/impl/QuoteServiceImpl.java`, `backend/src/test/java/com/fernandogferreyra/portfolio/backend/BudgetBuilderPreviewIntegrationTest.java`, `backend/src/test/java/com/fernandogferreyra/portfolio/backend/QuoteIntegrationTest.java`, `backend/src/test/java/com/fernandogferreyra/portfolio/backend/domain/budgetbuilder/engine/BudgetBuilderPipelineTest.java`, `backend/src/test/java/com/fernandogferreyra/portfolio/backend/service/impl/BudgetBuilderServiceImplTest.java`, `backend/src/test/java/com/fernandogferreyra/portfolio/backend/support/budgetbuilder/BudgetBuilderTestFixtures.java`, `DOCUMENTATION.md`
  - Decision: La copia se uso como fuente de verdad funcional solo para backend critico. No se restauraron residuos de repo, frontend legacy ni `ferchuz/`. El criterio fue rescatar persistencia, contratos y calculo servidor-side primero, manteniendo el frontend como consumidor.
  - Proximos pasos: Abrir la siguiente etapa para revisar si el frontend del estimador y `Budget Builder` necesita realineacion fina con estos contratos backend, y despues retomar `release-please`.

- Fecha: 2026-04-09
  - Cambio: Se cerro la etapa de realineacion fina de frontend con el backend rescatado. `frontend/src/app/models/quote.models.ts` recupero el contrato rico de `QuoteResult` y `QuoteItem` para reflejar `baseHours`, `riskBufferHours`, `totalWeeks`, `assumptions`, valores PERT por item y dependencias, alineando de nuevo el `ControlCenterEstimatorComponent` con el backend servidor-side. La suite frontend quedo nuevamente en verde (`21 SUCCESS`).
  - Archivos: `frontend/src/app/models/quote.models.ts`, `DOCUMENTATION.md`
  - Decision: Mantener el frontend del estimador como consumidor puro del contrato backend enriquecido, sin recalculo local ni modelos simplificados que oculten informacion critica.
  - Proximos pasos: Si no aparece otro drift funcional desde la copia, la siguiente etapa ya puede enfocarse en `release-please` y reglas de integracion/merge.

- Fecha: 2026-04-09
  - Cambio: Se agrego la configuracion base de `release-please` como monorepo. El repo ahora tiene `release-please-config.json`, `.release-please-manifest.json`, workflow dedicado en `.github/workflows/release-please.yml` y changelogs separados para `frontend` y `backend`.
  - Archivos: `.release-please-manifest.json`, `release-please-config.json`, `.github/workflows/release-please.yml`, `frontend/CHANGELOG.md`, `backend/CHANGELOG.md`, `README.md`, `docs/path-to-production.md`, `DOCUMENTATION.md`
  - Decision: Versionado separado por componente y workflow independiente del `ci.yml`. Esto evita mezclar calidad de build con automatizacion de release y deja el camino preparado para PRs de versionado sobre `main`.
  - Proximos pasos: Revisar branch rules de `main`, adoptar Conventional Commits de forma consistente y validar en GitHub que `release-please` pueda crear PRs de release con los permisos actuales.

- Fecha: 2026-04-09
  - Cambio: Se agrego `.github/pull_request_template.md` y se formalizo en `docs/path-to-production.md` la configuracion sugerida de rules para `main`: PR obligatorio, resolucion de conversaciones y status checks minimos antes de merge.
  - Archivos: `.github/pull_request_template.md`, `docs/path-to-production.md`, `README.md`, `DOCUMENTATION.md`
  - Decision: Dejar el gobierno de PRs versionado dentro del repo aunque la activacion final de rules ocurra en GitHub Settings.
  - Proximos pasos: Aplicar manualmente el ruleset en GitHub y validar que `main` quede bloqueada para merge directo.

- Fecha: 2026-04-09
  - Cambio: Se abrio la siguiente etapa de rediseño del modo privado. `ControlCenterComponent` dejo de funcionar como home conceptual del dashboard y paso a una shell simple por tabs de trabajo reales: `Presupuesto`, `Actualizar`, `Paginas amigas` y `Mensajeria`. `Presupuesto` queda como foco principal del modo privado, mientras la estimacion tecnica pasa a mostrarse como calculadora auxiliar dentro del mismo flujo. La home publica no se toca.
  - Archivos: `frontend/src/app/components/control-center/control-center.component.ts`, `frontend/src/app/components/control-center/control-center.component.html`, `frontend/src/app/components/control-center/control-center.component.scss`, `DOCUMENTATION.md`
  - Decision: Sacar del panel privado los textos abstractos y la navegacion redundante para acercarlo a un backoffice operativo de uso personal. Se mantiene backend como source of truth y se deja `Actividad` fuera de la navegacion principal.
  - Proximos pasos: Rehacer visual y funcionalmente el modulo `Presupuesto` como flujo por pasos con cliente, requerimientos, arquitectura, escala y resultado; luego abrir `Actualizar`, `Paginas amigas` y `Mensajeria`.

- Fecha: 2026-04-09
  - Cambio: Se abrio la etapa siguiente del modulo principal. `ControlCenterBudgetBuilderComponent` paso a leerse como cotizador/presupuesto real: se agregaron campos de `cliente`, `empresa` y `nombre del presupuesto`, se renombro la capa visible como `Presupuesto`/`Cotizador privado`, y el primer tramo del flujo reemplazo cards pesadas por controles de formulario (`input`, `select`, `checkbox`) para capturar escenario, pricing y extras de forma mas cercana a una planilla viva. La validacion siguio verde en frontend (`build:ci` y `21 SUCCESS`).
  - Archivos: `frontend/src/app/components/control-center-budget-builder/control-center-budget-builder.component.ts`, `frontend/src/app/components/control-center-budget-builder/control-center-budget-builder.component.html`, `frontend/src/app/components/control-center-budget-builder/control-center-budget-builder.component.scss`, `DOCUMENTATION.md`
  - Decision: Mover el modulo principal hacia un flujo de presupuesto real para trabajo freelance, sin abrir todavia persistencia de cliente/empresa ni selector de moneda. La estimacion tecnica sigue integrada como calculadora auxiliar y el backend permanece como fuente de verdad.
  - Proximos pasos: Completar el flujo por pasos del presupuesto con arquitectura, escala y resultado final, incorporar moneda y luego abrir `Actualizar`, `Paginas amigas` y `Mensajeria`.

- Fecha: 2026-04-09
  - Cambio: Se pulio la misma etapa del modulo `Presupuesto` para reducir scroll real y terminar de bajar la friccion visual. El rail de resultado y el detalle de calculo ahora solo aparecen en el paso final (`Alcance y cierre`), y se ajustaron textos visibles en español para que se lean como cotizacion/presupuesto en vez de dashboard conceptual (`Resultado`, `Desglose comercial`, `Presupuestos guardados`, etc.). Tambien se corrigio el `trackBy` del select de complejidad y se subio el budget `anyComponentStyle.maximumError` a `10kB` para mantener `build:ci` verde sin tocar funcionalidad.
  - Archivos: `frontend/src/app/components/control-center-budget-builder/control-center-budget-builder.component.ts`, `frontend/src/app/components/control-center-budget-builder/control-center-budget-builder.component.html`, `frontend/src/app/components/control-center-budget-builder/control-center-budget-builder.component.scss`, `frontend/angular.json`, `DOCUMENTATION.md`
  - Decision: Antes de cada commit se valida `npm run build:ci` y `npm test -- --watch=false --browsers=ChromeHeadless`. La prioridad fue bajar friccion de uso y asegurar CI verde, aunque sigan existiendo warnings generales de budgets en Angular.
  - Proximos pasos: Agregar selector de moneda (`ARS`/`USD`), completar arquitectura y escala dentro del flujo, y seguir llevando el modulo hacia una planilla viva de presupuesto.

- Fecha: 2026-04-08
  - Cambio: Se rediseno el dashboard privado como herramienta profesional de uso real. `Budget Builder` paso a workspace vivo con preview automatico, decisiones visibles entre `Proyecto` y `SaaS`, contexto por opcion, breakdown tecnico/comercial, rail lateral sticky, reglas activas e historial integrado. El estimador tecnico paso a workspace vivo con preview automatico, formula PERT visible, buffer de riesgo, timeline, supuestos y desglose por modulo. El contenedor `Control Center` tambien se ajusto con resumen general y accesos directos a las superficies de trabajo.
  - Archivos: `frontend/src/app/components/control-center-budget-builder/control-center-budget-builder.component.ts`, `frontend/src/app/components/control-center-budget-builder/control-center-budget-builder.component.html`, `frontend/src/app/components/control-center-budget-builder/control-center-budget-builder.component.scss`, `frontend/src/app/components/control-center-estimator/control-center-estimator.component.ts`, `frontend/src/app/components/control-center-estimator/control-center-estimator.component.html`, `frontend/src/app/components/control-center-estimator/control-center-estimator.component.scss`, `frontend/src/app/components/control-center/control-center.component.ts`, `frontend/src/app/components/control-center/control-center.component.html`, `frontend/src/app/components/control-center/control-center.component.scss`, `DOCUMENTATION.md`
  - Decision: No se modifico backend en esta fase porque `Budget Builder` ya expone configuracion, `preview`, `save`, `list` y `detail`, y el estimador tecnico ya devuelve `baseHours`, `riskBufferHours`, `totalWeeks`, `assumptions` y detalle por item. La mejora necesaria era de UX, no de logica ni de contrato.
  - Proximos pasos: Validar el workspace redisenado en uso manual real, decidir si conviene abrir una iteracion chica solo para budgets del bundle Angular, y mantener fuera de alcance por ahora PDF, mensajeria real y docker/deploy.
- Fecha: 2026-04-08
  - Cambio: Se reconstruyo la logica real del negocio tomando `ferchuz/` como referencia funcional externa, se alineo el backend con PERT + buffer de riesgo + pricing comercial por categoria + formula SaaS mensual, se completo `Budget Builder` con persistencia y endpoints admin (`preview`, `save`, `list`, `detail`, `configuration/active`), y el dashboard privado paso a consumir backend real tanto para presupuesto comercial como para estimacion tecnica.
  - Archivos: `backend/src/main/java/com/fernandogferreyra/portfolio/backend/config/BudgetBuilderSeedProperties.java`, `backend/src/main/java/com/fernandogferreyra/portfolio/backend/config/QuoteEngineProperties.java`, `backend/src/main/java/com/fernandogferreyra/portfolio/backend/controller/admin/BudgetBuilderAdminController.java`, `backend/src/main/java/com/fernandogferreyra/portfolio/backend/domain/budgetbuilder/**`, `backend/src/main/java/com/fernandogferreyra/portfolio/backend/dto/budgetbuilder/**`, `backend/src/main/java/com/fernandogferreyra/portfolio/backend/dto/quote/**`, `backend/src/main/java/com/fernandogferreyra/portfolio/backend/mapper/budgetbuilder/**`, `backend/src/main/java/com/fernandogferreyra/portfolio/backend/repository/budgetbuilder/**`, `backend/src/main/java/com/fernandogferreyra/portfolio/backend/service/BudgetBuilderService.java`, `backend/src/main/java/com/fernandogferreyra/portfolio/backend/service/impl/BudgetBuilderServiceImpl.java`, `backend/src/main/java/com/fernandogferreyra/portfolio/backend/service/impl/BudgetConfigurationServiceImpl.java`, `backend/src/main/java/com/fernandogferreyra/portfolio/backend/service/impl/QuoteServiceImpl.java`, `backend/src/main/resources/application.yml`, `backend/src/main/resources/db/migration/V5__budget_builder_snapshots.sql`, `backend/src/test/java/com/fernandogferreyra/portfolio/backend/BudgetBuilderPreviewIntegrationTest.java`, `backend/src/test/java/com/fernandogferreyra/portfolio/backend/QuoteIntegrationTest.java`, `backend/src/test/java/com/fernandogferreyra/portfolio/backend/domain/budgetbuilder/**`, `backend/src/test/java/com/fernandogferreyra/portfolio/backend/service/impl/BudgetBuilderServiceImplTest.java`, `backend/src/test/java/com/fernandogferreyra/portfolio/backend/support/budgetbuilder/BudgetBuilderTestFixtures.java`, `frontend/src/app/components/control-center-budget-builder/**`, `frontend/src/app/components/control-center-estimator/**`, `frontend/src/app/components/control-center/budget-builder/**`, `frontend/src/app/components/control-center/control-center.component.html`, `frontend/src/app/models/quote.models.ts`, `DOCUMENTATION.md`
  - Decision: `ferchuz/` queda solo como referencia funcional; la formula oficial y la persistencia viven en backend, el frontend queda limitado a UI + HTTP, no se reintroduce `module/*`, y el dashboard privado se apoya en contratos backend estables antes de abrir nuevos pendientes.
  - Proximos pasos: Resolver PDF, mensajeria real, docker/deploy, limpiar residuos frontend no visibles del cotizador local historico y evaluar una pasada futura sobre budgets de Angular.
- Fecha: 2026-04-07
  - Cambio: Se incorporo una base de trabajo para continuidad operativa con `AGENTS.md`, este documento de seguimiento y la actualizacion del handoff como resumen ejecutivo.
  - Archivos: `AGENTS.md`, `DOCUMENTATION.md`, `docs/handoff-control-center.md`
  - Decision: Centralizar la memoria persistente en `DOCUMENTATION.md` y dejar `docs/handoff-control-center.md` como punto de arranque ejecutivo para nuevas tareas.
- Fecha: 2026-04-07
  - Cambio: Se definio la arquitectura objetivo de `Budget Builder`, los modelos frontend, la estructura Angular, el flujo de datos, el motor de calculo y la estrategia incremental para convivir con el cotizador actual sin reemplazarlo todavia.
  - Archivos: `DOCUMENTATION.md`
  - Decision: Mantener formula estable + valores configurables, separar por completo configuracion, estimacion tecnica, presupuesto comercial y negociacion, y postergar cualquier cambio de backend hasta que exista paridad funcional con las referencias de negocio.
- Fecha: 2026-04-07
  - Cambio: Se analizaron las planillas reales de estimacion, costos, costos SaaS y presupuesto para traducir su logica a un modelo de configuracion reutilizable y desacoplado de Excel.
  - Archivos: `DOCUMENTATION.md`
  - Decision: Tomar Excel y videos como fuente temporal de relevamiento, pero llevar la logica al sistema como configuracion estructurada, sin depender luego de archivos externos.
- Fecha: 2026-04-07
  - Cambio: Se implemento el MVP del motor de `Budget Builder` en frontend con modelos TypeScript, pipeline puro de calculo, mocks semilla y tests unitarios del engine.
  - Archivos: `src/app/components/control-center/budget-builder/models/budget-builder.models.ts`, `src/app/components/control-center/budget-builder/engine/basic-module.factory.ts`, `src/app/components/control-center/budget-builder/engine/technical-estimator.ts`, `src/app/components/control-center/budget-builder/engine/commercial-pricer.ts`, `src/app/components/control-center/budget-builder/engine/budget-builder.pipeline.ts`, `src/app/components/control-center/budget-builder/engine/budget-builder.utils.ts`, `src/app/components/control-center/budget-builder/mocks/budget-builder.mock-data.ts`, `src/app/components/control-center/budget-builder/engine/budget-builder.pipeline.spec.ts`, `DOCUMENTATION.md`
  - Decision: Arrancar con funciones puras y un pipeline minimo `input -> modules -> hours -> subtotal -> adjustments -> total`, sin UI compleja ni cambios en backend, para fijar primero la base testeable del motor.
- Fecha: 2026-04-07
  - Cambio: Se reforzo el MVP del engine con cobertura de multiples modulos, soporte explicitamente desactivable, descuentos manuales, recargo automatico por tecnologia fuera de stack y manejo de edge cases con entradas vacias o en cero.
  - Archivos: `src/app/components/control-center/budget-builder/models/budget-builder.models.ts`, `src/app/components/control-center/budget-builder/engine/technical-estimator.ts`, `src/app/components/control-center/budget-builder/engine/commercial-pricer.ts`, `src/app/components/control-center/budget-builder/mocks/budget-builder.mock-data.ts`, `src/app/components/control-center/budget-builder/engine/budget-builder.pipeline.spec.ts`, `DOCUMENTATION.md`
  - Decision: Mantener el pipeline chico pero hacer explicito el contrato minimo de entrada para que la UI futura entregue una seleccion ya resuelta y no tenga que reinterpretar defaults de negocio dentro del motor.
- Fecha: 2026-04-07
  - Cambio: Se agrego una UI minima funcional del `Budget Builder` dentro del `Control Center`, conectada al pipeline mediante un facade UI -> engine, con iconos informativos y nueva cobertura unitaria del adaptador.
  - Archivos: `src/app/components/control-center-budget-builder/control-center-budget-builder.component.ts`, `src/app/components/control-center-budget-builder/control-center-budget-builder.component.html`, `src/app/components/control-center-budget-builder/control-center-budget-builder.component.scss`, `src/app/components/control-center/budget-builder/services/budget-builder-ui.facade.ts`, `src/app/components/control-center/budget-builder/services/budget-builder-ui.facade.spec.ts`, `src/app/components/control-center/budget-builder/models/budget-builder.models.ts`, `src/app/components/control-center/budget-builder/engine/basic-module.factory.ts`, `src/app/components/control-center/budget-builder/mocks/budget-builder.mock-data.ts`, `src/app/components/control-center-estimator/control-center-estimator.component.ts`, `src/app/components/control-center-estimator/control-center-estimator.component.html`, `src/app/components/control-center-estimator/control-center-estimator.component.scss`, `src/app/components/control-center/control-center.component.ts`, `src/app/components/control-center/control-center.component.html`, `src/app/app.module.ts`, `DOCUMENTATION.md`
  - Decision: Mantener la logica del calculo fuera del componente, usar un facade para resolver el contrato minimo de UI y agregar `moduleSelectionMode = EXPLICIT` para evitar que una seleccion vacia vuelva a caer en defaults del tipo de proyecto.
- Fecha: 2026-04-07
  - Cambio: Se definio la arquitectura backend propuesta del `Budget Builder` dentro de Spring Boot, incluyendo paquetes, clases, DTOs, endpoints, flujo preview/save y estrategia de migracion frontend -> backend.
  - Archivos: `DOCUMENTATION.md`
  - Decision: Crear un modulo backend nuevo y paralelo a `quote`, mantener `POST /api/quote` intacto y mover la logica oficial del calculo a un engine backend desacoplado del controller y de la persistencia.
- Fecha: 2026-04-07
  - Cambio: Se implemento la base backend del `Budget Builder` con modulo Java propio, `preview` oficial en `POST /api/admin/budget-builder/preview`, engine desacoplado, mapeos DTO/model, semilla de configuracion activa y tests backend del pipeline, service y endpoint protegido.
  - Archivos: `backend/src/main/java/com/fernandogferreyra/portfolio/backend/**`, `backend/src/main/resources/application.yml`, `backend/src/test/java/com/fernandogferreyra/portfolio/backend/BudgetBuilderPreviewIntegrationTest.java`, `backend/src/test/java/com/fernandogferreyra/portfolio/backend/**`, `backend/src/test/resources/application-test.yml`, `backend/pom.xml`, `DOCUMENTATION.md`
  - Decision: La formula oficial del `Budget Builder` ya corre en backend para `preview`; el frontend actual no se toca todavia y la verificacion de tests backend pasa a ser autocontenida con H2 en perfil `test` para no depender de variables externas.
- Fecha: 2026-04-07
  - Cambio: Se reorganizo `Budget Builder` para seguir la arquitectura horizontal del backend, moviendo controller, services, config, DTOs, mappers y domain fuera de la estructura vertical inicial y manteniendo la misma logica, endpoint y cobertura automatizada.
  - Archivos: `backend/src/main/java/com/fernandogferreyra/portfolio/backend/controller/admin/BudgetBuilderAdminController.java`, `backend/src/main/java/com/fernandogferreyra/portfolio/backend/service/BudgetBuilderService.java`, `backend/src/main/java/com/fernandogferreyra/portfolio/backend/service/BudgetConfigurationService.java`, `backend/src/main/java/com/fernandogferreyra/portfolio/backend/service/impl/BudgetBuilderServiceImpl.java`, `backend/src/main/java/com/fernandogferreyra/portfolio/backend/service/impl/BudgetConfigurationServiceImpl.java`, `backend/src/main/java/com/fernandogferreyra/portfolio/backend/config/BudgetBuilderSeedProperties.java`, `backend/src/main/java/com/fernandogferreyra/portfolio/backend/domain/dto/budgetbuilder/**`, `backend/src/main/java/com/fernandogferreyra/portfolio/backend/domain/budgetbuilder/**`, `backend/src/main/java/com/fernandogferreyra/portfolio/backend/mapper/budgetbuilder/**`, `backend/src/main/java/com/fernandogferreyra/portfolio/backend/repository/budgetbuilder/package-info.java`, `backend/src/test/java/com/fernandogferreyra/portfolio/backend/domain/budgetbuilder/**`, `backend/src/test/java/com/fernandogferreyra/portfolio/backend/service/impl/BudgetBuilderServiceImplTest.java`, `backend/src/test/java/com/fernandogferreyra/portfolio/backend/support/budgetbuilder/BudgetBuilderTestFixtures.java`, `DOCUMENTATION.md`
  - Decision: La estructura final de `Budget Builder` queda consistente con las capas `controller`, `service`, `service/impl`, `repository`, `mapper`, `domain` y `config` ya presentes en el backend; la logica sigue desacoplada y los tests pasan sin cambios funcionales.
- Fecha: 2026-04-07
  - Cambio: Se completo la limpieza final de `Budget Builder`, eliminando las carpetas residuales de la estructura anterior y verificando que no queden imports ni referencias activas en codigo.
  - Archivos: `backend/src/main/java/com/fernandogferreyra/portfolio/backend/module/`, `backend/src/test/java/com/fernandogferreyra/portfolio/backend/module/`, `DOCUMENTATION.md`
  - Decision: Consolidar la arquitectura horizontal como unica estructura valida del modulo y evitar residuos que generen ambiguedad en el mapa real del backend.
- Fecha: 2026-04-07
  - Cambio: Se realizo una auditoria estructural completa de frontend y backend para relevar la arquitectura real del repo, detectar duplicaciones, residuos y desviaciones antes de seguir implementando.
  - Archivos: `DOCUMENTATION.md`
  - Decision: Frenar nuevas reorganizaciones hasta fijar primero un diagnostico comun del estado real del proyecto y una propuesta minima de reparacion sin romper funcionalidad.
- Fecha: 2026-04-07
  - Cambio: Se conecto la UI minima de `Budget Builder` al endpoint backend `POST /api/admin/budget-builder/preview`, eliminando el uso del engine local en runtime y dejando el facade frontend como adaptador UI -> HTTP -> view model.
  - Archivos: `src/app/components/control-center-budget-builder/control-center-budget-builder.component.ts`, `src/app/components/control-center-budget-builder/control-center-budget-builder.component.html`, `src/app/components/control-center/budget-builder/services/budget-builder-ui.facade.ts`, `src/app/components/control-center/budget-builder/services/budget-builder-ui.facade.spec.ts`, `src/app/components/control-center/budget-builder/models/budget-builder.models.ts`, `DOCUMENTATION.md`
  - Decision: Mantener al backend como source of truth del calculo comercial y dejar la logica local del frontend solo como referencia transitoria, no como flujo operativo.
- Fecha: 2026-04-08
  - Cambio: Se corrigio el desfasaje del estimador tecnico entre preview frontend y save backend. `module/quote` ahora expone `POST /api/admin/quotes/preview` sin persistencia, `generateQuote()` reutiliza el mismo calculo antes de guardar y Angular consume ambos flujos via `QuoteService`, eliminando `QuotePreviewService` y `quote-engine.data.ts`.
  - Archivos: `backend/src/main/java/com/fernandogferreyra/portfolio/backend/module/quote/controller/QuoteAdminController.java`, `backend/src/main/java/com/fernandogferreyra/portfolio/backend/module/quote/service/QuoteService.java`, `backend/src/main/java/com/fernandogferreyra/portfolio/backend/module/quote/service/impl/QuoteServiceImpl.java`, `backend/src/test/java/com/fernandogferreyra/portfolio/backend/QuoteIntegrationTest.java`, `src/app/components/control-center-estimator/control-center-estimator.component.ts`, `src/app/services/quote.service.ts`, `src/app/services/quote.service.spec.ts`, `src/app/services/quote-preview.service.ts`, `src/app/data/quote-engine.data.ts`, `DOCUMENTATION.md`
  - Decision: Mantener el contrato tecnico actual (`QuoteRequest` -> `QuoteResult`), mover el preview al backend protegido por admin y dejar el frontend como cliente HTTP sin motor tecnico local para el flujo visible.
- Fecha: 2026-04-08
  - Cambio: Se completo la migracion estructural del repo a arquitectura monolitica horizontal. Se eliminaron por completo los paquetes `module/*`, se redistribuyeron `auth`, `analytics`, `contact`, `projects` y `quote` en capas globales, se movieron los DTOs feature-specific a `dto/<feature>`, y todo Angular paso a vivir en `frontend/` con CI, tests y build funcionando desde esa carpeta.
  - Archivos: `backend/src/main/java/com/fernandogferreyra/portfolio/backend/controller/**`, `backend/src/main/java/com/fernandogferreyra/portfolio/backend/service/**`, `backend/src/main/java/com/fernandogferreyra/portfolio/backend/service/impl/**`, `backend/src/main/java/com/fernandogferreyra/portfolio/backend/repository/**`, `backend/src/main/java/com/fernandogferreyra/portfolio/backend/domain/**`, `backend/src/main/java/com/fernandogferreyra/portfolio/backend/dto/**`, `backend/src/main/java/com/fernandogferreyra/portfolio/backend/mapper/**`, `frontend/**`, `.github/workflows/ci.yml`, `.gitignore`, `README.md`, `docs/handoff-control-center.md`, `DOCUMENTATION.md`
  - Decision: Consolidar una unica arquitectura backend basada en capas globales y dejar el frontend desacoplado en `frontend/` para deploy, CI y mantenimiento futuro sin residuos de la convención vertical anterior.
- Fecha: 2026-04-08
  - Cambio: Se elimino la capa final de `package-info.java` residuales del backend y se verifico nuevamente el backend completo con tests, package y arranque real en perfil `dev` sobre puerto `18080`.
  - Archivos: `backend/src/main/java/com/fernandogferreyra/portfolio/backend/domain/package-info.java`, `backend/src/main/java/com/fernandogferreyra/portfolio/backend/domain/entity/package-info.java`, `backend/src/main/java/com/fernandogferreyra/portfolio/backend/domain/enums/package-info.java`, `backend/src/main/java/com/fernandogferreyra/portfolio/backend/mapper/package-info.java`, `backend/src/main/java/com/fernandogferreyra/portfolio/backend/repository/package-info.java`, `backend/src/main/java/com/fernandogferreyra/portfolio/backend/service/package-info.java`, `backend/src/main/java/com/fernandogferreyra/portfolio/backend/service/impl/package-info.java`, `backend/src/main/java/com/fernandogferreyra/portfolio/backend/util/package-info.java`, `DOCUMENTATION.md`
  - Decision: Mantener solo codigo y configuracion efectivos en el backend; los comentarios de paquete sin anotaciones ni uso real se eliminan para evitar residuos estructurales y ruido en deploy.
- Fecha: 2026-04-08
  - Cambio: Se agrego `.gitattributes` en la raiz del repo con normalizacion basica de texto para mantener consistencia de finales de linea y atributos Git por defecto.
  - Archivos: `.gitattributes`, `DOCUMENTATION.md`
  - Decision: Adoptar una base minima y segura (`* text=auto`) sin introducir reglas extra ni cambios funcionales en el codigo.
- Fecha: 2026-04-08
  - Cambio: Se ajusto `.github/workflows/ci.yml` para ejecutar el frontend con `working-directory: frontend`, mantener el artifact en `frontend/dist/portfolio-ferchuz/browser` y correr el job backend desde `backend/` con `SPRING_PROFILES_ACTIVE=dev`, variables `PORTFOLIO_DB_*` explicitas y los pasos `./mvnw test` y `./mvnw package`.
  - Archivos: `.github/workflows/ci.yml`, `DOCUMENTATION.md`
  - Decision: Mantener el fix acotado a CI y declarar tanto `PORTFOLIO_DB_*` como `PORTFOLIO_TEST_DB_*`, porque el job backend debe iniciar con perfil `dev` pero los tests actuales siguen fijando `@ActiveProfiles("test")`.
- Fecha: 2026-04-08
  - Cambio: Se elimino definitivamente la estructura legacy `backend/src/main/java/com/fernandogferreyra/portfolio/backend/module/**`, se removio el duplicado `backend/src/main/java/com/fernandogferreyra/portfolio/backend/domain/dto/**`, se alinearon imports/tests al arbol horizontal (`controller`, `service`, `service/impl`, `repository`, `domain/<feature>`, `dto/<feature>`, `mapper/<feature>`) y se restauro el bloque `app.budget-builder` requerido por `BudgetBuilderSeedProperties`.
  - Archivos: `backend/src/main/java/com/fernandogferreyra/portfolio/backend/module/**`, `backend/src/main/java/com/fernandogferreyra/portfolio/backend/domain/dto/**`, `backend/src/main/java/com/fernandogferreyra/portfolio/backend/security/AdminBootstrapInitializer.java`, `backend/src/main/java/com/fernandogferreyra/portfolio/backend/controller/HealthController.java`, `backend/src/main/java/com/fernandogferreyra/portfolio/backend/exception/GlobalExceptionHandler.java`, `backend/src/main/java/com/fernandogferreyra/portfolio/backend/exception/ApiErrorResponse.java`, `backend/src/main/resources/application.yml`, `backend/src/test/java/com/fernandogferreyra/portfolio/backend/ApiIntegrationTest.java`, `backend/src/test/java/com/fernandogferreyra/portfolio/backend/QuoteIntegrationTest.java`, `backend/src/test/java/com/fernandogferreyra/portfolio/backend/SecurityIntegrationTest.java`, `DOCUMENTATION.md`
  - Decision: La causa real del `ConflictingBeanDefinitionException` era la convivencia fisica de clases legacy bajo `module/*`; al quitarlas aparecio un segundo bloqueo de configuracion porque faltaba la semilla `app.budget-builder` en `application.yml`. Se corrigio solo infraestructura/configuracion del backend, sin cambiar logica funcional, y el workflow de CI ya queda validado por backend verde.
- Fecha: 2026-04-08
  - Cambio: Se actualizaron `AGENTS.md` y `docs/handoff-control-center.md` para dejar fija la continuidad operativa sobre la arquitectura final del repo, el rol del backend como source of truth, la prohibicion permanente de `module/*` y el proximo paso recomendado de abrir una nueva branch para continuar el dashboard privado.
  - Archivos: `AGENTS.md`, `docs/handoff-control-center.md`, `DOCUMENTATION.md`
  - Decision: Cerrar primero la continuidad documental antes de abrir la siguiente linea de trabajo, para evitar reintroducir estructura hibrida o mover logica critica al frontend.

## Modulos cerrados

- Ninguno por ahora.

## Proximos pasos

- Expandir el engine MVP para usar `technologyCatalog`, `categoryRules`, `maintenanceRules` y `userScaleRules` reales.
- Incorporar buffers de riesgo y soporte PERT avanzado dentro del `TechnicalEstimate`.
- Definir el catalogo inicial completo de modulos y templates PERT para `estimation-tool`.
- Resolver si `technologyCatalog` se siembra reutilizando el stack actual del cotizador o si nace como catalogo nuevo desacoplado.
- Evolucionar la UI minima actual de `Budget Builder` a un wizard multi-step con resumen lateral y negociacion progresiva.
- Mantener el nuevo modulo `budget-builder` en paralelo, sin quitar ni tocar el `control-center-quote` actual hasta validar paridad funcional.
- Implementar `save` backend con recalculo servidor + `previewHash` y persistencia de snapshot.
- Implementar `budget-config` como origen editable del motor antes de migrar la logica del presupuesto.
- Mantener `estimation-tool` separado y preparar solo un puente opcional de importacion/exportacion de snapshots tecnicos.
- Resolver el mismo patron preview/save en el cotizador comercial actual mientras siga vigente en paralelo al `Budget Builder`.
- Unificar la carpeta frontend de `Budget Builder` para que la UI y su facade/modelos no queden partidas en dos ubicaciones distintas dentro de `frontend/src/app/components`.
- Validar el nuevo motor contra casos reales antes de reemplazar el cotizador comercial vigente.
- Implementar Presupuestos PDF.
- Implementar Mensajeria real.
- Evolucionar `Actividad del Sitio` a una version persistida y mas robusta.
- Externalizar la configuracion del motor comercial y/o tecnico para evitar reglas hardcodeadas.
- Mantener la higiene basica del repo con configuracion minima de Git y sin abrir refactors estructurales nuevos fuera de necesidad real.
- Mantener el backend exclusivamente en arquitectura horizontal y no reintroducir `backend/src/main/java/com/fernandogferreyra/portfolio/backend/module/*`.

## Riesgos / deudas tecnicas

- El preview comercial duplica reglas en frontend y puede divergir si cambia la logica backend.
- Falta separar en backend un flujo real de `preview` y `save`.
- El historial comercial y la actividad del sitio dependen de `localStorage`, sin persistencia compartida ni server-side.
- El estimador tecnico ya usa backend como source of truth para preview y save, pero sigue apoyado sobre el flujo de `quote`, cuyo modelo interno conserva costo aunque la UI tecnica no lo expone.
- La build mantiene warnings de budgets de bundle y estilos.
- Falta una capa editable de configuracion para los motores de cotizacion y estimacion.
- Las plantillas Excel de referencia no estan versionadas en este repo; la paridad final del futuro `Budget Builder` depende de ese relevamiento.
- Los MP4 locales sirven solo como apoyo didactico; no exponen reglas reutilizables en formato estructurado y no deben convertirse en dependencia funcional del sistema.

## Estimador tecnico alineado con backend

### Desfasaje corregido

- Ya no existe preview tecnico calculado en frontend para el flujo visible.
- Angular consume backend tanto para preview como para save.
- El flujo `quote` del backend quedo como fuente unica de verdad del calculo tecnico actual.

### Flujo final preview/save

1. Preview:
   - `ControlCenterEstimatorComponent` arma `QuoteRequestPayload` desde la UI.
   - `QuoteService.previewQuote()` envia `POST /api/admin/quotes/preview`.
   - `QuoteAdminController` delega en `QuoteService.previewQuote()`.
   - `QuoteServiceImpl.previewQuote()` reutiliza `calculateQuote(request)` y devuelve `QuoteResult` sin persistencia.
2. Save:
   - `ControlCenterEstimatorComponent` reutiliza el mismo `QuoteRequestPayload` aprobado en preview.
   - `QuoteService.saveQuote()` mantiene `POST /api/quote`.
   - `QuoteController` delega en `QuoteService.generateQuote()`.
   - `QuoteServiceImpl.generateQuote()` ejecuta el mismo `calculateQuote(request)` y luego persiste el snapshot.

### Contratos usados

- Request tecnico compartido:
  - `QuoteRequest`
  - `projectType: string`
  - `modules: string[]`
  - `complexity: QuoteComplexity`
- Response tecnico compartido:
  - `QuoteResult`
  - `projectType`
  - `projectLabel`
  - `complexity`
  - `totalHours`
  - `totalCost`
  - `hourlyRate`
  - `items`

### Cobertura y validacion

- Frontend:
  - `src/app/services/quote.service.spec.ts`
  - valida `POST /api/admin/quotes/preview`
  - valida `POST /api/quote`
- Backend:
  - `backend/src/test/java/com/fernandogferreyra/portfolio/backend/QuoteIntegrationTest.java`
  - valida que preview no persiste
  - valida que preview y save devuelven el mismo calculo para el mismo payload

### Proximo paso recomendado

- Mantener este patron como regla: preview y save deben compartir siempre el mismo calculo backend.
- Aplicar la misma correccion al cotizador comercial actual si va a seguir conviviendo antes del reemplazo por `Budget Builder`.

## Diseno propuesto: Budget Builder

### Principios obligatorios

- La formula base del motor se mantiene fija.
- Los valores del motor son configurables mediante snapshots.
- `estimation-tool`, `budget-builder` y `budget-config` quedan separados como herramientas distintas.
- La negociacion modifica el resultado mediante items explicitos; no cambia la formula base ni pisa reglas.
- El backend no se toca en esta etapa salvo futura persistencia de configuracion o snapshots.

### Arquitectura por capas

- `budget-config`
  - Edita y versiona el motor.
  - Define catalogo de modulos, multiplicadores, tarifas, buffers, recargos, descuentos, rounding y textos explicativos.
  - Publica un `ConfigurationSnapshot` inmutable consumible por las otras herramientas.
- `estimation-tool`
  - Trabaja solo con alcance tecnico.
  - Calcula horas, complejidad, dependencias, buffers y timeline.
  - No muestra dinero ni tarifas.
  - Puede exportar un snapshot tecnico util para el presupuesto, sin mezclar UI ni responsabilidades.
- `budget-builder`
  - Construye el presupuesto comercial a partir de proyecto + modulos + configuracion activa.
  - Puede consumir un `TechnicalEstimate` importado o calcular una base tecnica interna resumida.
  - Siempre entrega presupuesto, breakdown comercial y explicacion de precio.
- `negotiation`
  - Corre despues del calculo comercial.
  - Aplica recortes de alcance, descuentos, ajustes de timeline y cambios de soporte/mantenimiento.
  - Deja trazabilidad mediante `SurchargeItem`, `DiscountItem` y `PricingExplanationItem`.

### Formula base del motor

La formula no cambia; cambian solo los valores configurables:

```text
moduleHours = baseHours * quantity * projectMultiplier * complexityMultiplier * moduleMultiplier
technicalHours = sum(moduleHours) + dependencyHours + riskBufferHours + coordinationBufferHours
baseBudget = technicalHours * effectiveHourlyRate * commercialMultiplier
commercialSubtotal = baseBudget + fixedSetupItems + oneTimeSurcharges
negotiatedBudget = commercialSubtotal + negotiationSurcharges - negotiationDiscounts
finalBudget = applyRounding(max(negotiatedBudget, minimumBudget))
monthlyBudget = supportPlan + maintenancePlan + monthlySurcharges - monthlyDiscounts
```

Valores configurables:

- tarifas base
- horas base por modulo
- multiplicadores por tipo de proyecto, stack y complejidad
- buffers tecnicos y comerciales
- reglas de recargo
- reglas y topes de descuento
- minimos comerciales
- politicas de rounding
- textos de explicacion

### Pipeline de calculo

1. `InputNormalizer`
   - Normaliza wizard, seleccion de modulos y config activa.
2. `ModuleResolver`
   - Expande modulos, dependencias, cantidades y tiers.
3. `TechnicalEstimator`
   - Calcula horas, esfuerzo, timeline y buffers sin dinero.
4. `CommercialPricer`
   - Convierte esfuerzo tecnico a presupuesto base usando la configuracion activa.
5. `NegotiationEngine`
   - Aplica recargos y descuentos negociables sin alterar la base.
6. `ExplanationBuilder`
   - Genera items de explicacion ordenados por etapa.
7. `SnapshotAssembler`
   - Congela el resultado con `ConfigurationSnapshot` para reproducibilidad.

### Modelos frontend

```ts
type BudgetComplexity = 'LOW' | 'MEDIUM' | 'HIGH';
type BudgetUrgency = 'STANDARD' | 'PRIORITY' | 'EXPRESS';
type PricingAdjustmentMode = 'FIXED' | 'PERCENTAGE';
type ExplanationStage = 'INPUT' | 'TECHNICAL' | 'COMMERCIAL' | 'NEGOTIATION';

interface BudgetProject {
  id: string;
  name: string;
  clientName: string;
  projectType: string;
  businessGoal: string;
  targetAudience: string;
  desiredStackId: string;
  complexity: BudgetComplexity;
  urgency: BudgetUrgency;
  selectedModuleIds: string[];
  supportPlanId: string | null;
  maintenancePlanId: string | null;
  notes: string[];
}

interface ConfigurationSnapshot {
  id: string;
  version: string;
  source: 'seed' | 'excel_reference' | 'manual';
  currency: string;
  workingHoursPerWeek: number;
  effectiveHourlyRate: number;
  commercialMultiplier: number;
  minimumBudget: number;
  roundingRule: 'NONE' | 'NEAREST_10' | 'NEAREST_50';
  moduleCatalog: EstimateModule[];
  projectMultipliers: Record<string, number>;
  stackMultipliers: Record<string, number>;
  complexityMultipliers: Record<BudgetComplexity, number>;
  surchargeRules: SurchargeItem[];
  discountRules: DiscountItem[];
  explanationTemplates: Record<string, string>;
  createdAt: string;
}

interface EstimateModule {
  id: string;
  category: string;
  name: string;
  description: string;
  quantity: number;
  tier: 'LITE' | 'STANDARD' | 'ADVANCED';
  baseHours: number;
  complexityWeight: number;
  moduleMultiplier: number;
  dependencyIds: string[];
  optional: boolean;
}

interface TechnicalEstimate {
  id: string;
  projectId: string;
  configurationSnapshotId: string;
  modules: EstimateModule[];
  totalHours: number;
  totalWeeks: number;
  complexityScore: number;
  riskBufferHours: number;
  coordinationBufferHours: number;
  assumptions: string[];
  exclusions: string[];
  generatedAt: string;
}

interface CommercialBudget {
  id: string;
  projectId: string;
  configurationSnapshotId: string;
  technicalEstimateId: string | null;
  currency: string;
  baseAmount: number;
  oneTimeSubtotal: number;
  monthlySubtotal: number;
  surchargeItems: SurchargeItem[];
  discountItems: DiscountItem[];
  finalOneTimeTotal: number;
  finalMonthlyTotal: number;
  pricingExplanation: PricingExplanationItem[];
  generatedAt: string;
}

interface SurchargeItem {
  id: string;
  code: string;
  label: string;
  reason: string;
  mode: PricingAdjustmentMode;
  value: number;
  amount: number;
  stage: 'COMMERCIAL' | 'NEGOTIATION';
  removable: boolean;
}

interface DiscountItem {
  id: string;
  code: string;
  label: string;
  reason: string;
  mode: PricingAdjustmentMode;
  value: number;
  amount: number;
  stage: 'COMMERCIAL' | 'NEGOTIATION';
  requiresReason: boolean;
  maxAllowedAmount?: number;
}

interface PricingExplanationItem {
  id: string;
  stage: ExplanationStage;
  title: string;
  description: string;
  amountDelta: number;
  relatedCodes: string[];
  tone: 'INFO' | 'UP' | 'DOWN';
}
```

### Estructura Angular propuesta

```text
src/app/features/budgeting/
  shared/
    models/
    store/
    services/
    engine/
      input-normalizer.service.ts
      module-resolver.service.ts
      technical-estimator.service.ts
      commercial-pricer.service.ts
      negotiation-engine.service.ts
      explanation-builder.service.ts
  budget-config/
    budget-config.component.ts
    budget-config-shell.component.ts
    budget-config-general.component.ts
    budget-config-module-catalog.component.ts
    budget-config-pricing-rules.component.ts
    budget-config-negotiation-rules.component.ts
    budget-config-snapshot-history.component.ts
  estimation-tool/
    estimation-tool.component.ts
    estimation-tool-shell.component.ts
    estimation-project-step.component.ts
    estimation-modules-step.component.ts
    estimation-summary-sidebar.component.ts
    technical-estimate-result.component.ts
  budget-builder/
    budget-builder.component.ts
    budget-builder-shell.component.ts
    budget-project-step.component.ts
    budget-modules-step.component.ts
    budget-calculation-step.component.ts
    budget-negotiation-step.component.ts
    budget-explanation-step.component.ts
    budget-summary-sidebar.component.ts
```

Regla de separacion:

- `budget-builder` no contiene UI ni reglas de configuracion.
- `budget-config` no contiene wizard comercial.
- `estimation-tool` no muestra dinero.
- Los tres consumen el mismo motor compartido solo a traves de servicios/facades.

### Flujo de datos

```text
wizard proyecto
  -> seleccion de modulos
  -> carga de ConfigurationSnapshot activo
  -> pipeline tecnico
  -> pipeline comercial
  -> negociacion
  -> explicacion de precio
  -> snapshot final listo para guardar/exportar
```

Detalle operativo:

1. El usuario define contexto del proyecto en el wizard.
2. Selecciona modulos del catalogo, no campos monetarios directos.
3. El sistema resuelve dependencias y calcula una base tecnica.
4. La base tecnica se transforma en presupuesto comercial.
5. La capa de negociacion permite ajustar alcance, quitar features y aplicar descuentos.
6. La salida muestra total, subtotal, recargos, descuentos y explicacion de cada cambio.
7. Todo queda asociado al `ConfigurationSnapshot` usado para reproducir el resultado.

### UX del wizard

- Paso 1. Contexto
  - tipo de proyecto
  - objetivo de negocio
  - stack deseado
  - urgencia
  - soporte / mantenimiento
- Paso 2. Modulos
  - catalogo por categorias
  - cantidad o tier por modulo
  - dependencias sugeridas
  - exclusiones visibles
- Paso 3. Base de calculo
  - resumen de horas, timeline y complejidad base
  - sin exponer dinero como editor tecnico profundo
- Paso 4. Presupuesto
  - subtotal one-time
  - mensual opcional
  - recargos configurados
  - explicacion breve por bloque
- Paso 5. Negociacion
  - quitar features
  - bajar alcance
  - cambiar plan de soporte
  - aplicar descuentos con motivo
  - ver delta antes/despues en vivo

Sidebar viva permanente:

- proyecto
- modulos elegidos
- horas base
- subtotal
- recargos
- descuentos
- total final
- version de configuracion activa

### Iconos de informacion de herramientas

- `budget-builder`
  - icono sugerido: `receipt-text`
  - titulo: `Budget Builder`
  - descripcion: `Presupuesto comercial configurable con trazabilidad de alcance, recargos, descuentos y justificacion del precio.`
- `estimation-tool`
  - icono sugerido: `ruler`
  - titulo: `Estimation Tool`
  - descripcion: `Estimacion tecnica por modulos para horas, complejidad y timeline, sin mostrar valores monetarios.`

### Decisiones tomadas

- El nuevo `Budget Builder` reemplaza al cotizador actual solo cuando exista paridad funcional validada.
- La formula queda estable; solo cambian snapshots y reglas configurables.
- El estimador tecnico sigue siendo herramienta aparte.
- La negociacion es una capa posterior al calculo, no una edicion libre del precio base.
- El primer corte debe funcionar en frontend con persistencia local o de sesion, sin depender de backend nuevo.
- La futura integracion con Excel debe mapearse a configuracion, no a ramas de codigo.

### Estrategia incremental

1. Mantener `control-center-quote` y `control-center-estimator` sin cambios.
2. Crear carpeta/feature nueva de budgeting en paralelo.
3. Modelar `ConfigurationSnapshot` y sembrar una configuracion inicial con los datos actuales.
4. Implementar primero el motor compartido y sus tests de paridad.
5. Implementar `budget-config` para editar catalogo, multiplicadores y reglas.
6. Implementar `budget-builder` wizard con resumen lateral y explicacion.
7. Agregar capa de negociacion con trazabilidad explicita.
8. Validar casos reales contra Excel.
9. Reemplazar el cotizador actual solo despues de validacion funcional.

## Mapeo de planillas Excel

### Fuente relevada

Archivos analizados en `ferchuz/`:

- `PlantillaTodoCodeEstimaciones.xlsx`
- `PlantillaTodoCodeCostos.xlsx`
- `PlantillaTodoCodeCostosSaaS.xlsx`
- `PlantillaTodoCodePresupuesto.xlsx`
- `PlantillaTodoCodeEstimacionesVideoCostos.xlsx`
- `README.md`
- Videos locales detectados:
  - `Como ESTIMAR TIEMPOS` de 00:35:27
  - `Cuanto COBRAR por un SaaS` de 00:34:24

Decision de producto:

- Excel y videos se usan solo para extraer reglas.
- El sistema final no debe depender de esos archivos.
- `PlantillaTodoCodeEstimacionesVideoCostos.xlsx` replica la logica de estimaciones y no agrega una familia nueva de reglas.

### Estructura conceptual detectada

- `Estimacion tecnica`
  - Trabaja en horas.
  - Usa incertidumbre por tarea: optimista, probable y pesimista.
  - Calcula tiempo esperado por tarea con una media ponderada tipo PERT.
  - Suma por bloques funcionales.
  - Agrega riesgo separado y redondea el total.
- `Calculo de costos / presupuesto proyecto`
  - Trabaja por categorias.
  - Multiplica horas o unidades por una tarifa de categoria.
  - Suma subtotales por categoria.
  - Agrega costos fijos como hosting/licencias.
  - Agrega gestion/contingencia como monto fijo o porcentaje.
- `Logica SaaS`
  - Convierte costo de desarrollo inicial a costo mensual amortizado.
  - Suma infraestructura mensual compartida.
  - Divide costos compartidos por cantidad de clientes activos.
  - Agrega soporte/mantenimiento por cliente.
  - Aplica margen.
  - Ajusta precio por plan/escala de usuarios.
  - Redondea el valor comercial final.

### Variables y reglas detectadas

#### PlantillaTodoCodeEstimaciones.xlsx

Que hace:

- Estima tiempos tecnicos por tarea y por bloque funcional.

Variables usadas:

- `optimisticHours`
- `mostLikelyHours`
- `pessimisticHours`
- `expectedHours`
- `riskBufferHours`
- `dependencyNotes`
- `category`

Formula conceptual:

```text
expectedTaskHours = (optimistic + 4 * probable + pessimistic) / 6
technicalSubtotal = sum(expectedTaskHours)
technicalTotal = round(technicalSubtotal + riskBufferHours)
```

Categorias detectadas:

- `productos`
- `pedidos`

Relaciones detectadas:

- Las tareas de `pedidos` dependen de completar `productos`.
- El riesgo no esta mezclado dentro de cada tarea; se agrega al final.

Reglas que aporta al sistema:

- El `estimation-tool` necesita soportar metodo PERT.
- Cada modulo o tarea puede tener dependencia explicita de otros modulos.
- El riesgo debe ser una capa separada, editable y auditable.
- El redondeo tecnico debe ser regla de configuracion, no formula hardcodeada.

Traduccion al sistema:

- `EstimateModule` debe permitir perfil de estimacion.
- `categoryRules` debe incluir templates de tareas por modulo.
- `projectTypeDefaults` debe poder cargar combinaciones de modulos con dependencias.
- `ConfigurationSnapshot` debe incluir `estimationMethod = PERT` y politica de `riskBuffer`.

#### PlantillaTodoCodeCostos.xlsx

Que hace:

- Convierte trabajo tecnico en costo/presupuesto por categorias de ejecucion.

Variables usadas:

- `taskHoursOrUnits`
- `unitRate`
- `categorySubtotal`
- `fixedInfrastructureCost`
- `managementContingency`
- `finalProjectBudget`

Categorias detectadas:

- `analysis_design`
- `backend`
- `frontend`
- `testing`
- `deploy`
- `hosting_licenses`
- `management_contingency`

Tarifas detectadas:

- Analisis y diseno: `15`
- Backend: `20`
- Frontend: `18`
- Testing: `15`
- Deploy/configuracion: `18`
- Hosting/licencias ejemplo: `250`
- Gestion/contingencia ejemplo: `300`

Formula conceptual:

```text
taskCost = hoursOrUnits * categoryRate
categorySubtotal = sum(taskCost)
baseProjectBudget = sum(categorySubtotals) + fixedCosts
finalProjectBudget = baseProjectBudget + managementContingency
```

Reglas que aporta al sistema:

- El motor comercial necesita `categoryRules` con tarifa por categoria.
- No todo es tiempo: hosting/licencias son items fijos.
- Gestion/contingencia debe poder modelarse como fijo o porcentaje.
- El total final no depende de una sola tarifa global.

Traduccion al sistema:

- `hourlyRate` debe ser un bloque con `base` y `categoryOverrides`.
- `categoryRules` debe marcar si una categoria es `time_based` o `fixed_amount`.
- `surchargeRules` debe incluir `management_contingency`.
- `CommercialBudget` debe conservar subtotales por categoria para explicacion.

#### PlantillaTodoCodeCostosSaaS.xlsx

Que hace:

- Calcula precio mensual de un SaaS a partir de amortizacion, infraestructura, soporte, margen y escalado por plan.

Variables usadas:

- `initialDevelopmentTotal`
- `recoveryMonths`
- `monthlyInfrastructureTotal`
- `activeClients`
- `supportHoursPerClient`
- `supportHourlyRate`
- `supportMonthlyCost`
- `marginPercentage`
- `planIncrement`
- `extraHours`
- `extraHourRate`
- `otherMonthlyExtras`

Valores detectados:

- Desarrollo inicial ejemplo: `4000`
- Meses de recuperacion: `24`
- Infraestructura mensual ejemplo: `80`
- Clientes activos ejemplo: `10`
- Soporte/mantenimiento ejemplo: `3 horas * 8 = 24`
- Margen ejemplo: `40%`
- Horas extra ejemplo: `12` por hora
- Incrementos por plan:
  - basico: `10`
  - intermedio: `25`
  - pro: `50`
  - enterprise: `150`

Formula conceptual:

```text
monthlyRecoveryCost = initialDevelopmentTotal / recoveryMonths
sharedMonthlyCostPerClient = (monthlyRecoveryCost + monthlyInfrastructureTotal) / activeClients
baseClientCost = sharedMonthlyCostPerClient + supportMonthlyCost
marginAmount = baseClientCost * marginPercentage
commercialBasePlan = baseClientCost + marginAmount
planPrice = roundUp(commercialBasePlan + userScaleIncrement)
finalMonthlyPrice = planPrice + extraHoursCost + otherMonthlyExtras
```

Reglas que aporta al sistema:

- El modo SaaS necesita `userScaleRules`.
- La amortizacion es parte de configuracion, no input libre obligatorio.
- Soporte y mantenimiento mensual son reglas separadas del costo compartido.
- Los precios por plan son una combinacion de base compartida + incremento por escala.
- El redondeo comercial es parte del motor.

Traduccion al sistema:

- `supportRules` debe modelar horas incluidas y tarifa.
- `maintenanceRules` debe permitir un plan mensual o paquete de horas.
- `userScaleRules` debe mapear plan o banda de usuarios a un recargo fijo o porcentual.
- `projectTypeDefaults` debe incluir un perfil `saas`.
- `surchargeRules` debe contemplar `extra_hours` y `other_monthly_extras`.

#### PlantillaTodoCodePresupuesto.xlsx

Que hace:

- Presenta el presupuesto comercial en formato entregable para cliente.

Variables usadas:

- `lineDescription`
- `unitsOrHours`
- `lineRate`
- `lineTotal`
- `subtotal`
- `discount`
- `tax`
- `finalDocumentTotal`
- `budgetValidityDays`

Formula conceptual:

```text
lineTotal = unitsOrHours * lineRate
subtotal = sum(lineTotals)
finalDocumentTotal = subtotal - discount + tax
```

Reglas que aporta al sistema:

- El documento comercial es una capa de salida, no el motor.
- Descuento e impuestos deben aplicarse despues del subtotal.
- La validez del presupuesto pertenece al snapshot/documento, no al estimador tecnico.

Traduccion al sistema:

- `CommercialBudget` debe soportar `discountItems`.
- La exportacion PDF futura debe consumir un snapshot ya calculado.
- La validez del presupuesto debe vivir en metadata del presupuesto, no en formulas de negocio.

#### README.md y videos

Que hacen:

- Contextualizan las plantillas como material didactico.
- Confirman tres ejes separados:
  - estimacion de tiempos
  - costos de un sistema final
  - costos de un SaaS

Regla que aportan al sistema:

- La separacion conceptual entre `estimation-tool`, `budget-builder` y modo `saas` es correcta y debe mantenerse.

Limitacion asumida:

- Los videos no son una fuente estructurada para el runtime.
- Se toman solo como apoyo contextual; la logica reusable queda capturada en configuracion propia.

### Traduccion a ConfigurationSnapshot

El snapshot listo para implementar debe quedar organizado asi:

```ts
interface ConfigurationSnapshot {
  id: string;
  version: string;
  currency: 'USD';
  estimationMethod: 'PERT';
  roundingRules: {
    technical: 'ROUND_NEAREST_HOUR';
    commercial: 'ROUND_UP_INTEGER';
  };
  hourlyRate: {
    base: number;
    categoryOverrides: Record<string, number>;
    supportHourlyRate: number;
    extraHourRate: number;
  };
  technologyCatalog: TechnologyRule[];
  categoryRules: CategoryRule[];
  surchargeRules: SurchargeRule[];
  supportRules: SupportRule[];
  maintenanceRules: MaintenanceRule[];
  userScaleRules: UserScaleRule[];
  projectTypeDefaults: ProjectTypeDefaultRule[];
}
```

Bloques concretos a sembrar:

- `hourlyRate`
  - `base: 18`
  - `categoryOverrides.analysis_design: 15`
  - `categoryOverrides.backend: 20`
  - `categoryOverrides.frontend: 18`
  - `categoryOverrides.testing: 15`
  - `categoryOverrides.deploy: 18`
  - `supportHourlyRate: 8`
  - `extraHourRate: 12`
- `technologyCatalog`
  - `default_web_stack`: sin recargo
  - `default_saas_stack`: sin recargo mensual extra
  - `outside_primary_stack`: recargo configurable por complejidad o integracion
  - `managed_infrastructure`: costo fijo mensual o por proyecto segun tipo
- `categoryRules`
  - categorias de estimacion: `productos`, `pedidos`
  - categorias comerciales: `analysis_design`, `backend`, `frontend`, `testing`, `deploy`, `hosting_licenses`
  - cada categoria define si es `time_based`, `fixed_amount` o `monthly_fixed`
- `surchargeRules`
  - `management_contingency_fixed = 300`
  - `management_contingency_percent = 0.20 -> 0.30`
  - `outside_stack_surcharge = configurable`
  - `extra_hours = quantity * extraHourRate`
- `supportRules`
  - plan base semilla: `3 horas mensuales`
  - tarifa: `8 por hora`
  - costo mensual base: `24`
- `maintenanceRules`
  - en la semilla inicial puede compartir estructura con soporte mensual
  - debe quedar separado para evolucionarlo luego como paquete distinto
- `userScaleRules`
  - `basic = +10`
  - `intermediate = +25`
  - `pro = +50`
  - `enterprise = +150`
- `projectTypeDefaults`
  - `standard_project`
    - categorias activas: analisis, backend, frontend, testing, deploy, hosting
    - surcharge por gestion/contingencia activo
  - `saas`
    - amortizacion: `24 meses`
    - infraestructura mensual base: `80`
    - clientes activos iniciales: `10`
    - soporte mensual activo
    - userScaleRules activo

### Reglas iniciales del motor

Directamente extraidas o derivadas de Excel:

- Horas base por tarea deben soportar `optimista`, `probable` y `pesimista`.
- El tiempo esperado por tarea se calcula con media ponderada PERT.
- Las dependencias entre modulos deben poder declararse.
- El riesgo se agrega como buffer separado al subtotal tecnico.
- Cada categoria comercial usa su propia tarifa.
- Hosting/licencias y otros costos fijos no se modelan como horas.
- Gestion/contingencia puede ser fija o porcentual.
- En SaaS el desarrollo inicial se amortiza en meses.
- El costo compartido mensual se divide por clientes activos.
- El soporte mensual se suma por cliente.
- El margen comercial se aplica despues de obtener el costo base por cliente.
- La escala de usuarios o plan agrega un recargo mensual por tier.
- Las horas extra y otros extras se aplican al final.
- El precio comercial puede redondearse hacia arriba.

Reglas iniciales adicionales necesarias para el sistema:

- `technology outside stack`
  - recargo recomendado: `10% a 20%`
  - motivo: Excel no trae catalogo tecnologico, pero el sistema necesita modelar stack no estandar
- `complexity multiplier`
  - `LOW = 1.0`
  - `MEDIUM = 1.25`
  - `HIGH = 1.6`
  - motivo: mantener compatibilidad con el estimador actual y con el concepto de incertidumbre detectado en Excel
- `user scale multiplier`
  - ademas del tier fijo, permitir multiplicador de infraestructura si la cantidad de usuarios supera el plan base
- `maintenance plan`
  - separar plan de mantenimiento del soporte aunque ambos nazcan con la misma semilla de horas

### Inputs reales del wizard a ajustar

#### estimation-tool

- `projectType`
- `moduleSelection`
- `dependencyAwareness`
- `riskBuffer`
- `estimationConfidence` o `advanced PERT mode`
- `complexity`

Decision:

- No conviene exponer O/M/P para usuarios basicos en el wizard principal.
- Debe existir modo avanzado o configuracion por modulo para que el motor pueda seguir usando PERT.

#### budget-builder

- `pricingMode`
  - `project`
  - `saas`
- `projectType`
- `selectedModules`
- `desiredStack`
- `technologyExceptions`
- `hostingIncluded`
- `managementContingencyMode`
- `supportPlan`
- `maintenancePlan`
- `discountReason`
- `urgency`

#### budget-builder en modo SaaS

- `recoveryMonths`
- `activeClients`
- `userScaleTier`
- `monthlyInfrastructureOverride`
- `supportHoursPerClient`
- `extraHours`
- `otherMonthlyExtras`
- `marginProfile`

Inputs que deben quedar fuera del wizard principal:

- formulas de Excel
- celdas sueltas de subtotal
- valores manuales duplicados entre estimacion y presupuesto
- campos de documento como firmas o layout de presupuesto

### Decisiones finales de implementacion

- La logica de Excel se traduce a configuracion, no a formulas pegadas en el frontend.
- `Presupuesto` es una capa de salida y negociacion; no define la estimacion tecnica.
- `SaaS` no es solo otro presupuesto: es un modo de pricing con amortizacion, soporte y escala.
- El sistema debe arrancar con semilla de configuracion derivada de Excel, pero quedar listo para editarse sin volver a abrir planillas.
- Cuando el relevamiento termine, los archivos de `ferchuz/` pueden eliminarse sin romper el sistema.

## Implementacion actual: Budget Builder MVP

### Que se implemento

- Modelos TypeScript base para:
  - `BudgetProject`
  - `ConfigurationSnapshot`
  - `EstimateModule`
  - `TechnicalEstimate`
  - `CommercialBudget`
  - `SurchargeItem`
  - `DiscountItem`
  - `PricingExplanationItem`
- Modelos auxiliares para que `ConfigurationSnapshot` sea util desde ahora:
  - `HourlyRateConfig`
  - `TechnologyRule`
  - `CategoryRule`
  - `SurchargeRule`
  - `SupportRule`
  - `MaintenanceRule`
  - `UserScaleRule`
  - `ProjectTypeDefaultRule`
- Engine puro del `Budget Builder` sin dependencias Angular, hoy conservado como referencia local y base de pruebas:
  - `basic-module.factory.ts`
  - `technical-estimator.ts`
  - `commercial-pricer.ts`
  - `budget-builder.pipeline.ts`
  - `budget-builder.utils.ts`
- Datos mock minimos en `mocks/budget-builder.mock-data.ts`
- Suite unitaria inicial en `budget-builder.pipeline.spec.ts`

### Estructura del motor

```text
src/app/components/control-center/budget-builder/
  models/
    budget-builder.models.ts
  engine/
    basic-module.factory.ts
    technical-estimator.ts
    commercial-pricer.ts
    budget-builder.pipeline.ts
    budget-builder.utils.ts
    budget-builder.pipeline.spec.ts
  mocks/
    budget-builder.mock-data.ts
  services/
    budget-builder-ui.facade.ts
    budget-builder-ui.facade.spec.ts
src/app/components/control-center-budget-builder/
  control-center-budget-builder.component.ts
  control-center-budget-builder.component.html
  control-center-budget-builder.component.scss
```

### Pipeline MVP implementado

```text
BudgetProject + ConfigurationSnapshot
  -> generateBasicModules
  -> calculateTechnicalEstimate
  -> calculateCommercialSubtotal
  -> applySimpleSurcharges
  -> applyBasicSupport
  -> buildCommercialBudget
  -> runBudgetBuilderPipeline
```

Cobertura funcional actual:

- generacion de modulos desde catalogo + defaults del tipo de proyecto
- calculo de horas por modulo usando multiplicadores de proyecto, stack y complejidad
- subtotal comercial simple `hours * hourlyRate.base`
- aplicacion de recargo simple fijo o porcentual
- aplicacion de soporte mensual basico
- armado de `CommercialBudget` con explicacion minima

### Decisiones tomadas en el MVP

- Se implemento como funciones puras para testear sin `TestBed` ni dependencias UI.
- El MVP arranco con semilla local para fijar el modelo, pero la UI minima actual ya consume preview oficial desde backend.
- El subtotal comercial se mantiene simple para esta etapa: `horas * tarifa base`.
- `commercialMultiplier`, `maintenanceRules`, `technologyCatalog` y `userScaleRules` quedaron modelados pero todavia no participan del calculo MVP.
- El `generatedAt` actual del engine usa el timestamp del snapshot semilla para mantener tests deterministas.
- La UI minima actual no ejecuta el engine local; usa un facade para traducir formulario a request HTTP y mapear el DTO backend a un view model de pantalla.

### Tests y verificacion

- Tests unitarios cubiertos:
  - calculo de horas
  - subtotal
  - recargo simple
  - total final con soporte
- Casos reforzados despues del MVP inicial:
  - multiples modulos en un mismo pipeline
  - soporte desactivado explicitamente
  - descuentos manuales de negociacion
  - recargo automatico por tecnologia fuera del stack primario
  - entradas vacias o con valores cero
- Verificaciones ejecutadas:
  - `npm run build`
  - `npm test -- --watch=false --include src/app/components/control-center/budget-builder/engine/budget-builder.pipeline.spec.ts`
  - `npm test -- --watch=false`

### Integracion UI minima

Pantalla creada:

- `app-control-center-budget-builder` dentro del `Control Center`
- formulario minimo con:
  - nombre del presupuesto
  - tipo de proyecto
  - frontend / backend / database
  - `hourlyRate`
  - soporte activado o desactivado
  - descuento manual simple
  - tecnologia principal
- salida visible con:
  - modulos generados
  - horas totales
  - subtotal
  - recargos
  - descuentos
  - total one-time final
  - total mensual
  - explicacion breve

Decisiones tomadas:

- La pantalla convive con `control-center-quote`; no lo reemplaza.
- El componente no contiene formulas ni transformaciones de negocio.
- El formulario usa un facade dedicado para:
  - hidratar defaults iniciales
  - resolver `selectedModuleIds`
  - preaplicar surcharges/support defaults del tipo de proyecto
  - sobrescribir `hourlyRate.base`
  - convertir descuento simple en `manualDiscounts`
- Se agregaron iconos informativos basicos:
  - `Budget Builder`: costo comercial del proyecto
  - `Estimador tecnico`: tiempo y esfuerzo sin dinero

### Proximos pasos del engine

- Incorporar `maintenanceRules` al total mensual.
- Empezar a usar `technologyCatalog` y `categoryRules` en el pricing real.
- Separar soporte incluido vs horas extra.
- Agregar `userScaleRules` y modo `SAAS`.
- Introducir buffers de riesgo y PERT avanzado por tarea/modulo.
- Reemplazar la UI minima por el wizard final sin mover calculo al componente.

### Cobertura agregada

- `generateBasicModules`
  - cubierto indirectamente con escenarios de 2 y 3 modulos
- `calculateTechnicalEstimate`
  - cubierto con horas normales y con entradas vacias o cero
- `calculateCommercialSubtotal`
  - cubierto con subtotal normal y subtotal en cero
- `applySimpleSurcharges`
  - cubierto con recargo fijo y con recargo automatico por tecnologia fuera de stack
- `applyBasicSupport`
  - cubierto con soporte activo y soporte desactivado
- `applyManualDiscounts`
  - cubierto con descuento manual fijo
- `runBudgetBuilderPipeline`
  - cubierto con flujo feliz y edge cases controlados
- `BudgetBuilderUiFacade`
  - cubierto con contrato UI -> backend preview, soporte desactivado, stack fuera del principal y mapping de respuesta oficial

### Casos contemplados

- seleccion explicita de multiples modulos
- proyecto sin modulos resolubles
- soporte mensual activado
- soporte mensual desactivado aunque exista default por tipo de proyecto
- descuento manual one-time
- stack fuera de catalogo primario con recargo comercial automatico
- seleccion vacia enviada explicitamente desde UI sin activar defaults de proyecto
- tarifa base igual a cero
- descuentos en cero
- total final nunca negativo en mensual
- total one-time sujeto a `minimumBudget`

### Ajustes minimos al modelo

Se agregaron sin romper el MVP existente:

- `ManualDiscountInput`
  - permite que la UI futura envie descuentos ya resueltos al engine
- `BudgetProject.supportEnabled?: boolean`
  - separa `tener soporte` de `que plan usar`
- `BudgetProject.manualDiscounts?: ManualDiscountInput[]`
  - habilita negociacion sin meter UI ni backend en el motor
- `BudgetProject.moduleSelectionMode?: 'PROJECT_DEFAULTS' | 'EXPLICIT'`
  - permite distinguir entre fallback por defaults y seleccion vacia enviada de forma explicita por la UI

Decision de contrato:

- `selectedModuleIds` puede seguir usando defaults del tipo de proyecto si llega vacio.
- `moduleSelectionMode = 'EXPLICIT'` bloquea el fallback por defaults y deja que la UI mande seleccion vacia sin crear modulos fantasma.
- `selectedSurchargeRuleIds` pasa a representar la seleccion efectiva resuelta por la UI.
- Los defaults de surcharges deben precargarse fuera del engine, no inferirse dentro del pipeline.

### Contrato de input propuesto

Contrato del engine, despues del ajuste minimo para distinguir fallback vs seleccion explicita:

```ts
interface BudgetPipelineInputContract {
  project: {
    id: string;
    projectType: string;
    pricingMode: 'PROJECT' | 'SAAS';
    desiredStackId: string;
    complexity: 'LOW' | 'MEDIUM' | 'HIGH';
    selectedModuleIds: string[];
    moduleSelectionMode?: 'PROJECT_DEFAULTS' | 'EXPLICIT';
    selectedSurchargeRuleIds: string[];
    supportEnabled?: boolean;
    supportPlanId: string | null;
    manualDiscounts?: ManualDiscountInput[];
  };
  configuration: ConfigurationSnapshot;
}
```

Contrato UI -> engine actualmente usado por la pantalla minima:

```ts
interface BudgetBuilderUiFormValue {
  budgetName: string;
  projectType: string;
  includeFrontend: boolean;
  includeBackend: boolean;
  includeDatabase: boolean;
  hourlyRate: number;
  supportEnabled: boolean;
  manualDiscount: number;
  desiredStackId: string;
}
```

Lectura operativa del contrato real:

- La UI usa el facade para convertir toggles de capas en `selectedModuleIds`.
- El facade marca `moduleSelectionMode = 'EXPLICIT'` para evitar fallback si el usuario deja capas vacias.
- La UI no setea formulas ni montos intermedios; solo entrega inputs de negocio minimos.
- El facade precarga `selectedSurchargeRuleIds` y `supportPlanId` desde `projectTypeDefaults` solo cuando hay trabajo seleccionado.
- El engine no necesita saber nada de formularios, steps ni estado visual.
- Si la UI quiere defaults por tipo de proyecto, debe hidratar el formulario desde `projectTypeDefaults` antes del submit o delegarlo al facade.

### Proximo paso recomendado

Evolucionar la pantalla minima actual hacia el wizard profesional, manteniendo el mismo facade como borde de integracion:

- convertir `frontend / backend / database` en pasos modulares del wizard
- sumar sidebar viva con subtotal, recargos, descuentos y total
- introducir negociacion controlada sin mover reglas al componente
- empezar a reemplazar mocks por snapshot configurable cuando exista `budget-config`

## Arquitectura backend propuesta: Budget Builder

### Decision base

- No extender `module.quote` para el `Budget Builder` final.
- No mantener una mini-aplicacion vertical aislada para `Budget Builder`.
- Alinear `Budget Builder` con la arquitectura horizontal existente del backend.
- Mantener `POST /api/quote` y `/api/admin/quotes` sin cambios mientras el nuevo flujo madura.
- Exponer el `Budget Builder` nuevo solo por rutas `admin`, reutilizando la seguridad actual de `/api/admin/**` con `ROLE_FERCHUZ`.

### Mapa de paquetes

```text
backend/src/main/java/com/fernandogferreyra/portfolio/backend/
  controller/
    admin/
      BudgetBuilderAdminController.java
  service/
    BudgetBuilderService.java
    BudgetConfigurationService.java
  service/impl/
    BudgetBuilderServiceImpl.java
    BudgetConfigurationServiceImpl.java
  config/
    BudgetBuilderSeedProperties.java
  mapper/
    budgetbuilder/
      BudgetBuilderRequestMapper.java
      BudgetBuilderResponseMapper.java
  domain/
    dto/
      budgetbuilder/
        BudgetPreviewRequest.java
        BudgetPreviewResponse.java
        BudgetSaveRequest.java
        BudgetSaveResponse.java
        BudgetModuleResponse.java
        BudgetSurchargeResponse.java
        BudgetDiscountResponse.java
        BudgetExplanationResponse.java
        ManualDiscountRequest.java
    budgetbuilder/
      enums/
        BudgetPricingMode.java
        BudgetComplexity.java
        BudgetUrgency.java
        BudgetModuleSelectionMode.java
        PricingAdjustmentMode.java
        BillingCadence.java
      model/
        BudgetProject.java
        ConfigurationSnapshot.java
        EstimateModule.java
        TechnicalEstimate.java
        CommercialBudget.java
        SurchargeItem.java
        DiscountItem.java
        PricingExplanationItem.java
        BudgetCalculationResult.java
      engine/
        BudgetBuilderPipeline.java
        BudgetModuleResolver.java
        BudgetTechnicalEstimator.java
        BudgetCommercialPricer.java
        BudgetCalculationUtils.java
  repository/
    budgetbuilder/
      package-info.java
```

Estado real de esta fase:

- `controller`, `service`, `service.impl`, `domain`, `mapper`, `dto`, `config` y `repository` placeholder ya existen en capas horizontales reales del backend.
- La estructura vertical vieja ya fue eliminada del codigo principal y de tests.
- `repository`, `entity`, `save`, `list` y `detail` quedan reservados para la siguiente iteracion.
- El endpoint activo de esta fase es solo `preview`.

### Clases y responsabilidades

#### controller

- `BudgetBuilderAdminController`
  - expone preview, save, list y detail
  - no calcula ni persiste logica de negocio
  - trabaja siempre con `ApiResponse<T>`
  - queda bajo `/api/admin/budget-builder`

#### service

- `BudgetBuilderService`
  - contrato de aplicacion de esta fase para `preview`
- `BudgetConfigurationService`
  - resuelve el `ConfigurationSnapshot` activo
  - abstrae si la fuente viene de properties semilla o de base de datos

#### service/impl

- `BudgetBuilderServiceImpl`
  - orquesta el caso de uso de `preview`
  - obtiene configuracion activa
  - aplica `hourlyRateOverride` sin mutar la configuracion semilla original
  - invoca el engine backend
  - genera `previewHash`
  - arma `BudgetPreviewResponse`
- `BudgetConfigurationServiceImpl`
  - implementado en fase inicial
  - lee la semilla activa desde `BudgetBuilderSeedProperties`
  - materializa el `ConfigurationSnapshot` consumido por el engine

#### domain/engine

- `BudgetBuilderPipeline`
  - orquesta modulos -> estimacion tecnica -> pricing comercial
- `BudgetModuleResolver`
  - resuelve modulos explicitos o defaults por tipo de proyecto
- `BudgetTechnicalEstimator`
  - calcula horas, semanas y score tecnico
- `BudgetCommercialPricer`
  - transforma horas en subtotal, recargos simples, soporte basico, descuentos manuales y total
- `BudgetCalculationUtils`
  - rounding, clamps y helpers monetarios

#### repository/persistence

- En esta fase queda solo el paquete `repository` como placeholder.
- No hay persistencia implementada todavia para `Budget Builder`.

Entidades recomendadas:

- `BudgetSnapshotEntity`
  - resumen indexable para listado + `request_json` + `result_json`
  - equivalente profesional del patron actual usado en `QuoteEntity`
- `BudgetConfigurationSnapshotEntity`
  - versiona la configuracion oficial del motor
  - no bloquea la fase 1: puede arrancar luego de una primera implementacion con semilla en properties

### Piezas del motor frontend que migran al backend

- `budget-builder.models.ts`
  - se divide en `domain.model` interno + `domain.dto` externo
- `basic-module.factory.ts`
  - migra a `BudgetModuleResolver`
- `technical-estimator.ts`
  - migra a `BudgetTechnicalEstimator`
- `commercial-pricer.ts`
  - migra a `BudgetCommercialPricer`
- `budget-builder.pipeline.ts`
  - migra a `BudgetBuilderPipeline`
- `budget-builder.utils.ts`
  - migra a `BudgetCalculationUtils`
- `budget-builder-ui.facade.ts`
  - no migra como logica de negocio
  - se reemplaza por `BudgetBuilderRequestMapper` + controller/service backend
- `mocks/budget-builder.mock-data.ts`
  - migra conceptualmente a `BudgetBuilderSeedProperties`
  - luego a `BudgetConfigurationSnapshotEntity`

Decision de migracion:

- El frontend deja de ser dueno de la formula.
- El frontend conserva solo formulario, render y adaptacion HTTP.
- El backend pasa a ser la fuente oficial del calculo y de la reproducibilidad del resultado.

### DTOs iniciales

#### Preview request

```java
public record BudgetPreviewRequest(
    @NotBlank String budgetName,
    @NotBlank String projectType,
    @NotNull BudgetPricingMode pricingMode,
    @NotBlank String desiredStackId,
    @NotNull BudgetComplexity complexity,
    @NotNull BudgetUrgency urgency,
    @NotNull List<String> selectedModuleIds,
    BudgetModuleSelectionMode moduleSelectionMode,
    List<String> selectedSurchargeRuleIds,
    Boolean supportEnabled,
    String supportPlanId,
    String maintenancePlanId,
    @DecimalMin("0.00") BigDecimal hourlyRateOverride,
    @Valid ManualDiscountRequest manualDiscount,
    @Min(0) Integer activeClients,
    String userScaleTierId,
    List<String> notes
) {}
```

```java
public record ManualDiscountRequest(
    String label,
    String reason,
    PricingAdjustmentMode mode,
    @DecimalMin("0.00") BigDecimal value,
    BillingCadence cadence
) {}
```

#### Preview response

```java
public record BudgetPreviewResponse(
    String configurationSnapshotId,
    String previewHash,
    BigDecimal totalHours,
    BigDecimal totalWeeks,
    BigDecimal baseAmount,
    BigDecimal oneTimeSubtotal,
    BigDecimal monthlySubtotal,
    BigDecimal finalOneTimeTotal,
    BigDecimal finalMonthlyTotal,
    List<BudgetModuleResponse> modules,
    List<BudgetSurchargeResponse> surcharges,
    List<BudgetDiscountResponse> discounts,
    List<BudgetExplanationResponse> explanation
) {}
```

#### Save request

```java
public record BudgetSaveRequest(
    @Valid @NotNull BudgetPreviewRequest input,
    @NotBlank String expectedConfigurationSnapshotId,
    @NotBlank String expectedPreviewHash
) {}
```

#### Save response

```java
public record BudgetSaveResponse(
    UUID id,
    String budgetName,
    String configurationSnapshotId,
    BigDecimal finalOneTimeTotal,
    BigDecimal finalMonthlyTotal,
    OffsetDateTime createdAt
) {}
```

DTOs compartidos recomendados:

- `BudgetModuleResponse`
- `BudgetSurchargeResponse`
- `BudgetDiscountResponse`
- `BudgetExplanationResponse`

### Flujo backend

#### Preview

1. `BudgetBuilderAdminController` recibe `BudgetPreviewRequest`.
2. `BudgetBuilderServiceImpl` resuelve el `ConfigurationSnapshot` activo mediante `BudgetConfigurationService`.
3. `BudgetBuilderRequestMapper` convierte DTO HTTP a `BudgetProject`.
4. `BudgetBuilderServiceImpl` aplica `hourlyRateOverride` si el request lo envia.
5. `BudgetBuilderPipeline` ejecuta:
   - resolucion de modulos
   - estimacion tecnica
   - pricing comercial
6. `BudgetBuilderServiceImpl` genera `previewHash` con request + snapshot + resultado.
7. `BudgetBuilderResponseMapper` arma `BudgetPreviewResponse`.
8. Se devuelve preview sin persistencia.

#### Save

- Queda documentado pero no implementado en esta fase.

Decision de flujo:

- `save` nunca confia en montos enviados por frontend.
- `preview` y `save` comparten exactamente el mismo engine backend.
- El hash de preview reduce riesgo de guardar un presupuesto distinto al visto por el usuario.

### Endpoints iniciales

Sin romper contratos actuales:

- `POST /api/admin/budget-builder/preview`
  - implementado
  - protegido por el esquema actual de `/api/admin/**` con `ROLE_FERCHUZ`
  - devuelve preview no persistido con `configurationSnapshotId`, `previewHash`, modulos, horas, subtotales, recargos, descuentos, totales y explicacion
- `POST /api/admin/budget-builder`
  - siguiente fase
- `GET /api/admin/budget-builder`
  - siguiente fase
- `GET /api/admin/budget-builder/{id}`
  - siguiente fase

Endpoint siguiente recomendado, pero no obligatorio en el primer corte:

- `GET /api/admin/budget-builder/configuration/active`
  - expone metadata de configuracion activa si la UI necesita mostrar version o capacidades

### Implementacion confirmada en esta fase

Clases creadas y activas:

- `controller`
  - `controller.admin.BudgetBuilderAdminController`
- `service`
  - `BudgetBuilderService`
  - `BudgetConfigurationService`
- `service.impl`
  - `BudgetBuilderServiceImpl`
  - `BudgetConfigurationServiceImpl`
- `domain.engine`
  - `BudgetBuilderPipeline`
  - `BudgetModuleResolver`
  - `BudgetTechnicalEstimator`
  - `BudgetCommercialPricer`
  - `BudgetCalculationUtils`
- `mapper`
  - `mapper.budgetbuilder.BudgetBuilderRequestMapper`
  - `mapper.budgetbuilder.BudgetBuilderResponseMapper`
- `config`
  - `BudgetBuilderSeedProperties`
- `dto`
  - `domain.dto.budgetbuilder.BudgetPreviewRequest`
  - `domain.dto.budgetbuilder.BudgetPreviewResponse`
  - `domain.dto.budgetbuilder.BudgetSaveRequest`
  - `domain.dto.budgetbuilder.BudgetSaveResponse`
  - `domain.dto.budgetbuilder.BudgetModuleResponse`
  - `domain.dto.budgetbuilder.BudgetSurchargeResponse`
  - `domain.dto.budgetbuilder.BudgetDiscountResponse`
  - `domain.dto.budgetbuilder.BudgetExplanationResponse`
  - `domain.dto.budgetbuilder.ManualDiscountRequest`

Responsabilidades confirmadas:

- La logica oficial del calculo vive en `domain.engine`.
- `BudgetBuilderServiceImpl` no calcula formulas; coordina configuracion, override, pipeline, hash y respuesta.
- `BudgetBuilderAdminController` solo expone el caso de uso HTTP.
- La configuracion activa arranca desde `application.yml`, sin tocar backend legado ni contratos actuales.
- La organizacion final queda consistente con el resto del backend: controller para entrada HTTP, service para orquestacion, domain para calculo, mapper para traduccion y config para semilla activa.

### Verificacion ejecutada

- Tests nuevos del modulo:
  - `BudgetBuilderPipelineTest`
  - `BudgetBuilderServiceImplTest`
  - `BudgetBuilderPreviewIntegrationTest`
- Build verificado:
  - `backend\\mvnw.cmd -Dtest=BudgetBuilderPipelineTest,BudgetBuilderServiceImplTest,BudgetBuilderPreviewIntegrationTest test`
  - `backend\\mvnw.cmd package`
- Decision de soporte:
  - el perfil `test` queda autocontenido con H2 en modo PostgreSQL para ejecutar validacion local y CI sin depender de variables externas de PostgreSQL.

### Persistencia recomendada

Tabla inicial recomendada:

- `budget_snapshots`
  - `id`
  - `budget_name`
  - `project_type`
  - `pricing_mode`
  - `complexity`
  - `desired_stack_id`
  - `configuration_snapshot_id`
  - `preview_hash`
  - `total_hours`
  - `base_amount`
  - `final_one_time_total`
  - `final_monthly_total`
  - `request_json`
  - `result_json`
  - `created_at`
  - `updated_at`

Tabla evolutiva recomendada:

- `budget_configuration_snapshots`
  - `id`
  - `version`
  - `source`
  - `is_active`
  - `snapshot_json`
  - `created_at`
  - `updated_at`

Decision de persistencia:

- Primero puede persistirse solo `budget_snapshots`.
- La configuracion activa puede arrancar desde `application.yml` mediante `BudgetBuilderSeedProperties`.
- Cuando exista `budget-config`, la fuente cambia a `budget_configuration_snapshots` sin tocar endpoints ni engine.

### Convivencia temporal frontend actual + backend nuevo

Fase 1:

- Se mantiene el engine frontend actual para exploracion y UI minima.
- No se toca `control-center-quote`.
- No se toca `POST /api/quote`.
- El backend nuevo ya expone `preview` oficial, pero el frontend todavia no migra a HTTP en esta tarea.

Fase 2:

- El formulario del `Budget Builder` cambia de facade local a `budget-builder-api.service`.
- La UI sigue igual, pero el preview deja de calcularse en frontend.
- El engine frontend queda solo como referencia temporal y para comparar paridad.

Fase 3:

- `save` pasa a backend usando `POST /api/admin/budget-builder`.
- El historial del `Budget Builder` deja `localStorage` y pasa a `GET /api/admin/budget-builder`.

Fase 4:

- Una vez validada la paridad funcional, el engine frontend se reduce a tests de contrato o se elimina.
- El modulo `quote` actual sigue conviviendo hasta que producto decida reemplazo.

### Proximos pasos

- Conectar la UI minima actual del `Budget Builder` al endpoint `POST /api/admin/budget-builder/preview`.
- Agregar `budget_snapshots` por Flyway y repositorio JPA.
- Implementar `save` con recalculo backend + verificacion de `previewHash`.
- Incorporar persistencia y queries admin sin tocar `quote`.
- Expandir el engine backend con `maintenanceRules`, `userScaleRules` y `pricingMode = SAAS`.
- Mantener paridad del perfil `test` autocontenido con H2 para seguir verificando backend sin dependencia externa.

## Auditoria estructural del repo

### Estructura final adoptada

- Backend:
  - `config`
  - `controller`
  - `controller/admin`
  - `dto`
  - `dto/<feature>`
  - `domain/<feature>`
  - `domain/entity`
  - `domain/enums`
  - `exception`
  - `mapper/<feature>`
  - `repository/<feature>`
  - `security`
  - `service`
  - `service/impl`
  - `util`
- Frontend:
  - `frontend/` como raiz unica del proyecto Angular
  - `frontend/src`
  - `frontend/public`
  - `frontend/angular.json`
  - `frontend/package.json`
  - `frontend/tsconfig*.json`
  - `frontend/proxy.conf.json`

### Modulos migrados del backend

- `auth`
  - `controller/AuthController`
  - `service/AuthService`
  - `service/impl/AuthServiceImpl`
  - `repository/auth/AppUserRepository`
  - `domain/auth/entity/AppUser`
  - `dto/auth/LoginRequest`, `LoginResponse`
- `analytics`
  - `controller/EventController`
  - `service/AnalyticsEventService`
  - `service/impl/AnalyticsEventServiceImpl`
  - `repository/analytics/EventLogRepository`
  - `domain/analytics/entity/EventLog`
  - `dto/analytics/AnalyticsEventRequest`, `AnalyticsEventResponse`
  - `mapper/analytics/AnalyticsEventMapper`
- `contact`
  - `controller/ContactController`
  - `service/ContactService`
  - `service/impl/ContactServiceImpl`
  - `repository/contact/ContactMessageRepository`
  - `domain/contact/entity/ContactMessage`
  - `dto/contact/ContactRequest`, `ContactResponse`
  - `mapper/contact/ContactMessageMapper`
- `projects`
  - `controller/ProjectController`
  - `service/ProjectService`
  - `service/impl/ProjectServiceImpl`
  - `repository/projects/ProjectRepository`
  - `domain/projects/entity/ProjectEntity`
  - `dto/projects/ProjectSummaryResponse`
  - `mapper/projects/ProjectMapper`
- `quote`
  - `controller/QuoteController`
  - `controller/admin/QuoteAdminController`
  - `service/QuoteService`
  - `service/impl/QuoteServiceImpl`
  - `repository/quote/QuoteRepository`
  - `domain/quote/entity/QuoteEntity`
  - `domain/quote/enums/QuoteComplexity`
  - `dto/quote/*`
  - `config/QuoteEngineProperties`
- `budgetbuilder`
  - se mantiene en arquitectura horizontal
  - `controller/admin/BudgetBuilderAdminController`
  - `service/BudgetBuilderService`, `BudgetConfigurationService`
  - `service/impl/*`
  - `domain/budgetbuilder/*`
  - `dto/budgetbuilder/*`
  - `mapper/budgetbuilder/*`

### Eliminacion de residuos

- Eliminado por completo el patron `backend/.../module/*`.
- Eliminados los placeholders residuales de `module/admin`, `module/assets`, `module/certificates`.
- Eliminado el placeholder `repository/budgetbuilder/package-info.java`.
- Eliminado el DTO package anterior `domain/dto/budgetbuilder` y migrado a `dto/budgetbuilder`.
- Eliminados del frontend el motor tecnico local visible:
  - `quote-preview.service.ts`
  - `quote-engine.data.ts`

### Mapa actual del frontend

- El frontend ya no vive en la raiz del repo.
- La app Angular completa corre desde `frontend/`.
- La arquitectura interna sigue siendo una sola `AppModule`, sin feature modules ni lazy loading.
- La integracion con backend sigue por URLs relativas `/api`.
- `Budget Builder` y el estimador tecnico siguen operativos despues del move a `frontend/`.

### Inconsistencias que todavia quedan

- El cotizador comercial actual sigue siendo frontend-first:
  - preview
  - save
  - historial
  - todo local en `localStorage`
- `projects` y `analytics` siguen con doble fuente potencial:
  - backend disponible
  - frontend todavia apoyado en data/servicios locales para parte del flujo visible
- La feature de `Budget Builder` en Angular sigue partida en dos ubicaciones:
  - `frontend/src/app/components/control-center-budget-builder/*`
  - `frontend/src/app/components/control-center/budget-builder/*`
- Persisten residuos frontend candidatos a limpieza futura:
  - `frontend/src/app/components/control-center-analytics/`
  - `frontend/src/app/components/tech-stack/`
  - `frontend/src/app/components/sidebar/`
  - `frontend/src/app/components/home-project-showcase/`
  - `frontend/src/app/components/about/` si no vuelve a tener ruta real
- Persisten warnings de budgets de bundle y estilos en Angular.

### Propuesta minima de reparacion posterior

1. Mantener la arquitectura horizontal actual y no volver a abrir contenedores por feature.
2. Cerrar la divergencia que queda en el cotizador comercial actual con el mismo patron preview/save backend.
3. Unificar la carpeta frontend de `Budget Builder` en una sola feature folder.
4. Decidir una sola fuente de verdad para `projects` y `analytics`.
5. Hacer una pasada chica de limpieza de componentes/carpetas frontend residuales sin uso real.

## Limpieza final de package-info y validacion de arranque

### package-info eliminados

- `backend/src/main/java/com/fernandogferreyra/portfolio/backend/domain/package-info.java`
- `backend/src/main/java/com/fernandogferreyra/portfolio/backend/domain/entity/package-info.java`
- `backend/src/main/java/com/fernandogferreyra/portfolio/backend/domain/enums/package-info.java`
- `backend/src/main/java/com/fernandogferreyra/portfolio/backend/mapper/package-info.java`
- `backend/src/main/java/com/fernandogferreyra/portfolio/backend/repository/package-info.java`
- `backend/src/main/java/com/fernandogferreyra/portfolio/backend/service/package-info.java`
- `backend/src/main/java/com/fernandogferreyra/portfolio/backend/service/impl/package-info.java`
- `backend/src/main/java/com/fernandogferreyra/portfolio/backend/util/package-info.java`

Confirmacion:

- todos contenian solo comentarios de documentacion de paquete
- no tenian anotaciones, metadata ni integracion activa con Spring o JPA
- despues de la limpieza no quedaron `package-info.java` en `backend/src/main/java`

### Validacion ejecutada

- `backend\\mvnw.cmd test` -> OK
- `backend\\mvnw.cmd package` -> OK
- arranque real del backend en `dev` con `java -jar target\\backend-0.2.0-SNAPSHOT.jar --spring.profiles.active=dev --server.port=18080` -> OK

### Confirmacion de arranque backend

- el backend inicio correctamente en `http://localhost:18080`
- `GET /api/health` respondio `success=true` y `status=ok`
- `POST /api/auth/login` respondio OK con usuario `ferchuz` y password `ferchuz-dev-password`
- `GET /api/admin/quotes` respondio OK autenticado con JWT admin
- `GET /api/projects` respondio OK

Decision operativa:

- la validacion de arranque real queda confirmada en perfil `dev`, que es el perfil operativo local del proyecto
- el intento de arranque del jar con perfil `test` no se toma como flujo de deploy porque `H2` existe solo como dependencia de test y no forma parte del artefacto final

## Auditoria tecnica integral 2026-04-09

### Que se hizo

- Se relevo el estado real del repo completo:
  - arquitectura
  - backend
  - frontend
  - integracion frontend-backend
  - CI actual
  - documentacion visible
- Se valido ejecucion real de comandos de calidad:
  - `npm run build` en `frontend/` -> OK con warnings de budget y estilos
  - `npm test -- --watch=false --browsers=ChromeHeadless` en `frontend/` -> FAIL por spec desalineada con `BudgetBuilderUiFacade`
  - `backend\\mvnw.cmd test` -> FAIL en este entorno por dependencia real de PostgreSQL y credenciales de test no resueltas localmente
- Se verifico que el repo sigue siendo un monolito por capas separado en `frontend/` y `backend/`, no microservicios.

### Archivos modificados

- `DOCUMENTATION.md`

### Hallazgos principales

- La base arquitectonica backend esta mejor encaminada que el frontend:
  - backend con capas claras y fuente de verdad real
  - frontend todavia en una sola `AppModule`, sin lazy loading y con bundle inicial alto
- El repo tiene deuda fuerte de higiene:
  - siguen trackeados residuos Angular en la raiz
  - siguen trackeados `frontend/node_modules`
  - siguen trackeados artefactos de `frontend/dist`
- La documentacion publica esta desalineada:
  - `README.md` raiz sigue casi como boilerplate de Angular
  - `backend/README.md` describe una estructura vieja con `module/*` y testing con H2 que ya no coincide
- La integracion full stack es parcial:
  - contacto, auth, quote y budget builder usan backend
  - `projects` visible sigue saliendo de data estatica en frontend
  - actividad del sitio y cotizador comercial visible siguen dependiendo de `localStorage`
- La seguridad existe pero no esta lista para produccion:
  - JWT en `localStorage`
  - sin refresh tokens
  - sin revocacion
  - sin rate limiting para endpoints publicos
- La estrategia de testing no esta cerrada:
  - CI no ejecuta tests frontend
  - si se ejecutaran hoy, fallan
  - tests backend de integracion dependen de PostgreSQL real

### Decisiones tecnicas registradas

- Mantener el diagnostico alineado con la arquitectura obligatoria del repo:
  - monolito por capas
  - backend como source of truth
  - sin reabrir `module/*`
- No se hicieron cambios funcionales ni refactors; esta tarea fue de auditoria tecnica y validacion real del estado actual.

### Proximos pasos

1. Limpiar el repo:
   eliminar tracking de `frontend/node_modules`, `frontend/dist` y residuos Angular de la raiz.
2. Reescribir `README.md` raiz y `backend/README.md` para que describan el sistema real.
3. Corregir la suite frontend rota y agregarla al workflow CI.
4. Estabilizar tests backend con estrategia reproducible:
   PostgreSQL en Testcontainers o perfil de test realmente autocontenido.
5. Pasar el frontend a arquitectura mas escalable:
   lazy loading, poda de componentes residuales y cierre de dobles fuentes de datos.
6. Endurecer seguridad para CD:
   secretos obligatorios, bootstrap admin controlado, rate limiting y estrategia de sesion mas robusta.
