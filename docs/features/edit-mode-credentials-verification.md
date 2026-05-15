# EditMode Credentials Verification

## Contexto

- Fecha: 2026-05-13
- Rama: `feature/edit-mode-foundation`
- PR: `#60`
- Cambio: credenciales/formacion editables con backend, documento asociado y consumo en Home.

## Criterios Verificados

- [x] Frontend compila a nivel TypeScript app.
- [x] Frontend compila a nivel TypeScript specs.
- [x] Backend compila main/test con migracion y endpoints nuevos.
- [x] No hay errores de whitespace en diff.
- [ ] Suite backend completa ejecutada localmente.

## Comandos Ejecutados

- `npx tsc -p tsconfig.app.json --noEmit`
  - Resultado: OK.
- `npx tsc -p tsconfig.spec.json --noEmit`
  - Resultado: OK.
- `cmd.exe /c "set JAVA_HOME=C:\Program Files\Java\jdk-17&& mvnw.cmd -DskipTests clean test-compile"`
  - Resultado: OK. Compilo 177 clases main y 9 clases test.
- `cmd.exe /c "set JAVA_HOME=C:\Program Files\Java\jdk-17&& mvnw.cmd test"`
  - Resultado: bloqueado por Docker/Testcontainers no disponible. Tests unitarios sin contenedor llegaron a pasar, pero la suite falla al inicializar `AbstractIntegrationTest`.
- `git diff --check`
  - Resultado: sin errores; solo warnings CRLF/LF esperados en archivos de header.
- `npx tsc -p tsconfig.app.json --noEmit`
  - Resultado: OK luego del fix de preview documental.
- `npx tsc -p tsconfig.spec.json --noEmit`
  - Resultado: OK luego del fix de preview documental.
- `npm test -- --watch=false --browsers=ChromeHeadless --include src/app/components/credentials/credentials.component.spec.ts`
  - Resultado: bloqueado en WSL por `@esbuild/win32-x64` instalado desde Windows; no se tocaron dependencias.
- `cmd.exe /c "set JAVA_HOME=C:\Program Files\Java\jdk-17&& mvnw.cmd -DskipTests test-compile"`
  - Resultado: OK luego de ajustar `X-Frame-Options` a `SAMEORIGIN` para previews embebidas same-origin.

## Tests

- Targeted tests: `CredentialsComponent` agregado para no renderizar placeholder viejo, leer credenciales backend y mostrar preview embebida cuando existe `documentUrl`.
- Full/required suite: backend test suite intentada.
- Tests bloqueados: integracion backend por `Could not find a valid Docker environment`; test Angular puntual en WSL por binario `@esbuild/win32-x64`.

## Verificacion Manual

- Flujo: pendiente de navegador para `/credentials` con `EditMode Enabled`, incluyendo preview embebida de documentacion asociada sin error `localhost ha rechazado la conexion`.
- Resultado: pendiente.
- Evidencia: no aplica en este entorno.

## Estado De Datos

- Precondicion: Flyway activo.
- Cambios realizados: migracion `V14__credentials_catalog.sql` crea `credentials` y siembra UTN ES/EN.
- Cleanup/restauracion: no aplica.

## Resultado

- PASS WITH GAPS
- Bloqueos: Docker/Testcontainers local no disponible; `npm run build` sigue bloqueado en WSL por esbuild instalado para Windows.
- Seguimiento: validar CI y revisar visualmente desktop/mobile antes de merge/promocion.
