# Durable Document Storage

## Contexto

- Fecha: 2026-05-16
- Rama: `fix/durable-cv-documents`
- Tipo: bug
- Fuente: deploy/captura del usuario

## Problema

El endpoint publico `GET /api/content-blocks/contact.cv/es/document` devuelve `Linked document file not found` cuando el bloque `contact.cv` conserva metadata en PostgreSQL pero el archivo fisico desaparece del filesystem del backend deployado.

## Objetivo

Los documentos subidos desde admin, incluido el CV, deben sobrevivir redeploys o perdida del filesystem efimero del container.

## Alcance

- Persistir una copia binaria durable de cada documento subido en PostgreSQL.
- Usar el filesystem existente como cache/storage local primario cuando este disponible.
- Resolver descargas publicas/admin desde la copia durable si el archivo fisico falta.
- Permitir borrar metadata/documentos aunque el archivo fisico ya no exista.

## No-goals

- No abrir descarga publica generica de documentos.
- No migrar documentos historicos cuyo binario ya se perdio.
- No introducir storage externo tipo S3 en esta rama.

## Criterios De Aceptacion

- Dado un CV subido despues del fix, cuando el archivo fisico desaparece, entonces `/api/content-blocks/contact.cv/es/document` responde `200` usando la copia durable.
- Dado un documento asociado a credenciales/proyectos/skills, cuando falta el archivo fisico, entonces la descarga usa la copia durable si existe.
- Dado un documento viejo con metadata pero sin archivo ni copia durable, cuando el admin lo elimina, entonces la baja no queda bloqueada por el archivo faltante.
- Dado un documento nuevo, cuando se elimina desde admin, entonces tambien se elimina su copia durable.

## Riesgos

- Riesgo: aumentar el tamano de PostgreSQL por archivos binarios.
- Mitigacion: mantener limite actual de subida y usar esta solucion para documentos chicos del portfolio.

- Riesgo: cargar blobs en listados admin.
- Mitigacion: guardar binarios en tabla separada de `documents`.

## Validacion Esperada

- Test backend focalizado para fallback durable del CV.
- Test backend focalizado para baja con archivo fisico ausente.
- `mvnw.cmd -DskipTests clean test-compile`.
- Validacion manual post-deploy: re-subir CV y abrir `/api/content-blocks/contact.cv/es/document`.

## Impacto En Documentacion

- `DOCUMENTATION.md`
- `docs/handoff-control-center.md`
- Reporte de verificacion de esta rama.

## Notas De Implementacion

- Agregar migracion `V21__durable_document_contents.sql`.
- Agregar entidad/repositorio `DocumentContent` separado.
- Centralizar resolucion de descarga para usar filesystem primero y fallback a PostgreSQL.
