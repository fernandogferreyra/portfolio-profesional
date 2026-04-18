# Continuity Roadmap

## Objetivo

Registrar el contexto maestro de continuidad del proyecto para poder retomarlo por etapas chicas sin reexplicar el estado, las prioridades ni el flujo de trabajo.

## Estado actual consolidado

- Repo oficial: `portfolio-profesional`
- Rama base de integracion diaria: `develop`
- Frontend Angular 20 en `frontend/`
- Backend Spring Boot 3.3.5 en `backend/`
- Backend como fuente de verdad del sistema
- CI vigente para frontend + backend

### Ya cerrado

- `Budget Builder` backend workbench-ready
- `Budget Builder` frontend de una sola pantalla
- `technicalSummary`, `areaBreakdown`, `monthlyBreakdown`, `client`
- Sistema completo de themes con identidad por theme
- Exportacion profesional del presupuesto via `@media print`
- Mensajeria admin operativa
- Flujo de trabajo Git/PR/CI estabilizado sobre `develop`

### Direccion de producto

Esto ya no se trata solo como portfolio. La direccion actual es una plataforma personal/profesional con:

- sitio publico
- backoffice privado
- cotizador / estimador
- mensajeria
- CMS interno
- persistencia documental
- base para integraciones futuras con bot / asistente

## Forma de trabajo obligatoria

Cada etapa debe seguir este flujo:

1. Crear rama corta desde `develop`
2. Resolver un objetivo claro y acotado
3. Validar localmente lo relevante
4. Actualizar `DOCUMENTATION.md` y handoff si aplica
5. Crear un commit chico y claro
6. Push
7. PR hacia `develop`
8. Esperar CI
9. Mergear solo con CI en `success`
10. Borrar la rama y volver a `develop` limpio

Reglas:

- no mezclar demasiadas cosas en una sola branch
- no hacer mega commits
- no avanzar a la siguiente etapa sin cerrar la anterior
- si algo queda incompleto o dudoso, dejarlo explicitado

## Epicas principales

### 1. Mensajeria operativa

Objetivo: mejorar experiencia de inbox y detalle sin tocar el core ya cerrado.

Subfeatures:

- inbox mas claro
- detalle visual mas legible
- mejor UX de reply, filtros y lectura

Prioridad: alta

Dependencias: ninguna fuerte

Quick win: si

### 2. CMS / contenido editable del sitio publico

Objetivo: volver editable desde privado todo el contenido publico relevante.

Subfeatures:

- hero editable
- about editable
- proyectos editables
- links editables
- skills editables
- documentos editables
- contenido general editable

Prioridad: muy alta

Dependencias:

- persistencia documental
- estructura admin para CRUDs

Quick win: parcial

### 3. Skills ampliadas

Objetivo: mantener la vista actual y sumar navegacion por categorias.

Subfeatures:

- boton `mostrar todas`
- listado completo
- agrupacion por sectores / categorias

Prioridad: media

Dependencias: baja

Quick win: si

### 4. Persistencia documental

Objetivo: usar documentos como base de administracion real.

Subfeatures:

- subir documentos
- guardar documentos
- editar metadata si aplica
- reutilizar desde otras superficies

Prioridad: muy alta

Dependencias:

- backend de storage / metadata
- admin UI minima

Feature grande: si

### 5. Notas / documentacion / uploads internos

Objetivo: centralizar informacion y trabajo interno dentro del sitio.

Subfeatures:

- notas internas
- documentacion interna
- uploads de apoyo

Prioridad: media-alta

Dependencias:

- persistencia documental

### 6. Paginas amigas privadas

Objetivo: gestion visible desde privado.

Subfeatures:

- CRUD o gestion basica

Prioridad: media

Dependencias: baja

### 7. PWA / service worker

Objetivo: instalable, cache razonable y base offline donde aporte.

Subfeatures:

- instalacion
- cache controlado
- estrategia offline minima

Prioridad: media

Dependencias:

- estabilidad del frontend principal

### 8. Integracion futura de bot / asistente

Referencia externa:

- `C:\Users\ferch\OneDrive\Escritorio\PS\OBRASMART PROD`

Subfeatures futuras:

- integracion documental
- bot interno
- fusion futura con OpenClaw

Prioridad: baja por ahora

Dependencias:

- persistencia documental
- capa de integracion estable

### 9. Docker / deploy

Objetivo: empaquetado estable y despliegue gratis razonable.

Subfeatures:

- dockerizacion
- despliegue tipo Render / Vercel / alternativa

Prioridad: media-alta

Dependencias:

- estabilidad funcional
- claridad de variables/envs

### 10. Video demo

Objetivo: preparar presentacion clara del sistema.

Subfeatures:

- recorrido publico
- recorrido privado
- presupuesto
- mensajeria
- CMS / documentos

Prioridad: posterior a estabilizacion de producto

## Quick wins recomendados

- UX de mensajeria
- skills con `mostrar todas`
- paginas amigas privadas si el alcance es chico

## Features grandes

- CMS editable completo del sitio publico
- persistencia documental
- notas / documentacion / uploads
- docker / deploy
- integracion bot / asistente

## Dependencias clave

- CMS editable depende de persistencia documental
- notas/uploads depende de persistencia documental
- bot/asistente depende de persistencia documental + integracion estable
- deploy conviene despues de estabilizar CMS/documentos y variables de entorno

## Secuencia sugerida de proximas etapas

### Etapa 1

- Objetivo: mejorar visualizacion y UX de `Mensajeria`
- Branch sugerida: `feature/messages-inbox-ux`
- Archivos probables:
  - `frontend/src/app/components/control-center-messages/*`
  - `DOCUMENTATION.md`
  - `docs/handoff-control-center.md`
- Criterio de cierre:
  - inbox mas claro
  - detalle mas legible
  - reply mas usable
- Commit sugerido:
  - `feat: improve messages inbox and detail UX`

### Etapa 2

- Objetivo: preparar base editable para contenido publico
- Branch sugerida: `feature/public-content-admin-foundation`
- Archivos probables:
  - backend `projects` / `portfolio content` / DTOs / admin controllers
  - frontend admin surfaces minimas
- Criterio de cierre:
  - al menos una superficie publica editable desde privado
- Commit sugerido:
  - `feat: add editable public content foundation`

### Etapa 3

- Objetivo: persistencia documental minima
- Branch sugerida: `feature/document-storage-foundation`
- Archivos probables:
  - backend storage / entity / repository / service / controller
  - frontend admin uploader minimo
- Criterio de cierre:
  - subir y listar documentos
- Commit sugerido:
  - `feat: add document storage foundation`

### Etapa 4

- Objetivo: skills completas con categorias y `mostrar todas`
- Branch sugerida: `feature/skills-categories-expand`
- Archivos probables:
  - `frontend/src/app/components/skills/*`
  - modelo/datos si aplica
- Criterio de cierre:
  - vista actual conservada
  - categorias visibles
  - boton funcional
- Commit sugerido:
  - `feat: expand skills with categories and full view`

### Etapa 5

- Objetivo: notas / documentacion / uploads internos
- Branch sugerida: `feature/internal-notes-and-docs`
- Dependencia:
  - etapa 3 cerrada
- Commit sugerido:
  - `feat: add internal notes and documentation workspace`

## Proxima etapa mas inteligente

Recomendacion actual:

- `feature/messages-inbox-ux`

Motivo:

- ya existe base funcional real
- alcance acotado
- mejora visible rapida
- no abre dependencias duras de storage ni CMS completo
- suma valor real al backoffice sin ensanchar demasiado el scope

## Release Please

### Estado actual

- ya existe configuracion monorepo
- workflow sobre `main`
- manifest y changelogs separados por `frontend` y `backend`

### Diagnostico

El repo esta parcialmente listo, pero todavia no conviene activarlo “como parte central del flujo diario” sin reforzar algunas reglas:

1. disciplina de Conventional Commits consistente
2. decision clara sobre cuando `develop` promociona a `main`
3. criterio de versionado por componente
4. validacion de si los changelogs generados realmente representan bien el trabajo por etapas

### Recomendacion

- no cambiar ni quitar `release-please`
- no apoyarse todavia en el como pieza central del flujo diario
- usarlo solo cuando el flujo `develop -> main` ya se use con regularidad para releases estables

### Que falta para usarlo bien

- confirmar estrategia real de releases desde `main`
- documentar versionado esperado para `frontend` y `backend`
- mantener mensajes de commit consistentes (`feat`, `fix`, `docs`, `chore`, etc.)
- revisar que `frontend/CHANGELOG.md` y `backend/CHANGELOG.md` sigan teniendo sentido con el ritmo real del proyecto

### Como encaja con este flujo

- el trabajo diario sigue igual:
  - branch corta -> commit -> push -> PR a `develop` -> CI -> merge
- `release-please` deberia entrar solo cuando `develop` promocione a `main`
- o sea: sirve para release estable, no para integracion diaria

## Documento vivo recomendado

Mantener como documento principal de continuidad:

- `docs/continuity-roadmap.md`

Y acompañarlo con:

- `docs/handoff-control-center.md` para estado operativo corto
- `DOCUMENTATION.md` para historial detallado
