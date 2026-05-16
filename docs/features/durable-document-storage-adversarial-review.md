# Adversarial Review: Durable Document Storage

## Contexto

- Fecha: 2026-05-16
- PR/rama: `fix/durable-cv-documents`
- Spec/documentos fuente: `docs/features/durable-document-storage.md`
- Reviewer: OpenCode

## Criterios De Aceptacion Revisados

- CV/documentos nuevos sobreviven perdida del filesystem usando copia durable en PostgreSQL.
- Descargas publicas siguen limitadas a asociaciones publicadas existentes.
- Borrado admin no queda bloqueado por archivo fisico ausente.

## Hallazgos

| Severidad | Area | Hallazgo | Evidencia | Fix sugerido |
| --- | --- | --- | --- | --- |
| Minor | Datos | Documentos historicos cuyo archivo ya se perdio no pueden reconstruirse automaticamente. | La nueva tabla solo se completa desde subidas posteriores al fix. | Re-subir/asociar CV en produccion despues del deploy. |
| Minor | DB | PostgreSQL crecera con binarios documentales. | `document_contents.content BYTEA` guarda copia completa. | Mantener limite de 10 MB y evaluar object storage si el volumen crece. |

## Riesgos Revisados

- Auth/permisos: sin cambios; los endpoints publicos siguen controlados por bloque/proyecto/credencial publicada.
- Datos/DB: `document_contents` usa FK `ON DELETE CASCADE` y repositorio dedicado para no cargar blobs en listados de `documents`.
- Storage/filesystem: filesystem queda como cache; DB queda como fuente durable para archivos nuevos.
- UI/cache/deploy: frontend no cambia; requiere re-subida del CV post-deploy para documentos ya perdidos.
- Errores/empty states: si no hay archivo ni copia durable, se conserva `Linked document file not found`.
- Seguridad/secrets: no se agregan secretos ni URLs publicas nuevas.

## Veredicto

PASS WITH GAPS

## Condiciones Antes De Merge/Promocion

- CI backend debe ejecutar migracion `V21` y tests integrados.
- Post-deploy, re-subir/asociar el CV para crear la copia durable en produccion.
