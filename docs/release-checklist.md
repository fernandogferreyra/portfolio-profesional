# Release Checklist

## Pre-release

- CI verde
- CD verde
- Sin PRs vacios activos de `release-please`
- `pom.xml` y `.release-please-manifest.json` alineados con la version esperada
- Sin inconsistencias entre version estable, snapshot y manifest
- Sin cambios pendientes fuera del alcance de release

## Reglas

- No mergear PRs vacios de `release-please`
- No avanzar versiones manualmente sin una release real que lo justifique
- El manifest debe reflejar la ultima version estable conocida por `release-please`
- El estado `SNAPSHOT` solo debe existir despues de una release real, no como workaround manual

## Validacion recomendada

- Comparar `backend/pom.xml` con `.release-please-manifest.json` antes de mergear a `main`
- Si `release-please` intenta abrir PRs repetidos de snapshot, cerrar el PR vacio y corregir primero la desalineacion entre manifest/versionado
