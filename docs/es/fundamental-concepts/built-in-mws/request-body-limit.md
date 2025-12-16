# Limite del Cuerpo de la Petición

El middleware de límite del cuerpo de la petición permite restringir el tamaño máximo del cuerpo de las peticiones entrantes. Esto es útil para prevenir ataques de denegación de servicio y para controlar el uso de recursos del servidor.

## Configuración

Para utilizar el middleware debes configurarlo en el fichero de configuración de tu aplicación Sword. Aquí tienes un ejemplo de cómo hacerlo:

```toml
[middlewares.body-limit]
max_size = "5MB"
display = true
```

Si no se proporciona esta configuración, el middleware utilizará los valores predeterminados:

- `max_size`: "10MB"
- `display`: true

## Respuesta

Si se recibe una petición que excede el limite configurado, se retornará la siguiente respuesta:

```json
{
  "code": 413,
  "message": "The request body exceeds the maximum allowed size by the server",
  "success": false,
  "timestamp": "2025-12-16T03:14:01Z"
}
```
