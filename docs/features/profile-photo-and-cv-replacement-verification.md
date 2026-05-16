# Verification Report: Profile Photo And CV Replacement

## Contexto

- Fecha: 2026-05-16
- Rama: `fix/profile-photo-cv-replace`
- PR: pendiente
- Cambio: actualizacion editable de foto de perfil y reemplazo real de CV/documentos CMS.

## Criterios Verificados

- [x] Home expone subida de foto de perfil en `EditMode`.
- [x] Home y Header consumen `site.profile-photo` con fallback al asset estatico.
- [x] `documentUrl` de bloques CMS queda versionado con `v=<documentId>`.
- [x] Reemplazar `contact.cv` o `site.profile-photo` borra el documento anterior si existe.
- [x] La compilacion backend y typechecks frontend pasan.
- [ ] Test integrado `ApiIntegrationTest` ejecutado localmente.

## Comandos Ejecutados

- `npx tsc -p tsconfig.app.json --noEmit`
  - Resultado: OK.
- `npx tsc -p tsconfig.spec.json --noEmit`
  - Resultado: OK.
- `cmd.exe /c "npm test -- --watch=false --browsers=ChromeHeadless --include src/app/components/home/home.component.spec.ts --include src/app/components/header/header.component.spec.ts --include src/app/components/contact/contact.component.spec.ts"`
  - Resultado: OK, `8 SUCCESS`.
- `cmd.exe /c "npm run build:ci"`
  - Resultado: OK con warnings de budget conocidos.
- `cmd.exe /c "set JAVA_HOME=C:\Program Files\Java\jdk-17&& mvnw.cmd -DskipTests clean test-compile"`
  - Resultado: OK, `BUILD SUCCESS`.
- `cmd.exe /c "set JAVA_HOME=C:\Program Files\Java\jdk-17&& mvnw.cmd -Dtest=DocumentFileServiceImplTest test"`
  - Resultado: OK, `3` tests.
- `cmd.exe /c "set JAVA_HOME=C:\Program Files\Java\jdk-17&& mvnw.cmd -Dtest=ApiIntegrationTest#replacingContactCvDeletesPreviousDocumentAndVersionsPublicUrl test"`
  - Resultado: bloqueado por Docker/Testcontainers no disponible.
- `git diff --check`
  - Resultado: OK.

## Tests

- Targeted tests: Home/Header/Contact component specs; `DocumentFileServiceImplTest`.
- Full/required suite: pendiente de CI para backend integrado.
- Tests bloqueados: `ApiIntegrationTest#replacingContactCvDeletesPreviousDocumentAndVersionsPublicUrl` por falta de Docker local.

## Verificacion Manual

- Flujo: pendiente en preview/deploy con sesion admin.
- Resultado: pendiente.
- Evidencia: n/a.

## Estado De Datos

- Precondicion: `contact.cv` podia conservar documentos viejos y URL estable cacheable.
- Cambios realizados: nuevos bloques `site.profile-photo`, URL documental versionada, no-store en descarga CMS y borrado del documento anterior en reemplazos de CV/foto.
- Cleanup/restauracion: en produccion, subir nuevamente el CV definitivo y la foto de perfil para dejar los documentos actuales como fuente vigente.

## Resultado

- PASS WITH GAPS
- Bloqueos: Docker/Testcontainers local no disponible; verificacion visual post-deploy pendiente.
- Seguimiento: correr CI, promover a `main`, desplegar y validar reemplazo de CV/foto desde `EditMode`.
