# Servidor de archivos estáticos

Sword provee la capacidad de servir fichero estáticos (como imágenes, archivos CSS, JavaScript, etc.) esto a través del `ServeDir` middleware de `tower-http`.

## Configuración

Para utilizar el middleware de servidor de archivos estáticos, debes habilitarlo en la sección de middlewares de tu archivo de configuración `config.toml`.

```toml
[middlewares.serve-dir]
enabled = true
static_dir = "static"
router_path = "/static"
compression_algorithm = "gzip"
chunk_size = "1MB"
```

Donde:

- `enabled`: Habilita o deshabilita el middleware de servidor de archivos estáticos.
- `static_dir`: Especifica el directorio desde el cual se servirán los archivos estáticos.

- `router_path`: Define la ruta en la que los archivos estáticos estarán disponibles.
- `compression_algorithm`: (Opcional) Define el algoritmo de compresión a utilizar (`br`, `gzip`, `deflate`, `zstd`).

- `chunk_size`: controla el tamaño del buffer interno cuando ServeDir lee archivos del sistema de archivos para enviarlos como respuesta HTTP. Esto afecta directamente el trade-off entre:

- `Memoria`: Buffers más grandes usan más RAM
- `Rendimiento`: Buffers más grandes reducen llamadas al sistema de archivos
- `Latencia`: Buffers más pequeños pueden empezar a transmitir más rápido
