# Verification Report - EditMode Skills E Inicio

## Contexto

- Fecha: 2026-05-15
- Rama: `feature/edit-mode-skills-home`
- Alcance: bloques CMS para `Inicio` y `Skills`, edicion contextual con `EditMode`, fallback publico, ocultar skills por `published=false`, alta admin de nuevas experiencias tecnicas, retiro del resumen de credenciales en Home, preview admin de documentos de credenciales y alta/baja admin de proyectos.

## Comandos Ejecutados

- `npx tsc -p tsconfig.app.json --noEmit`
  - Resultado: OK.
- `npx tsc -p tsconfig.spec.json --noEmit`
  - Resultado: OK.
- `cmd.exe /c "cd /d C:\Users\ferch\ProyectosIA\portfolio-profesional\frontend && npm test -- --watch=false --browsers=ChromeHeadless && npm run build:ci"`
  - Resultado: OK. `45 SUCCESS`; build productivo OK con warnings de budget conocidos.
- `cmd.exe /c "cd /d C:\Users\ferch\ProyectosIA\portfolio-profesional\backend && set JAVA_HOME=C:\Program Files\Java\jdk-17&& mvnw.cmd -DskipTests test-compile"`
  - Resultado: OK en validacion previa de la rama.
- `cmd.exe /c "cd /d C:\Users\ferch\ProyectosIA\portfolio-profesional\backend && set JAVA_HOME=C:\Program Files\Java\jdk-17&& mvnw.cmd -DskipTests package"`
  - Resultado: OK en validacion previa.
- `cmd.exe /c "cd /d C:\Users\ferch\ProyectosIA\portfolio-profesional\backend && set JAVA_HOME=C:\Program Files\Java\jdk-17&& mvnw.cmd -DskipTests clean package"`
  - Resultado: OK.
- `cmd.exe /c "cd /d C:\Users\ferch\ProyectosIA\portfolio-profesional\backend && set JAVA_HOME=C:\Program Files\Java\jdk-17&& mvnw.cmd -DskipTests package"`
  - Resultado: OK tras ajustar preview de documentos como Blob autenticado.
- `git diff --check`
  - Resultado: OK.

## Bloqueos / Notas

- `mvnw.cmd test` completo no se ejecuto localmente porque la suite backend depende de Docker/Testcontainers disponible. Debe validarse en CI del PR.
- En esta pasada no se ejecuto `mvnw.cmd test` completo; el bloqueo local conocido sigue siendo Docker/Testcontainers no disponible.
- Karma informa 404 esperados de assets mock de proyectos (`/api/projects/budget-builder/icon`, screenshot) durante specs existentes; no fallan la suite.
- La preview de documentos admin en credenciales ya no depende de cargar `/api/admin/credentials/{id}/document` directamente en `iframe`; el frontend descarga Blob con HttpClient para que aplique el interceptor JWT y luego usa un object URL local.
- Para credenciales, la preview intenta renderizar primero como imagen y solo cae a `iframe` si falla, evitando que una certificacion nueva se rompa por `content-type` ambiguo.
- El resumen de credenciales se retiro de Home porque duplica `Formacion y certificaciones` y no debe ser una segunda fuente visual.
- Se agrego `.opencode/agent/modo-edicion.md`; requiere reiniciar opencode para estar disponible en sesiones nuevas.

## Resultado

- La rama queda validada localmente para frontend, typecheck y backend package.
- La validacion completa de migracion + Testcontainers queda delegada al CI de GitHub Actions.
