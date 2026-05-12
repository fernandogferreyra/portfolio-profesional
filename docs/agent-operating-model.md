# Agent Operating Model

## Objetivo

Este proyecto usa SDD liviano: Spec-Driven Development pragmatica, sin incorporar todavia OpenSpec completo.

La regla central es simple: no se implementan features ni bugs no triviales por intuicion. Primero se define el comportamiento esperado, despues se cambia codigo, despues se verifica contra esa definicion.

## Principios

- Backend como source of truth para reglas criticas.
- Cambios pequenos, revisables y con alcance explicito.
- Una rama corta por linea de trabajo.
- Spec antes de implementacion cuando hay comportamiento nuevo o bug relevante.
- Tests y validaciones proporcionales al riesgo.
- Documentacion actualizada al cerrar cada tarea.
- No mezclar bugs chicos con features grandes si pueden viajar en PRs separados.

## Flujo SDD

1. Intake
   - Leer `docs/handoff-control-center.md`, `DOCUMENTATION.md` y este documento.
   - Identificar si el pedido es bug, feature, refactor, deploy/release o investigacion.
   - Separar alcance inmediato de no-goals.

2. Spec corta
   - Definir problema, alcance, no-goals, criterios de aceptacion y validaciones.
   - Usar `docs/templates/feature-spec.md` cuando el cambio tenga mas de un paso o afecte comportamiento publico/admin.
   - Si la tarea es trivial, puede quedar resumida en el mensaje y en `DOCUMENTATION.md`.

3. Implementacion
   - Crear rama desde `develop` salvo que se este continuando una rama activa aprobada.
   - Aplicar el cambio minimo correcto.
   - No reabrir arquitectura ni refactorizar fuera del alcance.

4. Verificacion
   - Ejecutar typecheck/build/tests aplicables.
   - Para backend/DB/API, preferir tests automatizados y, si aplica, verificacion manual con endpoint.
   - Para UI, agregar spec/regresion cuando el comportamiento sea estable y verificable.
   - Documentar bloqueos de entorno sin ocultarlos.

5. Revision
   - Para cambios de auth, storage, deploy, DB, permisos, IA o flujo admin, hacer una pasada adversarial antes de merge/promocion.
   - Usar `docs/templates/adversarial-review.md` como formato minimo.

6. Cierre
   - Actualizar `DOCUMENTATION.md`.
   - Confirmar estado de PR/CI.
   - No mergear ni promover ramas sensibles sin aprobacion explicita del usuario.

## Definition Of Ready

Un cambio esta listo para implementarse cuando tiene:

- Problema o intencion clara.
- Alcance y no-goals.
- Criterios de aceptacion verificables.
- Riesgos conocidos.
- Validaciones esperadas.

## Definition Of Done

Un cambio esta listo para PR/merge cuando:

- Los criterios de aceptacion estan cubiertos.
- Las validaciones aplicables pasaron o los bloqueos estan documentados.
- La documentacion vigente fue actualizada.
- No se incluyeron secretos ni artefactos locales.
- El PR tiene descripcion clara y CI verde antes de merge.

## Tipos De Cambio

### Bug

- Registrar evidencia: captura, error, endpoint, log o descripcion reproducible.
- Identificar causa probable antes de editar.
- Agregar regresion cuando el bug pueda volver.
- Evitar expandir a feature salvo decision explicita.

### Feature

- Crear spec corta.
- Definir estado inicial, comportamiento esperado y casos limite.
- Implementar por etapas si el alcance crece.
- No mezclar con releases ni refactors innecesarios.

### Deploy / Release

- Revisar PRs abiertos, CI/CD, tags, changelogs y manifest.
- No mergear `release-please` si genera rutas duplicadas o PR vacio.
- Sincronizar metadata de release de vuelta a `develop` despues de releases.

### Proximo Proyecto

Al iniciar un proyecto nuevo, crear desde el dia 1:

- `AGENTS.md`
- `DOCUMENTATION.md`
- `docs/agent-operating-model.md`
- `docs/templates/feature-spec.md`
- `docs/templates/verification-report.md`
- `docs/templates/adversarial-review.md`

OpenSpec completo queda como opcion futura si el equipo decide sostener sus artefactos y comandos como parte del flujo diario.
