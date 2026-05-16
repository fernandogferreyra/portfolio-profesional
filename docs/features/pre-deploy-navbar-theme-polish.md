# Pre Deploy Navbar And Theme Polish

## Contexto

- Fecha: 2026-05-16
- Rama: `feature/edit-mode-skills-catalog`
- Tipo: feature
- Fuente: usuario + captura de referencia

## Problema

El navbar ocupa demasiada altura, los controles privados y selectores no quedan alineados, el selector de themes tiene demasiada descripcion y hay accesos sociales duplicados en header aunque Contacto ya resuelve esos enlaces. Algunos themes necesitan paletas mas definidas antes de preparar PR/deploy.

## Objetivo

Compactar la navegacion y mejorar la identidad visual de themes/contacto sin cambiar contratos backend ni flujos admin.

## Alcance

- Incluye: navbar compacto con avatar, navegacion, estado/admin/theme/idioma/logout alineados.
- Incluye: quitar GitHub/LinkedIn del header y dejar esos accesos en Contacto.
- Incluye: menu de themes mas compacto, `EX` negro/rojo, `CMD` blanco/negro, `WB` renombrado visualmente a `GREY` y nuevo theme azul con rejilla.
- Incluye: rejilla animada global de fondo para todos los themes.
- Incluye: Contacto con tiles grandes de GitHub/LinkedIn/Gmail similares a la referencia.

## No-goals

- No incluye: cambios backend, migraciones ni nuevos endpoints.
- No incluye: merge/deploy automatico sin CI verde y aprobacion del usuario.

## Criterios De Aceptacion

- Dado un viewport desktop, cuando el header renderiza, entonces los controles admin, theme, idioma y salida quedan en una linea compacta.
- Dado el header publico, cuando se navega, entonces GitHub y LinkedIn no aparecen en navbar.
- Dado el selector de theme, cuando se abre, entonces muestra opciones compactas sin parrafos descriptivos largos.
- Dado cualquier theme, cuando se carga el sitio, entonces hay una rejilla de fondo animada acorde a la paleta.
- Dado `EX`, `CMD` y `GREY`, cuando se seleccionan, entonces respetan negro/rojo, blanco/negro y grises comodos respectivamente.
- Dado Contacto, cuando se ven los canales, entonces GitHub/LinkedIn/Gmail se muestran como tiles grandes con fondo de rejilla.

## Riesgos

- Riesgo: el header puede volver a wrappear en anchos medios por muchos controles admin.
- Mitigacion: usar layout flexible compacto y breakpoints especificos.

## Validacion Esperada

- Comando/test: `npx tsc -p tsconfig.app.json --noEmit`
- Comando/test: `npx tsc -p tsconfig.spec.json --noEmit`
- Comando/test: `npm run build:ci`
- Prueba manual: revisar desktop/mobile de header, selector de themes y Contacto.

## Impacto En Documentacion

- `DOCUMENTATION.md`
- `docs/handoff-control-center.md`

## Notas De Implementacion

- Archivos probables: `header`, `contact`, `portfolio.data.ts`, `portfolio.models.ts`, `theme.service.ts`, `styles.scss`, `app.component.scss`.
- Decisiones tecnicas: conservar ids existentes de themes para no romper preferencias guardadas; renombrar `WB` solo a nivel visible como `GREY`.

## Resultado

- Navbar compactado: avatar, navegacion y controles quedan en layout mas bajo; GitHub/LinkedIn salen del header.
- Selector de themes: opciones compactas por nombre/swatch, sin descripcion larga.
- Themes: se suma `GRID`; `EX` pasa a fondo negro con rojo puro; `CMD` queda forzado a blanco/negro; `WB` se muestra como `GREY` con grises suaves.
- Fondo: la rejilla global queda animada y toma color/velocidad/opacidad desde variables del theme.
- Contacto: los canales se muestran como tiles grandes sobre fondo con rejilla, priorizando visualmente GitHub, LinkedIn y Gmail.

## Validacion Ejecutada

- `npx tsc -p tsconfig.app.json --noEmit`: OK.
- `npx tsc -p tsconfig.spec.json --noEmit`: OK.
- `cmd.exe /c "npm run build:ci"`: OK con warnings de budget conocidos.
- `cmd.exe /c "npm test -- --watch=false --browsers=ChromeHeadless"`: OK (`47 SUCCESS`).
- `cmd.exe /c "set JAVA_HOME=C:\Program Files\Java\jdk-17&& mvnw.cmd -DskipTests package"`: OK.
