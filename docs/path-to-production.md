# Path To Production

## Objetivo

Definir el proceso minimo y obligatorio para llevar cambios del proyecto a una rama integrable y, mas adelante, a produccion sin perder control al trabajar con IA.

## Principios

- La IA acelera implementacion y revision, pero no reemplaza criterio humano.
- La logica critica vive en backend y debe validarse antes de integrar.
- Los cambios se cierran por etapas chicas: implementar, validar, documentar, commitear, pushear.
- Lo critico se testea primero.

## 1. Tests Primero

- Ejecutar tests unitarios e integracion de lo critico antes de considerar un cambio listo.
- Priorizar:
  - auth
  - endpoints admin
  - motores de cotizacion/estimacion
  - persistencia y migraciones
  - contratos HTTP usados por el panel privado
- Si la IA rompe algo lateralmente, los tests deben detectarlo temprano.
- Regla operativa:
  - testear lo critico
  - testear lo importante
  - delegar solo lo que quede cubierto por validacion automatica y revision humana

### Comandos base

Frontend:

```bash
cd frontend
npm test -- --watch=false --browsers=ChromeHeadless
```

Backend:

```bash
cd backend
./mvnw test
```

## 2. CI/CD Minimo Viable

- Todo cambio relevante debe pasar por CI.
- El minimo viable actual es CI, no CD automatico a produccion.
- CI debe responder rapido si un cambio esta bien o esta mal.
- Cuando el proceso madure, CD podra promover automaticamente solo builds validadas.

## 3. Pull Request Obligatorio

- Aunque se trabaje solo, los cambios deben integrarse via PR.
- La IA produce codigo orquestado por el desarrollador; el PR es la capa intermedia de control.
- Antes de mergear:
  - revisar diff
  - revisar checks
  - revisar comentarios pendientes

### Reglas recomendadas para `main`

- bloquear merges directos a `main`
- permitir solo merge via PR
- activar `Require conversation resolution before merging`
- exigir status checks verdes antes del merge

## 4. GitHub Actions

- Los workflows viven en `.github/workflows/`.
- `ci.yml` define el minimo de validacion automatizada del repo.
- Acciones tipicas:
  - tests frontend
  - build frontend
  - tests backend
  - package backend

## 5. Code Review Asistido

- La revision automatica puede complementar el PR, no reemplazarlo.
- Herramientas como Copilot Review o revisores IA pueden aportar sugerencias.
- Todo hallazgo relevante debe quedar trazable en el PR o en documentacion interna.

## 6. Seguridad

- La seguridad debe tener control explicito, no implicito.
- Hoy no se integra `claude-code-security-review` porque no hay `CLAUDE_API_KEY` disponible.
- Cuando exista API key, se puede sumar como workflow separado de security review sobre PRs.
- Hasta entonces:
  - review humano en cambios sensibles
  - tests
  - CI
  - chequeo de secretos y configuracion

## 7. Release Please

- `release-please` queda como automatizacion objetivo para versionado y release notes.
- Debe agregarse cuando el flujo funcional y de PR quede estable.
- Objetivo esperado:
  - PR de release automatica
  - versionado consistente
  - changelog y release notes generadas desde commits

### Recomendacion para este repo

- configurar `release-please` como monorepo
- versionado separado para:
  - `frontend`
  - `backend`

## 8. Flujo Operativo Recomendado

1. Abrir etapa acotada.
2. Implementar.
3. Ejecutar tests relevantes.
4. Actualizar `DOCUMENTATION.md` y handoff.
5. Crear commit pequeno y claro.
6. Push.
7. Abrir/revisar PR.
8. Merge solo con checks verdes.

## 9. Checklist Antes de Merge

- tests relevantes verdes
- CI verde
- sin secretos en el diff
- sin archivos generados ni carpetas locales accidentales
- sin logica critica movida al frontend
- `DOCUMENTATION.md` actualizado
- handoff actualizado si el cambio afecta el panel privado

## 10. Proximos Pasos

- Integrar `release-please` cuando cierre el rescate funcional desde la copia.
- Configurar ruleset de `main` en GitHub.
- Mantener este documento como referencia operativa del camino a produccion.
