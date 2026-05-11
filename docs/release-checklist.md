# Release Checklist

## Pre-release

- CI verde
- CD verde
- Sin PRs vacios activos de `release-please`
- `pom.xml` y `.release-please-manifest.json` alineados con la version esperada
- `release-please-config.json` sin rutas duplicadas de changelog: en packages `frontend` y `backend`, usar `CHANGELOG.md`, no `frontend/CHANGELOG.md` ni `backend/CHANGELOG.md`
- Sin inconsistencias entre version estable, snapshot y manifest
- Sin cambios pendientes fuera del alcance de release

## Reglas

- No mergear PRs vacios de `release-please`
- No avanzar versiones manualmente sin una release real que lo justifique
- El manifest debe reflejar la ultima version estable conocida por `release-please`
- El estado `SNAPSHOT` solo debe existir despues de una release real, no como workaround manual

## Validacion recomendada

- Comparar `backend/pom.xml` con `.release-please-manifest.json` antes de mergear a `main`
- Revisar que el PR de `release-please` modifique `frontend/CHANGELOG.md` y `backend/CHANGELOG.md`, nunca `frontend/frontend/CHANGELOG.md` ni `backend/backend/CHANGELOG.md`
- Si `release-please` intenta abrir PRs repetidos de snapshot, cerrar el PR vacio y corregir primero la desalineacion entre manifest/versionado
