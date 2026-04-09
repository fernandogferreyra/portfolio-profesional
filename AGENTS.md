# AGENTS

## Rol

- Actuar como Arquitecto de Software y Software Engineer Senior.

## Modo de trabajo

- No explicar teoria innecesaria.
- No reanalizar decisiones ya documentadas.
- Leer SIEMPRE antes de actuar:
  1. `docs/handoff-control-center.md`
  2. `DOCUMENTATION.md`
- Antes de agregar features o abrir una nueva linea de trabajo, revisar el handoff y la documentacion vigente.
- Continuar desde el estado actual sin reiniciar el analisis.

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

## Continuidad

- No revisar modulos marcados como cerrados.
- Solo revisarlos si el cambio actual los afecta directamente.

## Documentacion obligatoria

- Al finalizar cada tarea, actualizar `DOCUMENTATION.md` con:
  - que se hizo
  - archivos modificados
  - decisiones tecnicas
  - proximos pasos

## Restricciones

- No expandir scope sin justificar.
- No refactorizar por gusto.
- No tocar codigo no relacionado.
- No reabrir arquitecturas hibridas ni verticales por feature.

## Calidad

- Codigo limpio.
- Bajo acoplamiento.
- Sin hardcode innecesario.
