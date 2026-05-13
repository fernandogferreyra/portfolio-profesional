# Adversarial Review: Document Cleanup CV Resilience

## Alcance Revisado

- `DELETE /api/admin/documents/{id}`.
- Desvinculacion de bloques CMS antes de eliminar metadata documental.
- Borrado fisico de archivo en storage local configurable.
- UI admin para eliminar documentos internos desde `Actualizar`.

## Riesgos Revisados

- Acceso publico accidental a documentos: no se agrega endpoint publico generico; la descarga publica sigue siendo solo por bloque publicado.
- Borrado de documento todavia usado por CMS: el backend desvincula todos los bloques con ese `documentId` antes de borrar metadata.
- Archivo fisico ya ausente: `Files.deleteIfExists` permite limpiar metadata aunque el archivo ya no este.
- Path traversal en borrado: el storage resuelve contra `basePath`, normaliza y rechaza paths fuera de esa base.
- Estado local de UI inconsistente: despues de borrar, la lista remueve el documento y los bloques cargados con ese `documentId` quedan en `null` localmente.

## Hallazgos

- No se detectaron nuevos endpoints publicos de documentos.
- No se detecto exposicion de paths internos al visitante.
- Riesgo residual: si el backend borra archivo fisico y luego falla el delete de metadata, puede quedar metadata sin archivo; el flujo desvincula primero y el caso operativo se corrige volviendo a eliminar metadata. Para volumen actual, se acepta mantener el cambio minimo.
- Riesgo residual: la solucion limpia referencias rotas, pero no reemplaza la necesidad de storage persistente en Render.

## Resultado

- Aprobado con riesgos residuales documentados.
