# Credential Document Local Persistence Verification

## Contexto

- Fecha: 2026-05-15
- Rama: `feature/edit-mode-skills-catalog`
- PR: pendiente
- Cambio: normalizacion del path relativo de storage documental local.

## Criterios Verificados

- [x] Criterio: el default `./runtime/documents` resuelve a `<repo>/runtime/documents` si el backend arranca desde la raiz del repo.
- [x] Criterio: el default `./runtime/documents` resuelve a `<repo>/runtime/documents` si el backend arranca desde `<repo>/backend`.
- [x] Criterio: un path absoluto configurado se respeta sin reubicarlo.

## Comandos Ejecutados

- `cmd.exe /c "set JAVA_HOME=C:\Program Files\Java\jdk-17&& mvnw.cmd -Dtest=DocumentStoragePropertiesTest test"`
  - Resultado: OK. `Tests run: 3, Failures: 0, Errors: 0, Skipped: 0`.
- `cmd.exe /c "set JAVA_HOME=C:\Program Files\Java\jdk-17&& mvnw.cmd -DskipTests clean test-compile"`
  - Resultado: OK. Backend main/test compila correctamente.
- `git diff --check`
  - Resultado: OK, sin errores de whitespace.

## Tests

- Targeted tests: `DocumentStoragePropertiesTest`.
- Full/required suite: `test-compile` backend OK; suite completa queda para CI/Testcontainers si aplica.
- Tests bloqueados: ninguno para la regresion puntual.

## Verificacion Manual

- Flujo: revisar carpetas locales `runtime/documents` y `backend/runtime/documents` para confirmar el origen del bug reportado.
- Resultado: existen archivos en ambas carpetas, consistente con arranques previos desde distintos directorios de trabajo.
- Evidencia: el backend usaba un path relativo configurable por `./runtime/documents`.

## Estado De Datos

- Precondicion: documentos locales repartidos entre dos carpetas posibles.
- Cambios realizados: no se movieron ni borraron archivos locales existentes.
- Cleanup/restauracion: si una credencial local apunta a archivos de `backend/runtime/documents`, debe consolidarse manualmente o re-subirse el documento.

## Resultado

- PASS WITH GAPS
- Bloqueos: falta prueba manual end-to-end con backend levantado, subida de documento, reinicio y preview.
- Seguimiento: mantener `PORTFOLIO_DOCUMENT_STORAGE_PATH` absoluto para evitar ambiguedad local en sesiones futuras.
