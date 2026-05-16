# EditMode Projects Media Links

## Problema

La vista de `Proyectos` no esta normalizada entre aplicaciones. `ObraSmart` muestra acciones alineadas al proyecto (`Ver demo`, `Codigo`, `Monografia`), pero `Portfolio Profesional` conserva acciones genericas (`Ver inicio`, `Ver skills`, `Ir a contacto`). Ademas el editor contextual no permite cargar link de demo de YouTube ni icono propio de la app/proyecto, y los cambios de repositorio pueden no reflejarse porque las acciones estaticas pisan los datos backend.

## Alcance

- Extender el contrato backend de proyectos con `demoUrl`, `monographUrl`, `iconDocumentId` e `iconUrl`.
- Permitir editar `demoUrl` y `monographUrl` desde `Proyectos` con `EditMode Enabled`.
- Permitir subir icono `.png` o `.ico` usando la base documental existente y asociarlo al proyecto.
- Permitir subir multiples documentos de proyecto y multiples capturas/fotos.
- Usar `Puntos destacados` como bloque editable principal para resaltar lo importante del proyecto.
- Mantener metricas en backend como datos migrados, pero no renderizarlas como bloques publicos repetidos.
- Mantener las secciones del detalle publico y editarlas separadas por titulo/items en `EditMode`.
- Mostrar el icono propio del proyecto cuando exista, con fallback visual tipo wordmark si no hay icono o si falla la carga.
- Generar acciones publicas normalizadas desde backend: `Ver demo`, `Repositorio`, `Documentacion`.
- Reflejar `repositoryUrl` backend en proyectos con detalle estatico, incluyendo `Portfolio Profesional`.

## No Goals

- No crear alta/borrado de proyectos.
- No migrar el detalle rico completo de proyectos a backend.
- No implementar galeria multimedia ni subida de videos.
- No implementar borrado granular de documentos/capturas desde la UI en esta pasada.
- No abrir descarga publica generica de documentos.
- No resolver contenido bilingue completo de proyectos en esta etapa.

## Criterios De Aceptacion

- El editor de proyectos permite cargar demo, monografia, repo e icono.
- Guardar proyecto envia esos campos por `PATCH /api/admin/projects/{id}`.
- `GET /api/projects` devuelve `repositoryUrl`, `demoUrl`, `monographUrl` e `iconUrl` para proyectos publicados.
- Si un proyecto tiene `demoUrl`, el panel derecho muestra el reproductor YouTube inline; el boton/modal queda solo como fallback cuando no haya embed inline.
- Si un proyecto tiene `repositoryUrl`, la accion publica es `Repositorio` y apunta al repo real.
- Si un proyecto tiene `monographUrl` o documentos asociados, la accion publica es `Documentacion`.
- `Puntos destacados` se edita desde `EditMode` y reemplaza la exposicion publica de metricas.
- Las secciones `Problema`, `Solucion`, `Arquitectura`, etc. siguen visibles en el detalle publico.
- Las capturas/fotos asociadas se muestran como carrusel horizontal en el panel derecho solo cuando existen, debajo del reproductor si hay demo; la miniatura del video no se usa como captura.
- Si no hay capturas, no se renderiza carrusel.
- Si no hay demo inline, el panel derecho muestra solo el icono/wordmark animado del proyecto, sin card interna de logo + nombre.
- El selector superior de proyectos muestra iconos/wordmarks animados grandes con el nombre del proyecto debajo, sin cards grandes ni textos duplicados; si falta icono subido usa un mark default simple.
- El detalle de stack usa iconos grandes y consistentes, con nombre debajo.
- `Portfolio Profesional` deja de mostrar `Ir a contacto` como accion de proyecto.
- El icono subido se muestra en cards/detalle cuando `iconUrl` existe y cae a wordmark si la imagen falla.
- El frontend mantiene URLs `/api` relativas para archivos servidos por backend.

## Validaciones Esperadas

- Typecheck frontend app/spec.
- `git diff --check`.
- Test/backend compile aplicable con migracion `V15`.
- Spec puntual de `ProjectsComponent` para repo/demo/monografia/icono.
- Revision visual desktop/mobile de `Proyectos` con `EditMode Enabled`.
