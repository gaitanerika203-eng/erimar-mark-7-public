# Guía pública y portable

## Plantilla neutral de proyecto

```
project/
  README.md
  AGENTS.md
  .env.example
  package.json
  src/
  public/
  tests/
  telemetry/
  deploy/
```

## Checklist de salida

- Proyecto y versión de lenguaje documentados.
- Repositorio y rama seleccionados por la persona, permisos realmente verificados.
- Instalación y tests repetibles, con evidencias.
- Datos de pruebas y credenciales ficticios.
- Modelo de aislamiento por cliente cuando existan múltiples cuentas.
- Hosting elegido por cada usuario y aprobado antes de publicación; sin garantías de gratuidad.
- Logs sin secretos; acceso mínimo; posibilidad de revocar tokens y revertir despliegue.
- URL final y monitorización solo cuando se hayan comprobado mediante herramientas reales.

## Modalidades generales

- **Exportar:** producir código y ZIP; no requiere cuenta de alojamiento.
- **Vista previa estática:** solo HTML/CSS/JS sin prometer persistencia en servidor.
- **Backend persistente:** necesita base de datos o volumen durable y un servicio compatible.
- **Docker:** requiere servidor Docker real, políticas de recursos y aislamiento, respaldo de datos y certificados HTTPS.
- **Generación IA:** optativa y condicionada a presupuesto y cuenta autorizada del usuario.

## Restricciones

No existen cuentas de terceros o conexiones preconfiguradas; no solicitar claves por chat. La versión comercial no incluye referencias privadas del operador ni administra cuentas ajenas.
