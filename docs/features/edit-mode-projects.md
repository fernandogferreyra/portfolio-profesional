# EditMode Projects

## Problema

`ProjectsComponent` ya consume `GET /api/projects` para la lista publica y existe base admin `GET/PATCH /api/admin/projects`, pero la edicion sigue fuera de la pagina publica. El flujo vigente de `EditMode` requiere cerrar la edicion pagina por pagina desde la superficie visible.

## Alcance

- Mostrar controles de edicion solo con `EditMode Enabled`.
- Editar el proyecto seleccionado desde la pagina `Proyectos`.
- Reutilizar `GET/PATCH /api/admin/projects` como source of truth.
- Permitir modificar slug, nombre, ano, categoria, resumen, stack, repo, orden, destacado y publicado.
- Reflejar los cambios guardados en la vista actual sin recargar manualmente.

## No Goals

- No crear endpoints nuevos.
- No migrar todavia el detalle rico completo de proyectos a backend.
- No implementar contenido bilingue de proyectos en esta pasada.
- No subir imagenes/media de proyectos.
- No implementar alta/borrado de proyectos.

## Criterios De Aceptacion

- Visitantes no ven controles de edicion.
- Admin con `EditMode Enabled` ve un editor para el proyecto seleccionado.
- Guardar envia `PATCH /api/admin/projects/{id}`.
- Cambios de nombre/resumen/stack/repo se reflejan en la vista de proyectos.
- El frontend mantiene `/api` relativo y no duplica reglas criticas.
