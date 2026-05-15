# Credential Document Local Persistence Adversarial Review

## Contexto

- Fecha: 2026-05-15
- PR/rama: `feature/edit-mode-skills-catalog`
- Spec/documentos fuente: `docs/features/credential-document-local-persistence.md`
- Reviewer: OpenCode

## Criterios De Aceptacion Revisados

- Criterio: el mismo path relativo apunta al mismo storage desde raiz y desde `backend/`.
- Criterio: los paths absolutos configurados por entorno no se modifican.
- Criterio: no se exponen documentos privados ni se cambia el contrato documental.

## Hallazgos

| Severidad | Area | Hallazgo | Evidencia | Fix sugerido |
| --- | --- | --- | --- | --- |
| Minor | Datos locales | Archivos ya repartidos entre `runtime/documents` y `backend/runtime/documents` no se migran automaticamente. | Existen archivos en ambas carpetas locales. | Consolidar manualmente si la DB local referencia archivos del storage anterior o re-subir documentos afectados. |

## Riesgos Revisados

- Auth/permisos: sin cambios en endpoints publicos/admin ni en seguridad.
- Datos/DB: sin migraciones ni cambios de schema.
- Storage/filesystem: cambio limitado a resolucion de path relativo dentro del workspace; paths absolutos siguen intactos.
- UI/cache/deploy: sin cambios frontend.
- Errores/empty states: si falta el archivo fisico, el comportamiento de descarga sigue fallando como antes; este cambio previene nuevos desdoblamientos de storage local.
- Seguridad/secrets: no se agregan secretos ni se lee `.env`.

## Veredicto

PASS WITH GAPS

## Condiciones Antes De Merge/Promocion

- Validacion final de compilacion backend ejecutada con `mvnw.cmd -DskipTests clean test-compile` OK.
- Hacer prueba manual de reinicio con una credencial y documento reales si se quiere cerrar el bug operativo completo.
