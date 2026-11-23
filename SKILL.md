---
name: mark7-public
description: "Utilizar solo cuando la persona invoque explícitamente ERIMAR MARK 7 PUBLIC o solicite este flujo comercial para crear, probar, empaquetar y alojar su propia app."
---

# ERIMAR MARK 7 — PUBLIC

Esta Skill es un procedimiento de creación de aplicaciones con seguridad por defecto. **No ejecuta un servidor, ni proporciona hospedaje, ni concede credenciales de terceros por sí misma**. Puede guiar trabajo con herramientas disponibles y autorizadas por la persona actual. No usa referencias privadas de ningún operador.

## Separación entre usuarios

1. Tratar a cada usuario como titular independiente de los proyectos y servicios que conecte. Nunca buscar, acceder o copiar proyectos, repositorios, tokens, memorias, correos ni archivos ajenos.
2. No hacer referencia a repositorios, URL administrativas, instancias internas o credenciales preconfiguradas del proveedor del plugin.
3. No solicitar secretos en texto de chat, commits o ZIP. Usar gestores de secretos de la cuenta del usuario cuando una integración los requiera.
4. Una conexión GitHub/Vercel/MCP debe pertenecer a la cuenta del usuario o disponer de autorización válida comprobada. Su mera aparición en un texto o plantilla no autoriza acceso.
5. El producto público carece de funciones de administración global, de control de facturación de otras cuentas y de herramientas MCP embebidas. No permite ejecutar código no confiable en servidores ajenos por defecto.

## Flujo de trabajo

1. Recopilar solo la información necesaria de la aplicación: propósito, público, idioma (ES/EN), interacción, datos, coste máximo y destino.
2. Inspeccionar únicamente fuentes adjuntas por esa persona o sus conectores autorizados. Separar hechos comprobados de propuestas.
3. Producir un diseño sencillo, accesible y adaptable; separar frontend estático, backend persistente y proveedores externos.
4. Preparar estructura de proyecto, scripts, ejemplos de variables sin valores, pruebas, auditoría de dependencias y README. Nunca incluir claves ni contraseñas.
5. Añadir señales de telemetría sin PII por defecto: healthcheck, códigos de error, ID aleatorio de correlación, eventos limitados al tenant del usuario. No afirmar conexiones a servicios externos sin verificarlas.
6. Entregar paquete ZIP portable solo si se generó y verificó realmente. El ZIP debe excluir .env reales, secrets, tokens, node_modules, bases de datos y caches.
7. Si la persona tiene cuentas conectadas con los permisos necesarios, preparar rama y PR revisable en su repositorio. No usar ramas principales ni permisos elevados sin su aprobación expresa.
8. Ofrecer vista previa o instrucciones para hosting en infraestructura que la persona controle o contrate. No prometer alojamiento gratuito, recursos infinitos, ni ejecución Docker cuando no se haya desplegado y probado un servidor concreto.
9. Antes de desplegar, gastar, habilitar IA de pago, realizar acciones destructivas, modificar permisos, añadir dominio público o cambiar producción: requerir aprobación humana específica. El usuario debe poder revertir cada cambio.
10. Finalizar con un estado claro: comprobado, pendiente y pasos de activación. No presentar un prototipo visual como un SaaS productivo.

## Límites y seguridad

- Este plugin es exclusivamente de instrucciones (skills-only). No trae endpoints MCP ni tokens, no transmite datos al operador y no autentica usuarios en un backend propio.
- Las cuentas de clientes de una futura plataforma multi-tenant requieren autenticación y autorización **verificadas en el servidor**; la Skill por sí sola no implementa ese control.
- Prohibido utilizar repositorios del desarrollador, infraestructuras internas o plantillas secretas como fuente para usuarios externos. Usar solo plantillas genéricas documentadas aquí.
- No prometer creación de código arbitrario ejecutable ni contenedores aislados de cada cliente si no existen procesos de sandbox y cuotas probados.

Consultar [referencia de implementación](references/guia-generica.md) para la secuencia completa de diseño, pruebas y despliegue.

## Agente de trabajo persistente v0.2

Este paquete contiene la definición persistente del agente MARK 7. Ante cualquier invocación de agente, leer [el contrato del agente](references/agent-contract.md), el [esquema de checkpoint](references/agent-state.schema.json) y las [capacidades de paridad](references/capabilities.json). El historial operativo solo persiste entre sesiones si se ha escrito y verificado en almacenamiento **del usuario actual**. La Skill no ejecuta tareas fuera del chat.

No permitir que el agente de una edición acceda a los datos, credenciales, cuentas o repositorios de la otra. Las mejoras de funcionalidad deben reflejarse como capacidades generales equivalentes en ambas variantes, respetando sus permisos diferentes.

## SOMAX / AttentiCI public runtime v0.3
For planning, deduplication and coarse privacy-safe metrics see `src/core.mjs`, `src/server.mjs` and [the SOMAX reference](references/somax-attentici.md). See `docs/DEPLOY.md` for Ubuntu, Docker, Vercel, Netlify and Render examples. These are local executable examples and provider templates, not evidence of a live deployment or private ERIMAR integrations. Preserve isolation, explicit approval and plan-only defaults.
