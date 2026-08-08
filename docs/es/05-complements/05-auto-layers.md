---
title: "Layers y Servicios Auto-registrados"
description: "Configura Compression, CORS y servidor de archivos estáticos directamente desde config.toml sin registro manual de layers."
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

Sword puede registrar automáticamente layers y servicios comunes de Tower solo con configuración via `toml`.

## Compresión

Habilita compresión de respuestas mediante la sección `[compression]`:

```toml
[compression]
algorithms = ["gzip", "br"]
```

### Algoritmos Soportados

| Algoritmo | Nota                              |
| --------- | --------------------------------- |
| `gzip`    | Ampliamente soportado             |
| `br`      | Brotli, mejor ratio de compresión |
| `deflate` | Algoritmo legacy                  |
| `zstd`    | Algoritmo rápido y moderno        |

## CORS

Configura el intercambio de recursos entre orígenes:

```toml
[cors]
allow-origins = ["*"]
allow-methods = ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS", "HEAD"]
```

### Opciones Disponibles

- `allow-origins` — lista de orígenes permitidos o `["*"]` para todos
- `allow-methods` — métodos HTTP a permitir
- `allow-headers` — headers personalizados permitidos
- `allow-credentials` — booleano, habilita compartir credenciales
- `max-age` — segundos para cachear respuesta preflight

## Servidor de Archivos Estáticos

Sirve un directorio de archivos estáticos con `[serve-dir]`:

```toml
[serve-dir]
static-dir = "public"
router-path = "/static"
```

### Opciones

| Clave         | Descripción                         | Por Defecto |
| ------------- | ----------------------------------- | ----------- |
| `static-dir`  | Directorio a servir                 | `"public"`  |
| `router-path` | Prefijo de ruta URL                 | `"/static"` |
| `compression` | Soporte de archivos pre-comprimidos | `true`      |
| `chunk-size`  | Tamaño de chunk en bytes            | `65536`     |
| `not-found`   | Ruta 404 personalizada              | —           |

## Cómo Funciona

Cuando Sword carga la configuración, verifica estas secciones y registra automáticamente los layers o servicios de Tower correspondientes en el orden correcto antes de iniciar la aplicación. Sin configuración manual adicional.

## Véase También

- [Configuración de Aplicación](/es/fundamental-concepts/configuration/application)
- [Layers con Tower](/es/application-components/interceptors/tower)
