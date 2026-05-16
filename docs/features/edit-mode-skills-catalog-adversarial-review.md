# EditMode Skills Catalog Adversarial Review

## Contexto

- Fecha: 2026-05-15
- PR/rama: `feature/edit-mode-skills-catalog`
- Spec/documentos fuente: `docs/features/edit-mode-skills-catalog.md`
- Reviewer: OpenCode

## Criterios De Aceptacion Revisados

- Criterio: backend es source of truth para skills/categorias.
- Criterio: borrar categoria no borra skills.
- Criterio: visitante no ve controles admin ni borradores.
- Criterio: `Enfoque tecnico` y Home derivan de categorias reales.

## Hallazgos

| Severidad | Area | Hallazgo | Evidencia | Fix sugerido |
| --- | --- | --- | --- | --- |
| Minor | Datos/CMS | Los bloques CMS `skill.*` quedan como legado y ya no son fuente principal de Skills. | `SkillsComponent` consume `/api/skills`; CMS se mantiene para hero. | Decidir en una etapa posterior si se eliminan o migran definitivamente los bloques `skill.*`. |
| Minor | i18n | Crear una skill nueva opera sobre el idioma activo; no crea automaticamente su par ES/EN. | Payload admin incluye `language` del idioma activo. | Usar la IA admin existente para generar version traducida en una etapa posterior si se requiere. |
| Minor | Storage | Los iconos de skills se sirven por `/api/skills/{id}/icon`, incluso si el item esta en borrador. | Se prioriza preview simple de iconos no sensibles en EditMode. | Si se vuelve contenido sensible, separar endpoint admin con Blob autenticado. |

## Riesgos Revisados

- Auth/permisos: endpoints admin quedan bajo `/api/admin/**`; endpoint publico `/api/skills` solo devuelve publicadas.
- Datos/DB: V19 agrega tablas nuevas sin alterar tablas existentes; V20 agrega columnas opcionales para icono/color; seed usa `ON CONFLICT` para idempotencia por idioma/slug.
- Storage/filesystem: los iconos usan `documents` existente con `purpose=skill-icon`; al borrar un documento se desvinculan skills asociadas.
- UI/cache/deploy: si frontend se despliega antes que backend con V19, `/api/skills` puede fallar y la UI quedara sin catalogo hasta desplegar backend.
- Errores/empty states: si el endpoint falla, `Skills` y Home caen a listas vacias; no rompen compilacion pero requieren backend levantado.
- Seguridad/secrets: no se agregan secretos.

## Veredicto

PASS WITH GAPS

## Condiciones Antes De Merge/Promocion

- Validar visualmente `Skills` con `EditMode Enabled`.
- Confirmar en CI/Testcontainers que V19 aplica correctamente.
- No promover frontend sin backend desplegado con `/api/skills`.
