# Portfolio Backend V2

Backend del portfolio profesional construido como un monolito modular con Spring Boot y Java 17. El frontend Angular permanece intacto y el backend ya cuenta con persistencia real para mensajes de contacto y eventos, además de un catálogo inicial de proyectos cargado por migraciones.

## Stack

- Java 17
- Spring Boot
- Maven
- Spring Web
- Spring Data JPA
- Spring Validation
- Spring Security
- JWT preparado para futura autenticación
- PostgreSQL driver
- Flyway
- Spring Boot Actuator
- springdoc-openapi / Swagger UI
- Lombok

## Cómo correrlo

### PostgreSQL

El backend usa PostgreSQL como base principal. Variables soportadas:

- `PORTFOLIO_DB_URL`
- `PORTFOLIO_DB_USERNAME`
- `PORTFOLIO_DB_PASSWORD`
- `PORTFOLIO_JWT_SECRET`
- `PORTFOLIO_ALLOWED_ORIGINS`

Ejemplo local en Windows:

```bash
set PORTFOLIO_DB_URL=jdbc:postgresql://localhost:5432/portfolio_db
set PORTFOLIO_DB_USERNAME=portfolio
set PORTFOLIO_DB_PASSWORD=portfolio
mvn spring-boot:run
```

También podés ejecutar simplemente:

```bash
mvn spring-boot:run
```

si ya resolviste esas variables por otro medio.

### Maven Wrapper

El backend incluye Maven Wrapper en la raiz de `backend/`, asi que no necesitas una instalacion global de Maven. Solo necesitas Java 17 y `JAVA_HOME` apuntando a ese JDK.

Windows:

```bash
mvnw.cmd spring-boot:run
```

Linux/macOS:

```bash
./mvnw spring-boot:run
```

El backend arranca por defecto en `http://localhost:8080`.

Swagger UI:

```text
http://localhost:8080/swagger-ui/index.html
```

Actuator health:

```text
http://localhost:8080/actuator/health
```

## Perfiles y configuración

- `application.yml`: configuración base con PostgreSQL, JPA en modo `validate` y Flyway habilitado.
- `application-dev.yml`: ajustes de desarrollo y logging.
- `application-test.yml`: H2 en memoria para pruebas automáticas de integración.

## Estructura

```text
backend/
  src/
    main/
      java/com/fernandogferreyra/portfolio/backend/
        config/
        controller/
        domain/
        exception/
        mapper/
        repository/
        security/
        service/
        util/
        module/
          contact/
          projects/
          analytics/
          admin/
          certificates/
          assets/
          quote/
      resources/
        application.yml
        application-dev.yml
        db/migration/
    test/
  pom.xml
  README.md
```

## Endpoints iniciales

- `GET /api/health`
- `POST /api/contact`
- `GET /api/projects`
- `POST /api/events`

Todos devuelven respuestas JSON consistentes. Los endpoints públicos siguen habilitados y la base de seguridad queda lista para sumar autenticación JWT en el futuro panel admin "Ferchuz".

## Persistencia actual

- `contact_messages`: mensajes del formulario persistidos con estado `NEW`, `READ` o `ARCHIVED`.
- `event_logs`: eventos persistidos desde `/api/events` con `type`, `source` y `metadata`.
- `projects`: catálogo inicial persistido y seeded por Flyway, incluyendo `ObraSmart`.

## Próximos pasos sugeridos

- Agregar endpoints admin para listar y actualizar el estado de mensajes de contacto.
- Exponer CRUD real para `projects`, `certificates`, `assets` y `quote`.
- Agregar autenticación real y emisión de JWT para el módulo `admin`.
- Integrar el frontend Angular con este backend vía `environment` o proxy local.
- Añadir tests de integración más completos y pipeline CI específico del backend.
