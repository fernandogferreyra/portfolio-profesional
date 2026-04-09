# Portfolio Backend

Backend del portfolio profesional construido con Spring Boot 3.3.5 y Java 17.

## Responsabilidad actual

- Login admin con JWT.
- Proteccion de rutas `/api/admin/**`.
- Persistencia de mensajes de contacto.
- Persistencia de eventos del sitio.
- Catalogo publico de proyectos via `GET /api/projects`.
- Estimador tecnico con preview admin y save publico.
- `Budget Builder` admin con configuracion activa, preview, save, listado y detalle.

## Stack

- Java 17
- Spring Boot 3.3.5
- Spring Web
- Spring Data JPA
- Spring Validation
- Spring Security
- JWT
- PostgreSQL
- Flyway
- Spring Boot Actuator
- springdoc-openapi

## Estructura

```text
backend/
  src/main/java/com/fernandogferreyra/portfolio/backend/
    config/
    controller/
    controller/admin/
    domain/
    dto/
    exception/
    mapper/
    repository/
    security/
    service/
    service/impl/
    util/
```

No existe ni debe reintroducirse `module/*`.

## Variables de entorno

Base:

- `PORTFOLIO_DB_URL`
- `PORTFOLIO_DB_USERNAME`
- `PORTFOLIO_DB_PASSWORD`
- `PORTFOLIO_JWT_SECRET`
- `PORTFOLIO_ALLOWED_ORIGINS`

Opcionales:

- `PORTFOLIO_JWT_ISSUER`
- `PORTFOLIO_JWT_EXPIRATION`
- `PORTFOLIO_BOOTSTRAP_ADMIN_ENABLED`
- `PORTFOLIO_ADMIN_USERNAME`
- `PORTFOLIO_ADMIN_PASSWORD`

## Desarrollo local

```bash
./mvnw spring-boot:run
```

En VS Code el launch config del backend usa `${workspaceFolder}/.env`. Para evitar defaults inseguros, crea un `.env` local a partir de `.env.example` con tus valores reales antes de correr en perfil `dev`.

Ademas, el perfil `dev` importa opcionalmente `.env` desde la raiz del repo o desde `backend/`, para que Spring Boot Dashboard pueda resolver credenciales locales aun si el launcher no respeta `envFile`.

Swagger UI:

```text
http://localhost:8080/swagger-ui.html
```

Health:

```text
http://localhost:8080/actuator/health
```

## Tests

```bash
./mvnw test
./mvnw package
```

Hoy los tests de integracion usan perfil `test` sobre PostgreSQL y requieren las variables `PORTFOLIO_TEST_DB_*` si no estan resueltas por el entorno.

## Endpoints principales

Publicos:

- `GET /api/health`
- `POST /api/auth/login`
- `GET /api/projects`
- `POST /api/contact`
- `POST /api/events`
- `POST /api/quote`

Admin:

- `GET /api/admin/quotes`
- `GET /api/admin/quotes/{id}`
- `POST /api/admin/quotes/preview`
- `POST /api/admin/budget-builder/preview`
- `POST /api/admin/budget-builder`
- `GET /api/admin/budget-builder`
- `GET /api/admin/budget-builder/{id}`
- `GET /api/admin/budget-builder/configuration/active`

## Estado pendiente

- Persistencia server-side para actividad del sitio.
- Integrar el portfolio publico con `GET /api/projects`.
- Dockerizacion y deploy reproducible.
- Hacer los tests backend autocontenidos.
