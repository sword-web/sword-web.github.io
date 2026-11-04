---
title: "Layers y Servicios Auto-registrados"
description: "Compresión, CORS y servidor de archivos estáticos se configuran desde config.toml sin registro manual de layers."
outline: [2, 3]
keywords:
  [
    "compression",
    "cors",
    "serve-dir",
    "static files",
    "middleware",
    "tower layers",
    "auto-register",
    "sword configuration",
  ]
---

# Layers y Servicios Auto-registrados

Sword puede registrar automáticamente layers y servicios comunes de Tower solo con configuración vía `toml`. Cuando la feature correspondiente está compilada, el layer se registra automáticamente: usa los valores de su sección cuando está presente y los defaults en caso contrario. No se necesita registro manual.

## Compresión

Declara y habilita la feature `compression` de `sword-layers` en `Cargo.toml`:

```toml
[dependencies]
sword-layers = { version = "x.y.z", features = ["compression"] }
```

Luego configura la compresión de respuestas con la sección `[compression]` en el archivo de configuración de Sword:

```toml
[compression]
algorithms = ["gzip", "br"]
```

La clave `algorithms` acepta una lista de estos algoritmos:

| Algoritmo | Nota                              |
| --------- | --------------------------------- |
| `gzip`    | Ampliamente soportado             |
| `br`      | Brotli, mejor ratio de compresión |
| `deflate` | Algoritmo legacy                  |
| `zstd`    | Algoritmo rápido y moderno        |

## CORS

Declara y habilita la feature `cors` de `sword-layers` en `Cargo.toml`:

```tomltoml
[dependencies]
sword-layers = { version = "x.y.z", features = ["cors"] }
```

Configura el intercambio de recursos entre orígenes con la sección `[cors]` en el archivo de configuración de Sword:

```toml
[cors]
allow-origins = ["*"]
allow-methods = ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS", "HEAD"]
```

Las opciones disponibles son:

| Opción              | Descripción                                       |
| ------------------- | ------------------------------------------------- |
| `allow-origins`     | Lista de orígenes permitidos o `["*"]` para todos |
| `allow-methods`     | Métodos HTTP a permitir                           |
| `allow-headers`     | Headers personalizados permitidos                 |
| `allow-credentials` | Habilita compartir credenciales                   |
| `max-age`           | Segundos para cachear la respuesta preflight      |

## Servidor de archivos estáticos

Habilita la feature `servedir` de `sword-layers` en `Cargo.toml`:

```toml
[dependencies]
sword-layers = { version = "x.y.z", features = ["servedir"] }
```

Y configura el servidor de archivos estáticos con la sección `[serve-dir]` en el archivo de configuración de Sword:

```toml
[serve-dir]
static-dir = "public"
router-path = "/static"
```

| Clave                   | Descripción                                                           | Por defecto |
| ----------------------- | --------------------------------------------------------------------- | ----------- |
| `static-dir`            | Directorio a servir                                                   | `"public"`  |
| `router-path`           | Prefijo de ruta URL                                                   | `"/static"` |
| `compression-algorithm` | Soporte de archivos pre-comprimidos (`br`, `gzip`, `deflate`, `zstd`) | —           |
| `chunk-size`            | Tamaño de chunk en streaming (p. ej. `"64KB"`)                        | —           |
| `not-found-file`        | Archivo 404 personalizado                                             | —           |

## Cómo se registran

Cuando Sword carga la configuración, registra automáticamente los layers o servicios de Tower correspondientes en el orden correcto antes de iniciar la aplicación, usando los valores de cada sección cuando está presente y sus defaults en caso contrario. No se requiere configuración manual.
