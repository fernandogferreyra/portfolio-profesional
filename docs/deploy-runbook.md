# Deploy Runbook

## Objetivo

Dejar una base reproducible de despliegue sin acoplar el repo todavia a un proveedor unico.

## Piezas agregadas

- `backend/Dockerfile`: empaqueta el backend Spring Boot como contenedor reproducible.
- `backend/src/main/resources/application-prod.yml`: perfil `prod` con datasource/configuracion por variables de entorno.
- `frontend/Dockerfile`: construye Angular dentro de Linux y sirve el build con `nginx`.
- `frontend/nginx.conf`: sirve SPA y proxya `/api` y `/actuator` hacia `backend:8080`.
- `docker-compose.deploy.yml`: levanta `postgres` + `backend` + `frontend` con una sola red.
- `.env.deploy.example`: variables minimas para copiar a un `.env` de despliegue real.
- `.github/workflows/cd.yml`: workflow de CD manual o post-CI en `main` que construye imagenes y publica un bundle de deploy como artifact.

## Como levantar la version de despliegue local

1. Copiar `.env.deploy.example` a `.env` o a otro archivo de entorno local no versionado.
2. Completar al menos:
   - `PORTFOLIO_JWT_SECRET`
   - `PORTFOLIO_POSTGRES_PASSWORD`
3. Levantar:

```bash
docker compose -f docker-compose.deploy.yml up --build
```

4. Abrir frontend en `http://localhost:8081`.
5. Backend queda accesible tambien en `http://localhost:8080`.
6. Healthcheck esperado del backend: `http://localhost:8080/actuator/health`.

## Como usar el workflow `CD`

- Se puede disparar manualmente desde GitHub Actions.
- Tambien puede correr despues de un `CI` exitoso sobre `main`.
- No hace deploy automatico a un proveedor todavia.
- Su funcion actual es validar que la base Docker se construye y dejar un `deploy-bundle` descargable.

## Que falta para deploy real

- Elegir destino final:
  - VM/VPS con Docker Compose
  - Render/Fly.io/Railway para backend
  - hosting estatico o contenedor para frontend
- Definir manejo real de secretos fuera del repo.
- Elegir estrategia de dominio y HTTPS.
- Si se quiere CD real a proveedor, agregar luego un workflow separado con credenciales del destino.

## Criterio actual

- Esta etapa deja al repo listo para construir artefactos de despliegue reproducibles.
- No fuerza todavia un proveedor, no rompe CI y no mezcla secretos en Git.
