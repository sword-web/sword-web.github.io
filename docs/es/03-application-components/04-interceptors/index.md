# ¿Qué es un Interceptor?

Un `Interceptor` es un componente que se interpone entre la solicitud/mensaje entrante y el `Controller` que corresponda. Permiten leer, modificar y procesar las solicitudes entrantes.

## ¿Por qué usar Interceptors?

Los interceptors son útiles para:

- Autenticación y autorización
- Registro y monitoreo de solicitudes
- Validación de solicitudes

## Tipos de `Interceptors`

Sword provee tres tipos:

- Tradicionales
- Con configuración asociada
- Layers de Tower

Cada tipo de interceptor tiene sus características propias y casos de uso, que se describen en las siguientes secciones.

Además, por cada tipo existe una variante aplicable al tipo de `Controller` asociado:

- Controladores Web
- Controladores Socket.IO
