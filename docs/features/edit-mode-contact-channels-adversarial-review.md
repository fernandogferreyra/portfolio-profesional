# EditMode Contact Channels Adversarial Review

## Contexto

- Fecha: 2026-05-14
- Rama: `feature/edit-mode-foundation`
- Spec/documentos fuente: `docs/features/edit-mode-contact-channels.md`
- Reviewer: OpenCode

## Criterios De Aceptacion Revisados

- Admin con `EditMode Enabled` puede editar canales directos desde la pagina publica.
- Visitantes no ven controles de edicion.
- CV se sube por flujo documental admin y queda asociado a `contact.cv`.
- Los datos oficiales siguen viviendo en backend/CMS.

## Hallazgos

| Severidad | Area | Hallazgo | Evidencia | Fix sugerido |
| --- | --- | --- | --- | --- |
| Minor | i18n | La edicion guarda solo el bloque del idioma activo. | El componente carga y edita `block.language === currentLanguage()`. | Aceptado para esta pasada; resolver duplicado/traduccion ES-EN en una etapa posterior. |
| Question | Storage | La disponibilidad productiva del CV depende del storage persistente configurado. | Se reutiliza `DocumentAdminService.uploadDocument(file, 'cv')`. | Validar volumen/storage de Render antes de cargar el CV definitivo. |
| Low | UX | El canal CV no tiene valor visible editable separado; el CTA visible sigue localizado por fallback (`Abrir CV` / `Open resume`). | `contactChannel('cv')` conserva `fallback.value`. | Aceptado: el usuario necesita subir/reemplazar CV y editar titulo/descripcion; si luego se quiere cambiar el CTA, abrir ajuste chico dedicado. |

## Riesgos Revisados

- Auth/permisos: guardado y upload usan `/api/admin/**`, protegido por `ROLE_FERCHUZ`.
- Source of truth: los canales se guardan en `public_content_blocks`; no se introduce estado local persistente en frontend.
- Documentos: no se abre endpoint publico generico; el CV sigue expuesto por bloque CMS publicado.
- Deploy/preview: previews frontend contra backend productivo solo guardaran si backend productivo ya tiene CMS/documentos desplegados.

## Veredicto

PASS WITH GAPS

## Condiciones Antes De Merge/Promocion

- Revisar visualmente `Contacto` con `EditMode Enabled` en desktop/mobile.
- Guardar al menos un cambio de email/LinkedIn/GitHub y confirmar que el nodo publico se actualiza.
- Subir un CV real o de prueba y confirmar que el boton CV abre el documento asociado.
- Validar en CI limpio o Windows la spec de `ContactComponent`.
