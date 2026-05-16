# Profile Photo And CV Replacement

## Contexto

- Fecha: 2026-05-16
- Rama: `fix/profile-photo-cv-replace`
- Tipo: bug | feature
- Fuente: usuario

## Problema

- La foto de perfil publica sigue hardcodeada como asset estatico y no puede actualizarse desde `EditMode`.
- Al subir un CV nuevo, el bloque `contact.cv` puede seguir abriendo el archivo anterior por documento viejo asociado o por cache del navegador sobre una URL publica estable.

## Objetivo

- Permitir actualizar la foto de perfil desde `Inicio` con `EditMode`.
- Hacer que reemplazar el CV sea una operacion de reemplazo real: el documento anterior deja de quedar disponible y la URL publica cambia con el `documentId` nuevo.

## Alcance

- Agregar bloques CMS `site.profile-photo` ES/EN con `documentId` para la foto global usada por Home y Header.
- Subir la foto desde Home `EditMode` usando `POST /api/admin/documents` y asociarla al bloque CMS.
- Borrar automaticamente el documento anterior cuando se reemplaza `contact.cv` o `site.profile-photo`.
- Versionar `documentUrl` de bloques CMS con `documentId` para evitar cache de CV/foto vieja.

## No-goals

- No crear una tabla nueva de perfil publico.
- No abrir endpoint publico generico de documentos.
- No cambiar mensajeria ni flujo de respuesta de email.

## Criterios De Aceptacion

- Dado `EditMode` activo en Inicio, cuando se sube una foto de perfil, entonces Home y Header usan la foto nueva.
- Dado `contact.cv` con un documento anterior, cuando se asocia un CV nuevo, entonces el documento anterior se elimina y se desvincula de otros bloques si lo seguian usando.
- Dado una nueva asociacion documental de CMS, cuando se lee `documentUrl`, entonces incluye un query `v=<documentId>` para romper cache del navegador.
- Dado el frontend publico sin API o sin bloque, entonces conserva el fallback `images/profile-photo.jpg`.

## Riesgos

- Riesgo: si ES/EN compartian el mismo CV anterior, actualizar solo un idioma borra el documento y desvincula el otro.
- Mitigacion: comportamiento alineado al pedido de que el CV nuevo borre el viejo; el otro idioma queda sin documento viejo en vez de abrir contenido desactualizado.

## Validacion Esperada

- Typecheck frontend.
- Test backend focalizado para versionado de URL y borrado del documento previo.
- Test/spec frontend de Home si el cambio queda cubierto sin fragilidad visual.
- `git diff --check`.

## Impacto En Documentacion

- `DOCUMENTATION.md`
- `docs/handoff-control-center.md`
- Reporte de verificacion.
