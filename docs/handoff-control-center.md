# Handoff Control Center

Estado al 2026-04-09.

## 1. Estado actual del proyecto

- Frontend Angular 20 desacoplado en `frontend/`.
- Backend Spring Boot 3.3.5 desacoplado en `backend/`.
- Arquitectura backend consolidada en capas globales:
  - `controller/`
  - `controller/admin/`
  - `service/`
  - `service/impl/`
  - `repository/`
  - `domain/<feature>/`
  - `dto/<feature>/`
  - `mapper/<feature>/`
- La carpeta `backend/src/main/java/com/fernandogferreyra/portfolio/backend/module/` ya no existe y no debe volver a existir.
- El backend es la fuente de verdad de la logica critica; el frontend queda limitado a UI y consumo HTTP.
- CI en GitHub Actions queda verde para frontend + backend.
- Base de datos: PostgreSQL en local dev y en CI/test. Flyway activo.
- Si una base local vieja rechaza `SECTION_VIEW` u otros eventos nuevos en `event_logs`, reiniciar con la migracion `V6__align_event_logs_event_type_check.sql` aplicada por Flyway.

## 2. Arquitectura final adoptada

- Frontend:
  - vive solo en `frontend/`
  - mantiene consumo relativo de `/api`
  - usa proxy de desarrollo hacia `http://localhost:8080`
- Backend:
  - vive solo en `backend/`
  - no usa estructura vertical por feature
  - no usa ni debe reintroducir `module/*`
- Regla operativa:
  - logica oficial en backend
  - frontend solo vista, estado de pantalla y clientes HTTP

## 3. Implementado hoy

- Login admin FERCHUZ operativo con JWT.
- Ruta privada `/control-center` operativa.
- Centro de Mando visible solo con sesion admin.
- `Budget Builder` ya consume el backend oficial para configuracion activa, `preview`, `save`, historial y detalle.
- `Budget Builder` ya expone tambien `surchargeRules` y `maintenancePlans` dentro de la configuracion activa para absorber gradualmente el cotizador historico.
- `Budget Builder` ya expone presets comerciales rapidos oficiales (`essential_web`, `business_site`, `operations_tool`, `product_platform`) con `label` y `description` servidos por backend.
- `Budget Builder` ya expone stacks comerciales oficiales (`cms_fast`, `angular_spring`, `angular_dotnet`, `full_custom`) y la UI privada ya funciona por pasos para evitar scroll largo.
- La entrada del `Control Center` ahora usa accesos rapidos arriba y CTA directa en cada tarjeta operativa, alineada con la referencia de `ferchuz/capturas de front/panel privado.jpg`.
- La copia funcional ya fue absorbida en backend para `Budget Builder` persistido y `quote` tecnico rico; la rama actual mantiene el repo limpio sin volver a integrar `ferchuz/`.
- El estimador tecnico ya usa backend como source of truth para `preview` y `save`, con PERT, buffer de riesgo y dependencias visibles en UI.
- El frontend del estimador ya volvio a consumir el contrato rico completo de `quote` (`baseHours`, `riskBufferHours`, `totalWeeks`, `assumptions`, PERT por item y dependencias) sin logica local paralela.
- La shell del modo privado ya cambio a tabs de trabajo reales: `Presupuesto`, `Actualizar`, `Paginas amigas` y `Mensajeria`. `Presupuesto` queda como entrada principal y la estimacion tecnica pasa a mostrarse como calculadora auxiliar dentro del mismo flujo.
- `Actividad del Sitio` ya quedo backend-first: escritura publica via `POST /api/events`, lectura admin via `GET /api/admin/events` y sin persistencia local como fuente paralela.
- La seccion vieja del cotizador comercial local ya no se renderiza en la pantalla principal del `Control Center`.
- El portfolio publico sigue operativo.
- La vista publica de proyectos ya queda preparada para consumir `GET /api/projects` de forma incremental sin perder el detalle rico que todavia vive en frontend.

## 4. Estado funcional relevante

### Budget Builder

- Backend oficial activo para configuracion, `preview`, `save`, `list` y `detail`.
- Endpoint admin protegido disponible.
- Engine, configuracion, pricing y persistencia viven en backend.
- El frontend ya no calcula el flujo oficial en runtime.
- La logica comercial ya refleja la referencia funcional de `ferchuz/`:
  - pricing por categoria
  - cargos fijos
  - soporte mensual
  - modo SaaS con recupero, infraestructura, margen, escala de usuarios y horas extra
  - base inicial para extras comerciales y mantenimiento heredados del cotizador historico
  - presets comerciales rapidos ya modelados en configuracion activa
  - stacks comerciales oficiales ya modelados en configuracion activa
  - UX por pasos con extras y mantenimiento seleccionables
- Pendiente:
  - configuracion editable
  - exportacion PDF
  - ajustes de UX menores del dashboard privado

### Estimador tecnico

- Preview y save alineados contra backend.
- El frontend ya no conserva motor tecnico visible como fuente de verdad.
- `QuoteService` consume backend para ambos flujos.
- La formula ya refleja la referencia funcional relevada:
  - PERT por bloque
  - buffer fijo de riesgo
  - timeline en semanas
  - dependencias/notas de bloqueo visibles
- Pendiente:
  - evolucion funcional dentro del dashboard privado sin romper el contrato vigente
  - limpieza posterior de residuos frontend no visibles del flujo historico

## 5. Endpoints/backend ya disponibles

- Publicos:
  - `GET /api/health`
  - `POST /api/auth/login`
  - `GET /api/projects`
  - `POST /api/contact`
  - `POST /api/events`
  - `POST /api/quote`
- Admin:
  - `GET /api/admin/events`
  - `GET /api/admin/quotes`
  - `GET /api/admin/quotes/{id}`
  - `POST /api/admin/quotes/preview`
- `POST /api/admin/budget-builder/preview`
- `POST /api/admin/budget-builder`
- `GET /api/admin/budget-builder`
- `GET /api/admin/budget-builder/{id}`
- `GET /api/admin/budget-builder/configuration/active`

## 5.1 Documentos de trabajo activos

- `docs/budget-builder-parity.md` define la estrategia de consolidacion del cotizador historico dentro de `Budget Builder` y el criterio de retiro seguro.

## 6. CI y validacion

- CI actual:
  - ejecuta frontend desde `frontend/`
  - ejecuta backend desde `backend/`
  - usa artifact `frontend/dist/portfolio-ferchuz/browser`
  - activa backend con `SPRING_PROFILES_ACTIVE=dev`
- Validacion local vigente:
- `backend\mvnw.cmd test` OK con Docker Desktop encendido y `JAVA_HOME=C:\Program Files\Java\jdk-17`
- `backend\mvnw.cmd package` OK
- `npm run build` en `frontend/` OK
- `npm test -- --watch=false --browsers=ChromeHeadless` en `frontend/` OK (`21 SUCCESS`)
- Nota operativa local:
  - backend test ahora queda preparado para Testcontainers; si Docker esta disponible ya no depende de `PORTFOLIO_TEST_DB_*`
  - la base de integracion usa un unico PostgreSQL Testcontainer compartido para toda la suite y evita reciclar pools hacia puertos viejos entre clases
- Nota operativa WSL/Linux:
  - el repo ahora fija Node `20.19.0` en `.nvmrc`
  - no reutilizar `frontend/node_modules` entre Windows y WSL por dependencias nativas como `esbuild`
  - la nueva base de tests backend usa Testcontainers, por lo que Docker debe estar disponible en el entorno que ejecute `test`
  - El contexto Spring ya no falla por duplicados legacy.

## 7. Deuda funcional pendiente

- Presupuestos PDF.
- Mensajeria real.
- Docker / deploy.
- Configuracion editable del motor comercial y tecnico.
- Limpieza posterior de residuos frontend no visibles del cotizador local historico.
- Resolucion futura de warnings de budgets en Angular.
- Integrar presets comerciales rapidos y stacks comerciales del cotizador historico dentro del backend oficial de `Budget Builder`.

## 8. Como levantar el proyecto

- Backend dev:
  - requisito: PostgreSQL local disponible
  - `cd backend`
  - `$env:SPRING_PROFILES_ACTIVE='dev'`
  - `.\mvnw.cmd spring-boot:run`
- Frontend:
  - `cd frontend`
  - `npm start`
- Credenciales dev:
  - usuario: `ferchuz`
  - password: `ferchuz-dev-password`

## 9. Que no romper

- No reintroducir `module/*`.
- No mover logica critica al frontend.
- No romper el contrato actual de admin `ROLE_FERCHUZ`.
- No hardcodear URLs absolutas al backend en frontend; mantener `/api`.
- No mezclar nuevamente `Budget Builder`, cotizador comercial y estimador tecnico.
- No tocar el portfolio publico si el cambio no lo requiere.

## 10. Proximo paso recomendado

- Continuar en `feature/dashboard-private` con los pendientes no funcionales de esta fase: PDF, mensajeria real y docker/deploy, manteniendo backend como source of truth y sin reintroducir estructuras hibridas.
- Para iteraciones siguientes trabajar en tres carriles claros: frontend, backend y testing, dejando handoff corto al cierre de cada ola.
