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
- Desde esta etapa ya existe `.github/workflows/cd.yml` como base de CD reproducible: construye imagenes Docker y publica un `deploy-bundle` descargable, pero todavia no empuja a ningun proveedor ni reemplaza el control manual.

## 3. Pull Request Obligatorio

- Aunque se trabaje solo, los cambios deben integrarse via PR.
- La IA produce codigo orquestado por el desarrollador; el PR es la capa intermedia de control.
- Antes de mergear:
  - revisar diff
  - revisar checks
  - revisar comentarios pendientes

## 3.1 Branching oficial

- `main`: rama estable de release.
- `develop`: rama integradora diaria.
- `feature/*`, `fix/*`, `chore/*`: ramas cortas creadas desde `develop`.
- Los PRs normales deben ir hacia `develop`.
- `main` debe recibir solo PRs desde `develop`.
- Despues de mergear una rama corta a `develop`, borrarla si ya no tiene sentido mantenerla.

### Reglas recomendadas para `main`

- bloquear merges directos a `main`
- permitir solo merge via PR
- activar `Require conversation resolution before merging`
- exigir status checks verdes antes del merge

### Ruleset sugerido en GitHub

En `Settings > Rules > Rulesets > New ruleset`:

1. Target branch: `main`
2. Activar `Require a pull request before merging`
3. Activar `Require conversation resolution before merging`
4. Activar `Require status checks to pass before merging`
5. Usar como checks minimos:
   - `Build Angular App`
   - `Build Backend`
6. Opcional cuando el flujo madure:
   - requerir aprobacion humana
   - requerir branch up to date antes de merge
   - bloquear force push directo a `main`

## 4. GitHub Actions

- Los workflows viven en `.github/workflows/`.
- `ci.yml` define el minimo de validacion automatizada del repo.
- `cd.yml` construye la base de despliegue sobre Docker y publica el bundle resultante como artifact.
- Acciones tipicas:
  - tests frontend
  - build frontend
  - tests backend
  - package backend
  - build de imagenes para deploy

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
- Ya queda configurado en el repo como workflow separado sobre `main`.
- Objetivo esperado:
  - PR de release automatica
  - versionado consistente
  - changelog y release notes generadas desde commits

### Recomendacion para este repo

- configurar `release-please` como monorepo
- versionado separado para:
  - `frontend`
  - `backend`
- archivos principales:
  - `.github/workflows/release-please.yml`
  - `release-please-config.json`
  - `.release-please-manifest.json`
  - `frontend/CHANGELOG.md`
  - `backend/CHANGELOG.md`

## 8. Flujo Operativo Recomendado

1. Crear rama corta desde `develop`.
2. Abrir etapa acotada.
3. Implementar.
4. Ejecutar tests relevantes.
5. Actualizar `DOCUMENTATION.md` y handoff.
6. Crear commit pequeno y claro.
7. Push.
8. Abrir/revisar PR hacia `develop`.
9. Merge solo con checks verdes.
10. Cuando `develop` este lista, abrir PR de `develop` hacia `main`.

## 9. Checklist Antes de Merge

- tests relevantes verdes
- CI verde
- sin secretos en el diff
- sin archivos generados ni carpetas locales accidentales
- sin logica critica movida al frontend
- `DOCUMENTATION.md` actualizado
- handoff actualizado si el cambio afecta el panel privado
- PR template completado

## 10. Proximos Pasos

- Integrar `release-please` cuando cierre el rescate funcional desde la copia.
- Configurar ruleset de `main` en GitHub.
- Mantener este documento como referencia operativa del camino a produccion.

## 11. Email Transaccional

- Para `Mensajeria`, el provider recomendado es `Resend`.
- Motivo:
  - tiene plan gratuito razonable
  - API simple
  - evita depender de Gmail SMTP para produccion
  - encaja mejor con deploys tipo Render/Vercel

### Variables necesarias

```properties
PORTFOLIO_CONTACT_MAIL_ENABLED=true
PORTFOLIO_CONTACT_MAIL_PROVIDER=resend
PORTFOLIO_CONTACT_INBOX=fernandogabrielf@gmail.com
PORTFOLIO_CONTACT_FROM=onboarding@resend.dev
PORTFOLIO_RESEND_API_KEY=re_xxxxx
```

### Notas

- `onboarding@resend.dev` sirve para pruebas iniciales de cuenta nueva.
- Para autorespuestas serias y entrega mas confiable, conviene verificar tu propio dominio o remitente.
- Mientras no cargues esas variables, el backend sigue en `noop` y el inbox privado funciona sin enviar correos reales.
