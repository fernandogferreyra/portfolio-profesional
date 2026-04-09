# Paridad: Cotizador Historico vs Budget Builder

## Objetivo

Definir el criterio de reemplazo seguro del cotizador comercial historico por `Budget Builder`, manteniendo backend como fuente de verdad y evitando una migracion 1:1 de logica frontend-only.

## Estado actual

### Cotizador historico

- Vive en `frontend/src/app/components/control-center-quote/`.
- Motor local en `frontend/src/app/services/commercial-quote.service.ts`.
- Configuracion fija en `frontend/src/app/data/commercial-quote.data.ts`.
- Historial persistido en `localStorage`.
- Flujo comercial rapido y simple.

### Budget Builder

- Vive en `frontend/src/app/components/control-center-budget-builder/`.
- Motor oficial en backend.
- Configuracion activa servida por `GET /api/admin/budget-builder/configuration/active`.
- Preview y save reales via backend.
- Historial persistido real.

## Superposicion funcional real

- Ambas superficies calculan monto inicial.
- Ambas calculan mensualidad.
- Ambas persisten historial operativo.
- Ambas se usan en modo privado/admin para cotizar.

## Lo que el cotizador historico tiene y Budget Builder aun no cubria por completo

### Presets comerciales rapidos

- `ESSENTIAL_WEB`
- `BUSINESS_SITE`
- `OPERATIONS_TOOL`
- `PRODUCT_PLATFORM`

### Catalogo de stacks comerciales

- `CMS_FAST`
- `ANGULAR_SPRING`
- `ANGULAR_DOTNET`
- `FULL_CUSTOM`

### Extras comerciales

- `SEO_PACK`
- `COPY_TUNING`
- `DEPLOY_ASSIST`
- `TRAINING`
- `PRIORITY_DELIVERY`

### Continuidad comercial

- mantenimiento mensual explicito
- flujo ultrarrapido sin backend

## Decision tecnica

- No migrar el cotizador historico 1:1 como feature separada.
- No retirarlo hasta que exista paridad operativa real.
- Consolidar sus faltantes dentro de `Budget Builder`.
- Mantener backend como unica fuente de verdad.

## Estrategia de consolidacion

### Fase 1

- Exponer en la configuracion activa de `Budget Builder`:
  - surcharge rules disponibles para extras comerciales
  - maintenance plans
- Soportar mantenimiento en el calculo backend oficial.

### Fase 2

- Expandir presets comerciales rapidos en configuracion backend.
- Expandir catalogo de tecnologias/stacks del motor oficial.

### Fase 3

- Agregar una UX rapida comercial dentro de `Budget Builder` usando configuracion backend.
- Comparar contra casos reales de `ferchuz/` y flujo historico.

### Fase 4

- Retirar `control-center-quote` cuando haya:
  - paridad funcional
  - paridad operativa
  - paridad de resultados

## Criterio de retiro seguro

- `Budget Builder` cubre presets necesarios para uso real.
- `Budget Builder` cubre extras comerciales necesarios.
- `Budget Builder` cubre mantenimiento.
- Resultados comparables con Excel y flujo historico.
- No queda logica critica en frontend.
- Todo el flujo queda documentado en el proyecto.

## Primera base ya abierta

- El backend ya expone `surchargeRules` en configuracion activa.
- El backend ya expone `maintenancePlans` en configuracion activa.
- El backend ya soporta `maintenancePlanId` en el calculo oficial.
- Se semillaron los extras comerciales historicos como reglas comerciales desactivadas por defecto.
- El backend ya expone presets comerciales rapidos como `projectTypeDefaults` con `label` y `description` reales para:
  - `essential_web`
  - `business_site`
  - `operations_tool`
  - `product_platform`
- El frontend de `Budget Builder` ya consume esos labels/descriptions desde backend para no hardcodear presets nuevos en UI.
- El backend ya expone stacks comerciales oficiales:
  - `cms_fast`
  - `angular_spring`
  - `angular_dotnet`
  - `full_custom`
- El editor de `Budget Builder` ya funciona en flujo por pasos para evitar scroll largo y permitir armado mas comodo del presupuesto.
- El frontend ya permite elegir extras comerciales opcionales y mantenimiento sin volver a un motor local.

## Proximos pasos

1. Validar contra casos reales de `ferchuz/`.
2. Ajustar UX rapida en `ControlCenterBudgetBuilderComponent` segun uso real.
3. Retirar el cotizador historico cuando haya paridad real.
