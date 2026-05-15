# EditMode Navbar And Control Panel UX

## Problema

La foundation de `EditMode` ya muestra el boton, pero el estado activo no se entiende visualmente y la navegacion publica/privada todavia se lee como una base tecnica, no como una UX final.

## Alcance

- Mostrar el estado del boton como `EditMode Enabled` o `EditMode Disabled`.
- Agregar `Formacion y certificaciones` como pagina visible entre `Skills` y `Contacto`.
- Renombrar el acceso privado visible a `Panel de control`.
- Mejorar la estabilidad visual del panel privado para que el bloque de navegacion no se deforme al scrollear.
- Dar al cotizador una lectura mas tipo herramienta/formulario con paneles, botones y resultado claro.
- Mejorar el navbar responsive sin cambiar rutas ni contratos backend.

## No Goals

- No implementar todavia acciones reales de edicion contextual.
- No tocar APIs backend.
- No redisenar todas las paginas publicas.
- No incorporar librerias de navbar externas.

## Criterios De Aceptacion

- El admin ve claramente si `EditMode` esta encendido o apagado.
- La ruta `/credentials` queda accesible desde el navbar entre `/skills` y `/contact`.
- El acceso privado visible usa `Panel de control`.
- El panel privado mantiene una navegacion mas compacta y estable en desktop y mobile.
- El cotizador se lee mas como formulario operativo con acciones laterales y resultado tipo tablero.
- Los typechecks frontend siguen pasando o el bloqueo queda documentado.
