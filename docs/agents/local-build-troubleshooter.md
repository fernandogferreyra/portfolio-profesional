# Local Build Troubleshooter Agent

## Cuándo Usarlo

Usar este agente/protocolo cuando aparezcan errores locales de build, IDE o Maven/Angular que no provienen de la lógica del producto.

Ejemplos:

- `maven-resources-plugin` falla copiando a `backend/target` con `AccessDeniedException`.
- Eclipse/m2e marca error en `process-resources` aunque CI pasa.
- Angular falla localmente por binarios de `node_modules` instalados desde otra plataforma.
- El IDE conserva artefactos generados bloqueados.

## Objetivo

Resolver bloqueos locales sin tocar código funcional ni culpar dependencias incorrectamente.

## Reglas

- Primero clasificar si el error es de entorno, build generado, dependencia real o código.
- No modificar `pom.xml`, `package.json` ni código fuente sin evidencia.
- No borrar archivos versionados.
- Solo limpiar artefactos generados e ignorados por Git (`backend/target`, caches, etc.).
- Registrar el comando ejecutado y el resultado en `DOCUMENTATION.md` si el problema afecta el flujo del proyecto.

## Diagnóstico Maven `AccessDeniedException`

Este error:

```text
maven-resources-plugin:resources ... copying ... backend\target\classes\... failed with AccessDeniedException
```

significa que Maven no pudo sobrescribir un archivo generado en `backend/target`.

Causas probables:

- Eclipse/m2e mantiene el archivo bloqueado.
- Backend Java sigue corriendo y mantiene recursos abiertos.
- Antivirus/Windows Defender inspecciona el archivo justo durante el build.
- El archivo quedo read-only en `target`.
- El directorio `target` quedo en un estado parcial tras una build interrumpida.

No es un problema de dependencia Maven por defecto.

## Fix Estándar

Desde Windows PowerShell:

```powershell
backend\scripts\repair-maven-target.ps1 -Verify
```

Si no hay Java/JAVA_HOME disponible, ejecutar sin verificación:

```powershell
backend\scripts\repair-maven-target.ps1
```

Después, volver a importar/refrescar Maven en el IDE.

## Si Sigue Fallando

1. Cerrar Eclipse/STS/VS Code Java extensions.
2. Detener cualquier backend Java en ejecución.
3. Ejecutar nuevamente `backend\scripts\repair-maven-target.ps1`.
4. Reabrir el IDE.
5. Ejecutar Maven Update/Reload Project.

## Evidencia De Cierre

Un cierre correcto debe registrar:

- `backend/target` limpiado.
- `git status` sin cambios en archivos versionados por la limpieza.
- `mvnw.cmd -DskipTests process-resources` OK, o bloqueo de `JAVA_HOME` documentado.
