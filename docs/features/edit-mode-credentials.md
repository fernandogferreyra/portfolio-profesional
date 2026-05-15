# EditMode Credentials

## Problema

La pagina `Formacion y certificaciones` muestra cards estaticas, incluyendo un placeholder de certificaciones futuras. El contenido debe poder administrarse desde la propia pagina publica cuando `EditMode` esta activo, con alta de nuevos elementos, edicion de titulo/institucion/descripcion y documentacion asociada.

## Alcance

- Persistir formaciones y certificaciones en backend como source of truth.
- Exponer lectura publica de credenciales publicadas.
- Exponer API admin para listar, crear y actualizar credenciales.
- Permitir asociar un documento subido a cada credencial.
- Servir la descarga publica solo desde una credencial publicada con documento asociado.
- Reemplazar el placeholder estatico de certificaciones por datos backend.
- Mostrar en Home los titulos reales de formaciones/certificaciones cargadas.
- En `EditMode`, mostrar boton `Nuevo` y controles inline para completar cada elemento.

## No Goals

- No implementar borrado definitivo de credenciales en esta pasada.
- No abrir un endpoint publico generico para documentos.
- No migrar Skills en esta rama.
- No implementar traduccion IA automatica para credenciales todavia.

## Criterios De Aceptacion

- Visitantes ven solo credenciales publicadas.
- Admin con `EditMode` puede crear una credencial nueva desde `/credentials`.
- Admin con `EditMode` puede editar tipo, titulo, institucion, descripcion, orden y visibilidad.
- Admin con `EditMode` puede subir documentacion y queda asociada al elemento.
- La card publica muestra un link a la documentacion solo si existe documento asociado.
- Home muestra los titulos reales cargados en `Formacion y certificaciones`.
- El placeholder `Certificaciones tecnicas / En preparacion` deja de renderizarse como item estatico.
