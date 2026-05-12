# AGENTS

## Rol

- Actuar como Arquitecto de Software y Software Engineer Senior.

## Modo de trabajo

- No explicar teoria innecesaria.
- No reanalizar decisiones ya documentadas.
- Leer SIEMPRE antes de actuar:
  1. `docs/handoff-control-center.md`
  2. `DOCUMENTATION.md`
  3. `docs/agent-operating-model.md`
- Antes de agregar features o abrir una nueva linea de trabajo, revisar el handoff y la documentacion vigente.
- Continuar desde el estado actual sin reiniciar el analisis.
- Trabajar con SDD liviano: primero spec, despues implementacion. No operar por intuicion o "vibe" cuando haya cambios funcionales.
- Si aparece feedback nuevo durante una tarea, actualizar la spec/checklist de esa tarea antes de seguir codificando.

## Arquitectura obligatoria

- Mantener arquitectura monolitica por capas globales.
- Frontend en `frontend/`.
- Backend en `backend/`.
- Backend organizado solo en:
  - `controller/`
  - `controller/admin/`
  - `service/`
  - `service/impl/`
  - `repository/`
  - `domain/<feature>/`
  - `dto/<feature>/`
  - `mapper/<feature>/`
- No usar ni recrear `module/*`.

## Source of truth

- La logica critica y las reglas oficiales viven en backend.
- El backend es la fuente de verdad del sistema.
- El frontend solo resuelve UI, estado de pantalla y consumo HTTP.
- No mover logica critica al frontend.

## Git y ramas

- La rama de integracion diaria es `develop`.
- No trabajar directo sobre `main` ni sobre `develop` para cambios funcionales.
- Cada cambio nuevo debe salir desde `develop` en una rama corta con nombre explicito.
- El flujo esperado es: crear rama desde `develop` -> implementar -> validar -> push -> PR hacia `develop`.
- `main` solo debe recibir PRs desde `develop` cuando se decida una integracion estable.
- Despues de mergear una rama de trabajo a `develop`, borrarla si ya no tiene sentido mantenerla.
- Evitar ramas largas paralelas si el cambio puede resolverse como una serie de ramas cortas sobre `develop`.
- Si `release-please` genera un PR vacio, NO mergearlo.
- Ante un PR vacio de `release-please`, revisar siempre `pom.xml`, `.release-please-manifest.json` y tags antes de seguir.

## Continuidad

- No revisar modulos marcados como cerrados.
- Solo revisarlos si el cambio actual los afecta directamente.

## Documentacion obligatoria

- Al finalizar cada tarea, actualizar `DOCUMENTATION.md` con:
  - que se hizo
  - archivos modificados
  - decisiones tecnicas
  - proximos pasos
- Para features o bugs no triviales, usar o reflejar el formato de `docs/templates/feature-spec.md` y dejar criterios de aceptacion verificables.
- Para validaciones relevantes, registrar comandos/resultados siguiendo `docs/templates/verification-report.md` cuando el cambio toque backend, DB, deploy o flujos criticos.

## Restricciones

- No expandir scope sin justificar.
- No refactorizar por gusto.
- No tocar codigo no relacionado.
- No reabrir arquitecturas hibridas ni verticales por feature.

## Calidad

- Codigo limpio.
- Bajo acoplamiento.
- Sin hardcode innecesario.
- Bugs: primero evidencia/reproduccion o hipotesis verificable, despues fix minimo.
- Features: criterios de aceptacion antes de implementar.
- Cambios riesgosos: aplicar revision adversarial antes de mergear o promover.
