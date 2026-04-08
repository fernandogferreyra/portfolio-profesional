# Handoff Control Center

Estado al 2026-04-07.

## 1. Estado actual del proyecto

- Frontend: Angular 20 SPA en la raiz del repo, con Router, Reactive Forms, signals, Karma/Jasmine y proxy de desarrollo para `/api`.
- Backend: Spring Boot 3.3.5 en `backend/`, Java 17, Spring Web, Data JPA, Validation, Security, JWT, Flyway y Swagger.
- Seguridad: login por `POST /api/auth/login`, JWT en frontend, interceptor `Authorization: Bearer`, guard para `/control-center` y rol admin `ROLE_FERCHUZ`.
- CI: GitHub Actions en `.github/workflows/ci.yml` construye Angular en modo production y ejecuta tests backend con Maven sobre PostgreSQL.
- DB: PostgreSQL en local dev y en CI/test. Flyway habilitado. En `dev` usa `baseline-on-migrate: true`.
- Estado general: auth admin, Centro de Mando y primeros modulos privados funcionando. Build y tests OK al cierre de este handoff.

## 2. Que esta implementado hoy

- Login FERCHUZ: boton privado en navbar, modal de login, persistencia de JWT y estado autenticado.
- Centro de Mando: ruta privada `/control-center`, visible solo con sesion admin.
- Cotizador comercial: modulo separado para presupuesto/comercial. Trabaja con alcance, stack, soporte, mantenimiento y extras. Preview, guardado y historial locales en `localStorage`.
- Estimador tecnico: modulo separado para horas, esfuerzo, complejidad, modulos y tiempo aproximado. Preview tecnico y guardado contra backend existente.
- Metricas de Cotizacion: KPIs y distribuciones porcentuales basadas en el historial del cotizador comercial.
- Actividad del Sitio: MVP de tracking local con visitas a secciones, interacciones en proyectos, apertura de contacto y uso de herramientas del Centro de Mando.
- Placeholders restantes: Mensajeria y Presupuestos PDF.

## 3. Decisiones tecnicas importantes

- Proxy Angular: `proxy.conf.json` redirige `/api` a `http://localhost:8080` solo en desarrollo. Los servicios mantienen URLs relativas.
- Bootstrap admin dev/test: `AdminBootstrapInitializer` garantiza usuario `ferchuz`, rol `ROLE_FERCHUZ`, `enabled=true` y rehashea password si hace falta.
- Credenciales: en `dev` la password esperada es `ferchuz-dev-password`. En `test` es `ferchuz-test-password`.
- Flyway + PostgreSQL: el perfil `dev` usa `baseline-on-migrate: true` para evitar el error de schema no vacio sin tabla de historial.
- Cotizador preview/save: el backend actual guarda al hacer `POST /api/quote`, por eso el cotizador comercial hace preview local y persiste solo en frontend.
- Estimador tecnico: quedo enfocado solo en tiempo y esfuerzo. La UI ya no muestra dinero, costo ni tarifa.
- Analytics MVP: `Actividad del Sitio` usa `localStorage`, sin backend ni proveedor externo.
- Theme selector layering: la causa real estaba en `app.component.scss`, donde `app-header` y `main` compartian el mismo stacking level. Se corrigio subiendo el host `app-header` por encima de `main`.

## 4. Problemas detectados y deudas tecnicas

- El preview comercial duplica reglas en frontend y puede derivar del backend si la logica cambia.
- Falta separar en backend un flujo real `preview` vs `save`.
- El historial del cotizador comercial y la actividad del sitio viven en `localStorage`; no hay persistencia compartida ni server-side.
- El estimador tecnico sigue guardando contra un endpoint/backend cuyo modelo interno incluye costo, aunque esa informacion ya no se muestra en la UI.
- La build sigue mostrando warnings de budgets de bundle y estilos, aunque compila y tests pasan.
- Falta una capa de configuracion editable para motores de cotizacion/estimacion.

## 5. Proximos pasos recomendados

- Validar el cotizador comercial contra Excel, videos o reglas reales de negocio antes de seguir expandiendolo.
- Revisar si el cotizador refleja realmente la logica comercial deseada o si debe persistirse en backend.
- Implementar Presupuestos PDF.
- Implementar Mensajeria real.
- Evolucionar `Actividad del Sitio` a una version persistida y mas robusta.
- Externalizar la configuracion del motor comercial y/o tecnico para no tener reglas hardcodeadas.

## 6. Como levantar el proyecto

- Backend dev:
  - Requisito: PostgreSQL local disponible.
  - Comando en PowerShell:
  - `cd backend`
  - `$env:SPRING_PROFILES_ACTIVE='dev'`
  - `.\mvnw.cmd spring-boot:run`
- Frontend:
  - Desde la raiz:
  - `npm start`
- Proxy:
  - En desarrollo, Angular reenvia `/api/*` a `http://localhost:8080` usando `proxy.conf.json`.
- Credenciales dev:
  - Usuario: `ferchuz`
  - Password: `ferchuz-dev-password`
  - Si el backend arranca en perfil `dev`, el bootstrap vuelve a dejar ese usuario consistente.

## 7. Que no romper manana

- No romper el portfolio publico ni redisenar navbar/header.
- No hardcodear URLs backend en servicios frontend; mantener `/api` relativo + proxy dev.
- No cambiar el contrato de rol admin actual: `ROLE_FERCHUZ`.
- No volver a mezclar Cotizador comercial con Estimador tecnico.
- No perder el fix del theme selector: `app-header` debe seguir por encima de `main`.
- No asumir persistencia backend para `Actividad del Sitio` ni para el historial comercial: hoy son locales.
- Antes de cerrar nuevos cambios, volver a correr `npm run build` y `npm test -- --watch=false`.
