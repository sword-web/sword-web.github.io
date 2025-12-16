# Compresión Layer en Sword

El middleware de compresión en Sword utiliza la capa de compresión proporcionada por `tower-http` para comprimir las respuestas HTTP salientes. Esto ayuda a reducir el tamaño de los datos transferidos entre el servidor y el cliente, mejorando así el rendimiento y la velocidad de carga de las aplicaciones web.

## Configuración del middleware

Para utilizar este middleware, debes habilitarlo en el archivo de configuración `.toml` de tu proyecto Sword. A continuación se muestra un ejemplo de cómo configurar el middleware de compresión:

```toml
[middlewares.compression]
enabled = true
algorithms = ["gzip", "deflate", "brotli", "zstd"]
display = true
```

Donde:

- `enabled`: Habilita o deshabilita el middleware de compresión.
- `algorithms`: Especifica los algoritmos de compresión que se utilizarán.
- `display`: Si se establece en `true`, se mostrará información sobre el middleware en el prompt al iniciar la aplicación.
