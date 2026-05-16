# Verification Report: Durable Document Storage

## Contexto

- Fecha: 2026-05-16
- Rama: `fix/durable-cv-documents`
- PR: pendiente
- Cambio: persistencia durable en PostgreSQL para binarios documentales y fallback cuando falta el archivo fisico.

## Criterios Verificados

- [x] Un documento puede descargarse desde la copia durable si falta el archivo fisico.
- [x] Si no existe archivo fisico ni copia durable, el error sigue siendo explicito.
- [x] La baja admin elimina la copia durable por `documentId`.
- [x] La compilacion backend main/test pasa.
- [ ] Test integrado de CV con Flyway/Testcontainers ejecutado localmente.

## Comandos Ejecutados

- `cmd.exe /c "set JAVA_HOME=C:\Program Files\Java\jdk-17&& mvnw.cmd -DskipTests clean test-compile"`
  - Resultado: OK, `BUILD SUCCESS`.
- `cmd.exe /c "set JAVA_HOME=C:\Program Files\Java\jdk-17&& mvnw.cmd -Dtest=DocumentFileServiceImplTest test"`
  - Resultado: OK, `3` tests, `BUILD SUCCESS`.
- `cmd.exe /c "set JAVA_HOME=C:\Program Files\Java\jdk-17&& mvnw.cmd -Dtest=ApiIntegrationTest#adminCanLinkDocumentToPublicContentBlockAndPublicCanDownloadItWithoutFilesystemCache,ApiIntegrationTest#adminCanDeleteDocumentAndUnlinkCmsBlocks test"`
  - Resultado: bloqueado por Docker/Testcontainers no disponible en el entorno local.
- `git diff --check`
  - Resultado: OK.

## Tests

- Targeted tests: `DocumentFileServiceImplTest` cubre fallback durable, error explicito sin contenido durable y baja de contenido durable.
- Full/required suite: pendiente de CI o entorno local con Docker operativo.
- Tests bloqueados: `ApiIntegrationTest` focalizado por falta de Docker/Testcontainers.

## Verificacion Manual

- Flujo: despues del deploy, re-subir/asociar CV y abrir `/api/content-blocks/contact.cv/es/document`.
- Resultado: pendiente de deploy.
- Evidencia: n/a.

## Estado De Datos

- Precondicion: documentos subidos antes de esta migracion no tienen copia durable si el archivo fisico ya se perdio.
- Cambios realizados: nuevas subidas guardan binario en `document_contents` y siguen escribiendo cache filesystem.
- Cleanup/restauracion: re-subir el CV una vez en produccion para crear la copia durable definitiva.

## Resultado

- PASS WITH GAPS
- Bloqueos: Docker/Testcontainers local no disponible; validacion manual post-deploy pendiente.
- Seguimiento: correr CI, deployar backend con `V21`, re-subir/asociar CV y validar endpoint publico.
