# EditMode Credentials Adversarial Review

## Contexto

- Fecha: 2026-05-13
- PR/rama: `feature/edit-mode-foundation`
- Spec/documentos fuente: `docs/features/edit-mode-credentials.md`
- Reviewer: OpenCode

## Criterios De Aceptacion Revisados

- Visitantes ven solo credenciales publicadas.
- Admin con `EditMode` puede crear y editar credenciales desde `/credentials`.
- La documentacion subida queda asociada al elemento.
- La descarga publica se limita a credenciales publicadas con documento asociado.
- Home muestra titulos reales cargados.

## Hallazgos

| Severidad | Area | Hallazgo | Evidencia | Fix sugerido |
| --- | --- | --- | --- | --- |
| Minor | i18n | La creacion de un item nuevo crea solo el idioma activo; no crea automaticamente par ES/EN. | `POST /api/admin/credentials` recibe `language`. | Aceptado para esta pasada; resolver con traduccion/duplicado asistido en una etapa posterior. |
| Minor | UX | No se implementa borrado definitivo de credenciales. | Spec lo declara como no-goal. | Agregar ocultar/despublicar como accion normal si se necesita retirar un item. |
| Question | Storage | La persistencia real del archivo depende del storage configurado en Render. | Se reutiliza `DocumentService` y `StorageService`. | Validar volumen persistente antes de depender de documentacion productiva. |
| Low | Security headers | La preview embebida requiere permitir frames same-origin. | `SecurityConfiguration` configura `X-Frame-Options: SAMEORIGIN`. | Mantener `SAMEORIGIN`; no relajar a origenes externos ni abrir endpoint documental generico. |

## Riesgos Revisados

- Auth/permisos: endpoints admin quedan bajo `/api/admin/**`, protegido por `ROLE_FERCHUZ`.
- Datos/DB: `credentials.document_id` usa FK a `documents(id)` con `ON DELETE SET NULL`.
- Storage/filesystem: no se abre endpoint publico generico; descarga publica pasa por `/api/credentials/{id}/document` y exige `published=true`.
- Headers/frame: el documento puede embeberse solo desde el mismo origen para preview; la apertura desde sitios externos sigue limitada por `SAMEORIGIN`.
- UI/cache/deploy: previews que apunten al backend productivo no podran guardar credenciales hasta que backend productivo tenga `V14` y endpoints nuevos.
- Errores/empty states: frontend muestra estado vacio/error y no renderiza placeholder viejo.
- Seguridad/secrets: no se agregan secretos ni variables nuevas.

## Veredicto

PASS WITH GAPS

## Condiciones Antes De Merge/Promocion

- Revisar visualmente `/credentials` en desktop/mobile con `EditMode Enabled`.
- Validar en entorno con Docker/Testcontainers o CI que la migracion `V14` y los endpoints integrados pasen tests.
- Confirmar storage persistente antes de cargar documentacion definitiva en produccion.
