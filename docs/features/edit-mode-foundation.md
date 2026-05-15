# EditMode Foundation

## Problema

El flujo `Control Center > Actualizar` obliga a buscar formularios internos para editar contenido publico. Para CV, credenciales y skills, la UX correcta es editar el elemento visible en la pagina publica.

## Alcance De Esta Rama

- Agregar estado global `EditMode` visible solo para admin autenticado.
- Mostrar el toggle `EditMode` en el navbar.
- Alinear el ancho global del sitio publico al mismo ancho visual del navbar.
- Quitar `Actualizar` del `Control Center` como superficie principal.
- Documentar la regla de Skills: no se eliminan por defecto; se ocultan o despublican.

## No Goals

- No implementar todavia edicion contextual real de CV, credentials o skills.
- No crear todavia endpoints backend nuevos para skills/credentials.
- No borrar todavia el componente legacy `ControlCenterUpdateComponent` hasta que los flujos publicos lo reemplacen completamente.

## Criterios De Aceptacion

- Un admin autenticado ve `EditMode` en el navbar y puede activarlo/desactivarlo.
- Un visitante o usuario no autenticado no ve controles de `EditMode`.
- Al cerrar sesion, `EditMode` se apaga.
- `Control Center` ya no muestra el modulo `Actualizar`.
- `.app-main` usa el mismo ancho base que el navbar.
- Las futuras skills se ocultaran/despublicaran por defecto en vez de borrarse.

## Siguiente Rama Recomendada

- `feature/edit-mode-contact-cv`: editar/subir/reemplazar CV directamente desde la card publica de Contacto.
