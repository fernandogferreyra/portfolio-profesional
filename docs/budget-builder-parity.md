# Paridad: Workbench de Presupuesto vs Budget Builder

## Objetivo

Definir el criterio de alineacion segura entre el workbench de presupuesto objetivo y `Budget Builder`, manteniendo backend como fuente de verdad y evitando una migracion 1:1 de logica frontend-only.

## Estado actual

### Referencia historica

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

### Workbench objetivo

- Una sola pantalla.
- Izquierda: configuracion / planilla.
- Derecha: resultado vivo.
- Sin dashboard con cards decorativas.
- Sin wizard largo.
- Negociacion principal apoyada en resumen por areas.

## Superposicion funcional real

- Ambas superficies calculan monto inicial.
- Ambas calculan mensualidad.
- Ambas persisten historial operativo.
- Ambas se usan en modo privado/admin para cotizar.

## Contrato backend ya disponible para el workbench

- `technicalSummary` para resumen tecnico vivo.
- `areaBreakdown` con modulos anidados para negociar por area y expandir detalle.
- `monthlyBreakdown` para `SAAS`.
- `client` para encabezado operativo del presupuesto.
- `modules` se mantiene como detalle tecnico plano.

## Lo que la UX actual aun no refleja del todo

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
- lectura clara del modelo `PROJECT` vs `SAAS` en una sola pantalla

## Decision tecnica

- No migrar el cotizador historico 1:1 como feature separada.
- No volver a dashboard con cards ni wizard largo como direccion principal.
- Consolidar la siguiente etapa frontend sobre `Budget Builder` y su contrato backend oficial.
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

- Implementar `feature/budget-workbench-ui` como workbench de una sola pantalla.
- Usar `technicalSummary`, `areaBreakdown` y `monthlyBreakdown` como base del resumen vivo.
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
- `Budget Builder` ya expone el contrato backend necesario para workbench.
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
- El backend ya expone `technicalSummary`, `areaBreakdown` y `monthlyBreakdown` para sostener el workbench.
- El backend ya persiste `client` para sostener el encabezado operativo.
- La siguiente etapa correcta ya no es seguir profundizando el wizard por pasos, sino reemplazarlo por un workbench de una sola pantalla.

## Proximos pasos

1. Implementar `feature/budget-workbench-ui` sobre el contrato backend ya mergeado.
2. Validar contra casos reales de `ferchuz/`.
3. Retirar el cotizador historico cuando haya paridad real.
