# Request Timeout Middleware en Sword

El middleware de Request Timeout en Sword permite establecer un tiempo máximo para que una petición sea procesada por la aplicación. Si la petición no se completa dentro del tiempo especificado, se devuelve una respuesta de error indicando que la solicitud ha excedido el tiempo límite.

Este middleware utiliza el layer de `timeout` proporcionado por `tower-http`.

## Configuración

```toml
[middlewares.request-timeout]
enabled = true
duration = "15s"
display = true
```

Donde:

- `enabled`: Habilita o deshabilita el middleware de timeout.
- `duration`: Especifica la duración máxima permitida para procesar una petición. El valor debe estar en un formato reconocible por el crate [duration_str](https://docs.rs/duration-str/latest/duration_str/).

- `display`: Si está habilitado, se mostrará información en el prompt al inicial la applicación sobre el middleware y su configuración.

## Respuesta

Si se recibe una petición que excede el tiempo configurado, se retornará la siguiente respuesta:

```json
{
  "code": 408,
  "message": "Request Timeout",
  "success": false,
  "timestamp": "2025-12-16T03:18:30Z"
}
```
