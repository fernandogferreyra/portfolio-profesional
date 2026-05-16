# Credential Document Local Persistence

## Contexto

- Fecha: 2026-05-15
- Rama: `feature/edit-mode-skills-catalog`
- Tipo: bug
- Fuente: usuario

## Problema

Los documentos asociados a `Formacion y certificaciones` pueden parecer no persistidos despues de apagar y volver a levantar el entorno local. La causa probable es que el storage documental usa `./runtime/documents`, un path relativo al directorio desde donde se inicia Spring. Si un arranque ocurre desde la raiz del repo y otro desde `backend/`, el backend mira carpetas distintas.

## Objetivo

Hacer que el storage documental local resuelva el path relativo contra una raiz estable del workspace cuando el backend corre dentro de este repo, evitando que los documentos queden repartidos entre `runtime/documents` y `backend/runtime/documents`.

## Alcance

- Normalizar la resolucion de paths relativos de documentos en backend.
- Mantener compatibilidad con paths absolutos configurados por `PORTFOLIO_DOCUMENT_STORAGE_PATH`.
- Agregar una regresion unitaria para el caso raiz del repo vs `backend/`.

## No-goals

- No migrar archivos ya subidos entre carpetas locales.
- No cambiar el modelo de persistencia ni guardar binarios en PostgreSQL.
- No abrir storage externo S3/R2/Supabase en esta etapa.

## Criterios De Aceptacion

- Dado el default `./runtime/documents`, cuando Spring se inicia desde la raiz del repo, entonces el storage apunta a `<repo>/runtime/documents`.
- Dado el default `./runtime/documents`, cuando Spring se inicia desde `<repo>/backend`, entonces el storage tambien apunta a `<repo>/runtime/documents`.
- Dado un path absoluto por configuracion, cuando se resuelve el storage, entonces se respeta ese path sin reubicarlo.

## Riesgos

- Riesgo: archivos ya creados en `backend/runtime/documents` no aparecen automaticamente si la DB apunta al otro storage.
- Mitigacion: consolidar manualmente los documentos locales si hace falta y mantener `PORTFOLIO_DOCUMENT_STORAGE_PATH` absoluto para sesiones futuras.

## Validacion Esperada

- Comando/test: `mvnw.cmd -Dtest=DocumentStoragePropertiesTest test`
- Comando/test: `mvnw.cmd -DskipTests clean test-compile`
- Comando/test: `git diff --check`
- Prueba manual: subir documento de credencial, reiniciar backend y confirmar preview/descarga.

## Impacto En Documentacion

- `DOCUMENTATION.md`
- `docs/handoff-control-center.md`

## Notas De Implementacion

- Archivos probables: `DocumentStorageProperties`, test unitario backend.
- Decision tecnica: paths relativos se resuelven contra la raiz detectada del workspace solo cuando el proceso corre desde la raiz o desde `backend/`; fuera del repo se mantiene el comportamiento relativo al `user.dir`.
