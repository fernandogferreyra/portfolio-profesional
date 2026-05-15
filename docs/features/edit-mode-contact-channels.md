# EditMode Contact Channels

## Problema

`Contacto > Canales directos` ya consume bloques CMS para email, telefono, LinkedIn, GitHub y CV, pero la edicion sigue dependiendo del panel privado anterior. La direccion vigente de `EditMode` pide editar pagina por pagina desde la superficie publica.

## Alcance

- Mostrar un panel de edicion solo cuando `EditMode` este activo.
- Permitir editar titulo, descripcion, valor visible y URL de cada canal directo.
- Permitir subir/reemplazar el CV desde la pagina de Contacto.
- Reutilizar `public_content_blocks` como source of truth y `DocumentService` para archivos.
- Mantener el sitio publico sin controles de edicion cuando `EditMode` este apagado.

## No Goals

- No crear endpoints nuevos.
- No cambiar el modelo de CMS.
- No implementar traduccion automatica ES/EN para canales en esta pasada.
- No abrir borrado definitivo de documentos desde Contacto.

## Criterios De Aceptacion

- Admin con `EditMode Enabled` ve controles de edicion en `Canales directos`.
- Admin puede editar email, telefono/WhatsApp, LinkedIn y GitHub usando bloques CMS existentes.
- Admin puede subir un CV y dejarlo asociado al bloque `contact.cv` del idioma activo.
- Visitantes no ven controles de edicion.
- Los canales renderizados siguen usando `/api` relativo y datos guardados en backend.
