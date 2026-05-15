# EditMode Skills E Inicio

## Contexto

- Fecha: 2026-05-15
- Rama: `feature/edit-mode-skills-home`
- Tipo: feature
- Fuente: usuario

## Problema

`EditMode` ya permite editar contenido contextual en contacto, credenciales y proyectos, pero `Skills` e `Inicio` siguen dependiendo mayormente de datos hardcodeados del frontend.

## Objetivo

Agregar edicion contextual minima para `Skills` e `Inicio`, manteniendo el backend/CMS como fuente editable y evitando borrado definitivo de skills.

## Alcance

- Incluye: sembrar bloques CMS para `home.*`, `skills.hero` y `skill.<id>`.
- Incluye: consumir esos bloques desde `Inicio` y `Skills` con fallback local si la API no responde.
- Incluye: permitir editar titulo/cuerpo/items/publicacion desde `EditMode` usando CMS.
- Incluye: agregar/quitar items de los bloques desde UI.
- Incluye: crear nuevas experiencias tecnicas para `Inicio` desde `EditMode`.
- Incluye: derivar `Stack y enfoque` desde skills publicadas, sin editor propio.
- Incluye: quitar el resumen de credenciales de `Inicio`; la fuente y visualizacion quedan solo en `Formacion y certificaciones`.
- Incluye: agregar `POST /api/admin/content-blocks` para crear bloques CMS admin sin abrir tablas nuevas.
- Incluye: ajustar previews de credenciales para que imagenes no PDF ocupen el recuadro de la card.
- Incluye: permitir preview admin de documentos de credenciales aunque la credencial este en borrador.
- Incluye: agregar alta/baja admin de proyectos desde `EditMode`, con confirmacion antes de eliminar.

## No-goals

- No incluye: tabla dedicada de skills.
- No incluye: borrado definitivo de skills.
- No incluye: redisenar visualmente las paginas fuera de los controles de edicion.
- No incluye: borrar archivos/documentos asociados cuando se elimina un proyecto.

## Criterios De Aceptacion

- Dado un visitante publico, cuando entra a `Skills`, entonces ve solo skills publicadas desde CMS si los bloques existen, o fallback local si la API falla.
- Dado un admin con `EditMode Enabled`, cuando edita un bloque de `Inicio`, entonces el cambio se guarda con `PATCH /api/admin/content-blocks/{id}` y se refleja en la pagina.
- Dado un admin con `EditMode Enabled`, cuando marca una skill como no publicada, entonces esa skill queda oculta para visitantes sin borrarse del CMS.
- Dado un admin con `EditMode Enabled`, cuando agrega una experiencia tecnica, entonces se crea un bloque CMS `home.technical.*` del idioma activo y aparece como nueva pestana de experiencia.
- Dado un usuario en idioma ingles, cuando activa `EditMode`, entonces los labels de edicion se muestran en ingles.
- Dado un admin que sube un documento a una credencial en borrador, cuando vuelve a la card, entonces puede previsualizarlo usando endpoint admin protegido.
- Dado un admin en `Proyectos`, cuando crea un proyecto nuevo, entonces aparece como borrador editable.
- Dado un admin en `Proyectos`, cuando elimina un proyecto, entonces la UI pide confirmacion antes de llamar al backend.

## Riesgos

- Riesgo: ocultar accidentalmente skills si falla la API publica.
- Mitigacion: usar fallback local solo cuando no existan bloques CMS para el idioma activo.

## Validacion Esperada

- Comando/test: `npx tsc -p tsconfig.app.json --noEmit`
- Comando/test: `npx tsc -p tsconfig.spec.json --noEmit`
- Comando/test: backend compile/test aplicable segun entorno.

## Impacto En Documentacion

- `DOCUMENTATION.md`
- `docs/handoff-control-center.md`
- `docs/features/edit-mode-skills-home-verification.md`
- `docs/features/edit-mode-skills-home-adversarial-review.md`

## Notas De Implementacion

- Archivos probables: migracion Flyway, `home.component.*`, `skills.component.*`, specs de frontend, controller/service/mapper/repository CMS.
- Decisiones tecnicas: reutilizar `public_content_blocks` y sumar solo alta admin generica para bloques, sin abrir arquitectura paralela.
- Dependencias: ninguna nueva.
