# Adversarial Review: Profile Photo And CV Replacement

## Contexto

- Fecha: 2026-05-16
- PR/rama: `fix/profile-photo-cv-replace`
- Spec/documentos fuente: `docs/features/profile-photo-and-cv-replacement.md`
- Reviewer: OpenCode

## Criterios De Aceptacion Revisados

- Reemplazo de CV no debe dejar disponible el documento anterior.
- URL publica debe evitar cache del CV viejo.
- Foto de perfil debe actualizarse desde `EditMode` sin endpoint nuevo publico generico.

## Hallazgos

| Severidad | Area | Hallazgo | Evidencia | Fix sugerido |
| --- | --- | --- | --- | --- |
| Minor | Datos | Si ES/EN compartian el mismo documento viejo, actualizar un idioma elimina ese documento y desvincula el otro. | `DocumentService.deleteDocument` aplica `ON DELETE`/desvinculacion para referencias al documento anterior. | Aceptado: evita abrir CV viejo. Si se requiere EN separado, subir/asociar luego el CV correcto en EN. |
| Minor | Cache | Usuarios con PDF viejo abierto en una pestana pueden seguir viendo esa instancia local. | El navegador ya tiene el contenido cargado. | Cerrar/reabrir; la nueva URL lleva `v=<documentId>` y la respuesta usa `no-store`. |

## Riesgos Revisados

- Auth/permisos: la subida sigue usando `POST /api/admin/documents` protegido.
- Datos/DB: `V22` solo siembra bloques CMS nuevos; no toca documentos existentes.
- Storage/filesystem: se apoya en la persistencia durable de `V21`.
- UI/cache/deploy: `documentUrl` versionado evita que el link nuevo reutilice cache del viejo.
- Errores/empty states: Home/Header mantienen fallback `images/profile-photo.jpg` si no hay bloque/documento.
- Seguridad/secrets: no hay secretos ni URLs absolutas nuevas.

## Veredicto

PASS WITH GAPS

## Condiciones Antes De Merge/Promocion

- CI backend debe ejecutar `ApiIntegrationTest` con Testcontainers.
- Validar visualmente en deploy: subir CV nuevo, abrirlo, subir otro y confirmar que no abre el anterior; subir foto y confirmar Home/Header.
