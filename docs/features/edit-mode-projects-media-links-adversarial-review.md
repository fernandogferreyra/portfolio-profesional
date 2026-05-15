# EditMode Projects Media Links Adversarial Review

## Contexto

- Fecha: 2026-05-14
- PR/rama: `feature/edit-mode-foundation`
- Spec/documentos fuente: `docs/features/edit-mode-projects-media-links.md`, `docs/features/edit-mode-projects-media-links-verification.md`
- Reviewer: OpenCode

## Criterios De Aceptacion Revisados

- Acciones normalizadas por proyecto: demo, repositorio, documentacion.
- Repo backend reflejado en proyectos con detalle estatico.
- Demo YouTube editable y usada para modal/thumbnail.
- Icono PNG/ICO asociado por documento y servido por endpoint publico acotado al proyecto publicado.
- Puntos destacados, secciones, documentos y capturas/fotos editables desde `EditMode`; metricas no se exponen como bloques publicos repetidos.
- Sin URLs absolutas al backend.

## Hallazgos

| Severidad | Area | Hallazgo | Evidencia | Fix sugerido |
| --- | --- | --- | --- | --- |
| Minor | Verificacion | No se pudo correr Karma en WSL por binario `esbuild` de Windows. | Falla antes de ejecutar `projects.component.spec.ts`. | Ejecutar desde Windows o Linux limpio con `npm ci`. |
| Minor | Verificacion | No se pudo correr suite backend completa por falta de Docker/Testcontainers. | `mvnw.cmd test` falla con `Could not find a valid Docker environment`. | Correr en CI o entorno local con Docker Desktop activo. |
| Question | UX | La demo no sube video, solo guarda link YouTube. | Es parte explicita del alcance pedido: link de demo. | Si luego se requiere video propio, abrir etapa de storage multimedia dedicada. |
| Question | UX | No se implemento borrado granular de documentos/capturas desde la UI. | El alcance actual pidio subir multiples documentos/fotos y editar contenido. | Agregar quitar/desasociar assets en una etapa corta si hace falta luego de la revision visual. |
| Question | Datos | `metrics_json` queda en backend aunque la UI ya no lo renderiza. | Se evita una migracion destructiva y se preserva compatibilidad con el contrato ya extendido. | Limpiar o deprecar ese campo en una etapa posterior si no se usa mas. |

## Riesgos Revisados

- Auth/permisos: La edicion y subida de icono siguen protegidas por endpoints admin y `EditModeService`.
- Datos/DB: Migraciones `V15` y `V16` son aditivas; los assets multiples quedan como arrays JSON de UUID para mantener el cambio acotado.
- Storage/filesystem: Iconos usan storage documental existente; se agregan MIME `image/x-icon` e `image/vnd.microsoft.icon`.
- UI/cache/deploy: Preview frontend contra backend viejo puede no recibir campos nuevos; la UI tolera valores ausentes, pero no mostrara botones nuevos hasta desplegar backend.
- Errores/empty states: Si un icono asociado pierde el archivo fisico, el endpoint publico devuelve 404; la UI solo intenta mostrar `iconUrl` cuando backend lo expone.
- Seguridad/secrets: No se agregan secretos; icono publico queda limitado a proyecto publicado, no hay descarga generica de documentos.

## Veredicto

PASS WITH GAPS

## Condiciones Antes De Merge/Promocion

- Ejecutar CI o suite backend con Docker/Testcontainers.
- Ejecutar suite/spec frontend en entorno con `esbuild` correcto.
- Validar visualmente que `Portfolio Profesional` ya no muestre `Ir a contacto` y que repo/demo/monografia/icono se reflejen al guardar.
