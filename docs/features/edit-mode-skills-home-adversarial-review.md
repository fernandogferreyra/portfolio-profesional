# Adversarial Review - EditMode Skills E Inicio

## Alcance Revisado

- Migracion `V18__home_and_skills_content_blocks.sql`.
- Consumo publico/admin de `public_content_blocks` en `HomeComponent` y `SkillsComponent`.
- Edicion contextual via `EditMode` usando `PATCH /api/admin/content-blocks/{id}`.
- Alta admin de bloques CMS usando `POST /api/admin/content-blocks`.
- Preview admin protegido para documentos de credenciales en borrador.
- Alta/baja admin de proyectos desde `EditMode`.

## Hallazgos

- El endpoint admin nuevo queda bajo `/api/admin/**`, por lo que conserva autenticacion y rol existentes.
- No se agrega borrado definitivo de skills: ocultar queda representado por `published=false`.
- El fallback local evita pagina vacia si falla `/api/content-blocks`.
- El alta de bloques valida unicidad `contentKey + language` y existencia de documento asociado si se envia `documentId`.
- La preview admin de credenciales queda bajo `/api/admin/**`; no se abre descarga publica de borradores.
- La baja de proyecto elimina solo la fila de proyecto; no borra documentos subidos, evitando borrar assets reutilizables por accidente.

## Riesgos Residuales

- Si la migracion se aplica parcialmente o los bloques `skill.*` faltan para un idioma, la pagina puede mostrar un subconjunto cuando existan algunos bloques CMS para ese idioma.
- Las nuevas experiencias tecnicas se crean solo para el idioma activo; si se requiere bilingue perfecto, hay que crear/traducir el bloque del otro idioma en una etapa posterior.
- `Home` y `Skills` suman estilos y mantienen warnings de budget existentes.
- La baja de proyectos es definitiva para la entidad; la UI pide confirmacion, pero no hay papelera ni restore.

## Mitigaciones

- `V18` inserta todos los bloques `skill.*` ES/EN conocidos con `ON CONFLICT DO NOTHING`.
- El fallback local solo se usa cuando no hay bloques de skills para el idioma activo, evitando ocultar por accidente ante API caida.
- Los editores agregan/quitan items en memoria y el backend persiste solo strings no vacios tras guardar.
- `GET /api/admin/credentials/{id}/document` permite validar visualmente documentos asociados a credenciales no publicadas sin cambiar la regla del endpoint publico; el frontend lo consume con HttpClient como Blob para que el interceptor JWT envie `Authorization`, no como URL directa de `iframe`. La UI intenta renderizar imagen primero y cae a iframe solo ante error, para tolerar content-types ambiguos.
- La validacion final de migracion debe correr en CI con Testcontainers.

## Decision

- Apto para PR corto hacia `develop` despues de CI verde.
