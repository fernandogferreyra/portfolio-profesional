# EditMode Projects Media Links Verification

## Contexto

- Fecha: 2026-05-14
- Rama: `feature/edit-mode-foundation`
- PR: Pendiente
- Cambio: Normalizacion de parametros de proyectos con demo, codigo, monografia e icono propio.
- Alcance adicional: detalle editable, documentos multiples y capturas/fotos por proyecto.

## Criterios Verificados

- [x] El editor de proyectos permite cargar demo, monografia, repo e icono.
- [x] Guardar proyecto envia esos campos por `PATCH /api/admin/projects/{id}`.
- [x] `GET /api/projects` expone `repositoryUrl`, `demoUrl`, `monographUrl` e `iconUrl` para proyectos publicados.
- [x] Si un proyecto tiene `demoUrl`, el panel derecho muestra el reproductor YouTube inline y el boton/modal queda solo como fallback sin embed.
- [x] Si un proyecto tiene `repositoryUrl`, la accion publica es `Repositorio` y apunta al repo real.
- [x] Si un proyecto tiene `monographUrl` o documentos asociados, la accion publica es `Documentacion`.
- [x] `Portfolio Profesional` deja de tener `Ir a contacto` como accion de proyecto.
- [x] El icono subido se muestra en cards cuando `iconUrl` existe.
- [x] Las metricas repetidas dejan de renderizarse en el detalle publico.
- [x] Las secciones del detalle publico se mantienen y se editan separadas por titulo/items.
- [x] `Puntos destacados` queda como bloque editable principal para resaltar lo importante.
- [x] El editor permite subir multiples documentos y capturas/fotos por proyecto.
- [x] Las capturas/fotos se muestran como carrusel solo cuando existen, debajo del reproductor si hay demo.
- [x] La miniatura de YouTube no se renderiza como captura dentro del panel derecho.
- [x] El bloque duplicado de logo/nombre debajo de `Demo <app>` queda eliminado.
- [x] Si no hay demo inline, el panel derecho cae a solo icono/wordmark animado sin card interna.
- [x] El selector superior ya no renderiza cards grandes ni textos duplicados; muestra iconos/wordmarks animados grandes con nombre debajo para cambiar el proyecto activo.
- [x] Si falla la carga de `iconUrl`, la UI cae a wordmark/initials sin mostrar imagen rota.
- [x] El bloque `Stack` usa cards verticales con icono grande y nombre debajo, evitando tamaños visuales disparejos.
- [x] El frontend mantiene URLs `/api` relativas para iconos servidos por backend.
- [x] Las rutas publicas `/api/projects/{slug}/icon` y `/api/projects/{slug}/documents/{documentId}` no requieren JWT.

## Comandos Ejecutados

- `npx tsc -p tsconfig.app.json --noEmit`
  - Resultado: OK.
- `npx tsc -p tsconfig.spec.json --noEmit`
  - Resultado: OK.
- `cmd.exe /c "set JAVA_HOME=C:\Program Files\Java\jdk-17&& mvnw.cmd -DskipTests clean test-compile"`
  - Resultado: OK.
- `git diff --check`
  - Resultado: OK, con warnings CRLF/LF conocidos.
- `npx tsc -p tsconfig.app.json --noEmit`
  - Resultado: OK tras correccion de demo inline.
- `npx tsc -p tsconfig.spec.json --noEmit`
  - Resultado: OK tras correccion de demo inline.
- `git diff --check`
  - Resultado: OK tras correccion de demo inline, con warnings CRLF/LF conocidos.
- `npx tsc -p tsconfig.app.json --noEmit`
  - Resultado: OK tras simplificar selector superior a iconos.
- `npx tsc -p tsconfig.spec.json --noEmit`
  - Resultado: OK tras simplificar selector superior a iconos.
- `git diff --check`
  - Resultado: OK tras simplificar selector superior a iconos, con warnings CRLF/LF conocidos.
- `npx tsc -p tsconfig.app.json --noEmit`
  - Resultado: OK tras agrandar iconos y agregar nombre/default mark en selector.
- `npx tsc -p tsconfig.spec.json --noEmit`
  - Resultado: OK tras agrandar iconos y agregar nombre/default mark en selector.
- `git diff --check`
  - Resultado: OK tras agrandar iconos y agregar nombre/default mark en selector, con warnings CRLF/LF conocidos.
- `cmd.exe /c "set JAVA_HOME=C:\Program Files\Java\jdk-17&& mvnw.cmd -DskipTests test-compile"`
  - Resultado: OK tras fix de seguridad.
- `cmd.exe /c "set JAVA_HOME=C:\Program Files\Java\jdk-17&& mvnw.cmd -Dtest=SecurityIntegrationTest test"`
  - Resultado: Bloqueado por Docker/Testcontainers no disponible antes de ejecutar la regresion.
- `npm test -- --watch=false --browsers=ChromeHeadless --include src/app/components/projects/projects.component.spec.ts`
  - Resultado: Bloqueado por `@esbuild/win32-x64` instalado desde Windows en este WSL.
- `cmd.exe /c "set JAVA_HOME=C:\Program Files\Java\jdk-17&& mvnw.cmd test"`
  - Resultado: Bloqueado por Docker/Testcontainers no disponible.

## Tests

- Targeted tests: `ProjectsComponent` cubre acciones normalizadas `Ver demo`, `Repositorio`, `Documentacion`, `iconUrl` y payload con repo/demo/documentacion/icono/features/assets.
- Backend tests: `ApiIntegrationTest` actualizado para verificar campos nuevos de proyectos en publico/admin; suite no pudo ejecutarse por Testcontainers.
- Security tests: `SecurityIntegrationTest` cubre que las rutas publicas de assets de proyecto lleguen a capa aplicacion sin token, evitando regresion `401`; compilacion OK, ejecucion pendiente en entorno con Docker/Testcontainers.
- Full/required suite: Pendiente en CI o entorno local con Docker y dependencias frontend correctas.
- Tests bloqueados: Karma por `esbuild` cross-platform; Maven `test` por Docker/Testcontainers.

## Verificacion Manual

- Flujo: Pendiente en navegador.
- Resultado: Pendiente.
- Evidencia: No aplica.

## Estado De Datos

- Precondicion: Migracion `V15__projects_media_links.sql` aplicada.
- Cambios realizados: Agrega columnas `demo_url`, `monograph_url`, `icon_document_id`, `metrics_json`, `sections_json`, `features_json`, `documentation_document_ids_json` y `screenshot_document_ids_json`; semilla demo/documentacion de `ObraSmart`, repo de `Portfolio Profesional` y destacados iniciales.
- Cleanup/restauracion: No aplica.

## Resultado

- PASS WITH GAPS
- Bloqueos: Validacion visual y suites completas dependen de entorno correcto.
- Seguimiento: Revisar en UI `Proyectos` con `EditMode Enabled`, subir PNG/ICO, cargar demo YouTube/repo/monografia, guardar y confirmar botones/icono.
