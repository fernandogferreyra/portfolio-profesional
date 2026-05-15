# EditMode Projects Adversarial Review

## Contexto

- Fecha: 2026-05-14
- PR/rama: `feature/edit-mode-foundation`
- Spec/documentos fuente: `docs/features/edit-mode-projects.md`, `docs/features/edit-mode-projects-verification.md`
- Reviewer: OpenCode

## Criterios De Aceptacion Revisados

- Visitantes no ven controles de edicion.
- Admin con `EditMode Enabled` puede editar el proyecto seleccionado.
- Guardar usa `PATCH /api/admin/projects/{id}`.
- La vista actual refleja cambios guardados.
- No se crean endpoints nuevos ni URLs absolutas.

## Hallazgos

| Severidad | Area | Hallazgo | Evidencia | Fix sugerido |
| --- | --- | --- | --- | --- |
| Minor | Verificacion | El spec puntual no pudo ejecutarse en este WSL por `esbuild` instalado para Windows. | `npm test -- --watch=false --browsers=ChromeHeadless --include src/app/components/projects/projects.component.spec.ts` falla antes de correr Karma. | Ejecutar desde Windows o reinstalar dependencias en un entorno Linux limpio con `npm ci` antes de mergear. |
| Question | UX/datos | La edicion de proyectos sigue siendo monolingue porque el contrato backend actual tambien lo es. | La spec excluye contenido bilingue de proyectos como no-goal. | Abrir etapa dedicada para proyectos ES/EN si se necesita paridad editorial completa. |

## Riesgos Revisados

- Auth/permisos: Los controles dependen de `EditModeService.isEnabled()`, que a su vez depende de admin autenticado.
- Datos/DB: No se agregan migraciones ni endpoints; se reutiliza `GET/PATCH /api/admin/projects`.
- Storage/filesystem: No aplica; esta etapa no sube media ni documentos.
- UI/cache/deploy: La vista se actualiza en memoria con la respuesta guardada; preview contra backend productivo viejo puede fallar si el deploy no contiene el contrato admin vigente.
- Errores/empty states: Si falla la carga o guardado admin, se muestra feedback de error generico localizado.
- Seguridad/secrets: No se agregan secretos ni URLs absolutas.

## Veredicto

PASS WITH GAPS

## Condiciones Antes De Merge/Promocion

- Ejecutar el spec puntual o suite frontend en un entorno con `esbuild` correcto.
- Revisar visualmente `Proyectos` con `EditMode Enabled` en desktop/mobile y confirmar que editar slug, nombre, stack, repo, orden y publicacion persiste y se refleja.
