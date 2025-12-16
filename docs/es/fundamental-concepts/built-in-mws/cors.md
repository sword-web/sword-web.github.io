# Cors Layer en Sword

El middleware CORS (Cross-Origin Resource Sharing) en Sword utiliza la capa CORS proporcionada por `tower-http` para gestionar las políticas de intercambio de recursos entre diferentes orígenes.

## Configuración del middleware

Para utilizar este middleware, debes habilitarlo en el archivo de configuración `.toml` de tu proyecto Sword. A continuación se muestra un ejemplo de cómo configurar el middleware CORS:

```toml
[middlewares.cors]
enabled = true
allow_credentials = true
display = false
allow_headers = ["Content-Type", "Authorization"]
allow_methods = ["GET", "POST", "PUT", "DELETE"]
allow_origins = ["http://localhost:3000", "https://example.com"]
```

Donde:

- `enabled`: Habilita o deshabilita el middleware CORS.
- `allow_credentials`: Indica si se permiten las credenciales (cookies, encabezados de autenticación, etc.) en las solicitudes CORS.

- `allow_headers`: Especifica los encabezados HTTP permitidos en las solicitudes CORS.
- `allow_methods`: Define los métodos HTTP permitidos para las solicitudes CORS.
- `allow_origins`: Lista de orígenes permitidos para realizar solicitudes CORS.
- `display`: Si se establece en `true`, se mostrará información sobre el middleware en el prompt al iniciar la aplicación.
