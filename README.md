# Portfolio Profesional

Aplicacion full-stack para portfolio profesional con frontend Angular en `frontend/` y backend Spring Boot en `backend/`.

## Estado actual

- Arquitectura monolitica por capas globales.
- Backend como source of truth para auth JWT, contacto, proyectos, estimador tecnico y `Budget Builder` admin.
- Frontend publico operativo y dashboard privado en `control-center`.
- CI separada para frontend y backend en `.github/workflows/ci.yml`.

## Estructura

```text
portfolio-profesional/
  frontend/   # Angular 20
  backend/    # Spring Boot 3.3.5 + Java 17
  docs/
  DOCUMENTATION.md
```

## Stack

- Angular 20
- TypeScript
- Spring Boot 3.3.5
- Java 17
- Spring Security + JWT
- Spring Data JPA
- PostgreSQL
- Flyway
- OpenAPI / Swagger UI

## Requisitos

- Node.js 20.19+ para `frontend/`
- Java 17 para `backend/`
- PostgreSQL para desarrollo local del backend

## Frontend

```bash
cd frontend
npm ci
npm start
```

Comandos utiles:

```bash
npm test -- --watch=false --browsers=ChromeHeadless
npm run build:ci
```

El frontend consume la API usando rutas relativas `/api` y en desarrollo usa `frontend/proxy.conf.json` hacia `http://localhost:8080`.

## Backend

Variables de entorno minimas para desarrollo:

- `PORTFOLIO_DB_URL`
- `PORTFOLIO_DB_USERNAME`
- `PORTFOLIO_DB_PASSWORD`
- `PORTFOLIO_JWT_SECRET`

Si queres bootstrap del admin para desarrollo local, ademas:

- `PORTFOLIO_BOOTSTRAP_ADMIN_ENABLED=true`
- `PORTFOLIO_ADMIN_USERNAME=<usuario>`
- `PORTFOLIO_ADMIN_PASSWORD=<password>`

Arranque local:

```bash
cd backend
./mvnw spring-boot:run
```

Si lo levantas desde VS Code, el `launch.json` ya usa `${workspaceFolder}/.env`. Crea un `.env` local a partir de `.env.example` con tus credenciales reales de PostgreSQL y tu `PORTFOLIO_JWT_SECRET`.

Swagger UI:

```text
http://localhost:8080/swagger-ui.html
```

## CI

El workflow actual:

- instala dependencias frontend
- ejecuta tests frontend
- compila frontend en modo produccion
- ejecuta tests backend
- empaqueta backend

Releases:

- `release-please` queda configurado como workflow separado para `main`
- genera PR de release, changelog y versionado por componente (`frontend` y `backend`)

## Deuda abierta relevante

- El portfolio publico todavia usa proyectos estaticos en frontend.
- El cotizador comercial historico sigue en `localStorage`; `site-activity` ya persiste en backend.
- Falta dockerizacion y estrategia de deploy.
- Los tests backend de integracion todavia dependen de PostgreSQL.

## Seguimiento

- Estado operativo: `docs/handoff-control-center.md`
- Memoria tecnica: `DOCUMENTATION.md`
- Camino a produccion: `docs/path-to-production.md`
