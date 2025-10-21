# ¿Qué es un Middleware?

Un middleware es un componente que se sitúa entre la solicitud entrante y el controlador que maneja esa solicitud. Permite interceptar, modificar o procesar las solicitudes y respuestas HTTP de manera global o específica para ciertas rutas.

## ¿Por qué usar Middlewares?

Los middlewares son útiles para:

- Autenticación y autorización
- Registro y monitoreo de solicitudes
- Validación de solicitudes

##  Tipos de middlewares

Sword provee tres tipos de middlewares:

- Middlewares
- Middlewares con configuración
- Middlewares de Tower

Cada tipo de middleware tiene sus propias características y casos de uso, que se describen en las siguientes secciones.

## Preguntas frecuentes

### ¿Por qué los middlewares deben ser estructuras?

Los middlewares en Sword tienen la capacidad de acceder a dependencias inyectadas a través del contenedor de dependencias. Al ser estructuras, puedes inyectar servicios o componentes necesarios para la lógica del middleware directamente en sus atributos.
