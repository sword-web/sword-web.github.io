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

Sword puede registrar automáticamente layers y servicios comunes de Tower solo con configuración vía `toml`. Cada sección es opcional: cuando está presente, su layer se activa sin registro manual.

## Compresión

Habilita compresión de respuestas con la sección `[compression]`:

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

Configura el intercambio de recursos entre orígenes con la sección `[cors]`:

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

Sirve un directorio de archivos estáticos con la sección `[serve-dir]`:

```toml
[serve-dir]
static-dir = "public"
router-path = "/static"
```

| Clave         | Descripción                         | Por defecto |
| ------------- | ----------------------------------- | ----------- |
| `static-dir`  | Directorio a servir                 | `"public"`  |
| `router-path` | Prefijo de ruta URL                 | `"/static"` |
| `compression` | Soporte de archivos pre-comprimidos | `true`      |
| `chunk-size`  | Tamaño de chunk en bytes            | `65536`     |
| `not-found`   | Ruta 404 personalizada              | —           |

## Cómo se registran

Cuando Sword carga la configuración, verifica estas secciones y registra automáticamente los layers o servicios de Tower correspondientes en el orden correcto antes de iniciar la aplicación, sin configuración manual adicional.
