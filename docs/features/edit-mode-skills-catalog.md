# EditMode Skills Catalog

## Contexto

- Fecha: 2026-05-15
- Rama: `feature/edit-mode-skills-catalog`
- Tipo: feature
- Fuente: usuario

## Problema

`Skills` todavia depende de un catalogo hardcodeado en frontend para categorias, iconos, niveles y skills. El `EditMode` actual solo edita copy/tags por CMS y no permite crear una skill nueva ni modificar todo el modelo visible.

## Objetivo

Convertir `Skills` en un catalogo backend-first editable desde `EditMode`, con categorias dinamicas y `Enfoque tecnico` derivado de las categorias reales publicadas.

## Alcance

- Backend dedicado para `skills` y `skill_categories`.
- Endpoints publicos para leer skills publicadas por idioma.
- Endpoints admin para crear/editar skills y crear/editar/eliminar categorias.
- UI contextual en `Skills` con acciones simples: `Nueva skill`, `Editar`, `Nueva categoria`, `Editar categoria`, `Eliminar categoria`.
- Edicion de nivel, icono, nombre, descripcion, categoria, tags, orden y publicacion.
- Al eliminar una categoria, sus skills pasan a `Otras`.
- `Enfoque tecnico` incluye categorias reales publicadas, tambien `Soft skills` si corresponde.

## No-goals

- No borrar skills como accion principal.
- No mover logica critica ni persistencia al frontend.
- No resolver traduccion automatica de skills nuevas en esta etapa.
- No eliminar todavia los datos hardcodeados usados como fallback visual/iconos.

## Criterios De Aceptacion

- Dado un visitante sin `EditMode`, cuando entra en `Skills`, entonces ve solo categorias y skills publicadas desde backend.
- Dado un admin con `EditMode`, cuando crea una skill, entonces se crea como borrador y puede completar nivel, icono, nombre, descripcion, categoria, tags, orden y publicacion.
- Dado un admin con `EditMode`, cuando elimina una categoria, entonces las skills asociadas no se borran y quedan en `Otras`.
- Dado que existe `Soft skills` con skills publicadas, cuando se renderiza `Enfoque tecnico`, entonces aparece en el recuadro.
- Dado `Home`, cuando renderiza `Stack y enfoque`, entonces usa categorias/skills publicadas reales y no una lista hardcodeada incompleta.

## Riesgos

- Riesgo: duplicar fuentes de verdad entre CMS y catalogo dedicado.
- Mitigacion: `Skills` usa el nuevo catalogo para entidad/copy/tags; CMS queda solo para hero y bloques de Home.
- Riesgo: borrar categorias puede dejar skills huerfanas.
- Mitigacion: backend garantiza categoria `Otras` y reasigna antes de borrar.

## Validacion Esperada

- Comando/test: `npx tsc -p tsconfig.app.json --noEmit`
- Comando/test: `npx tsc -p tsconfig.spec.json --noEmit`
- Comando/test: `mvnw.cmd -DskipTests clean test-compile`
- Comando/test: `git diff --check`
- Prueba manual: crear skill borrador, editarla, publicar, eliminar categoria y confirmar reasignacion a `Otras`.

## Impacto En Documentacion

- `DOCUMENTATION.md`
- `docs/handoff-control-center.md`

## Notas De Implementacion

- Archivos probables: backend `domain/skills`, `dto/skills`, `mapper/skills`, `repository/skills`, `service/impl`, controllers public/admin; frontend services/modelos y componentes `Skills`/`Home`.
- Decision tecnica: usar tablas dedicadas porque el modelo ya excede `public_content_blocks`.
