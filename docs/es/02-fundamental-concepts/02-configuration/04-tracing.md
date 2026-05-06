---
title: "Configuración de Tracing"
description: "Configuración de logging y tracing en Sword mediante la sección [tracing]."
outline: [2, 3]
---
# Configuración de Tracing

Sword puede configurar un subscriber global de `tracing` para capturar eventos de log en toda la aplicación.

La configuración se carga desde la sección `[tracing]` del archivo TOML.

## Inicialización automática

```rust
use sword::prelude::*;

let app = Application::builder(config)
    .with_module::<UsersModule>()
    .build();
```

## Ejemplo completo

```toml
[tracing]
enabled = true
use-env-filter = true
filter = "info,sword=info,sqlx=warn"

format = "dev"
time-style = "utc"
time-pattern = "%H:%M:%S"

with-fields = []
```

## Campos soportados

| Key              | Tipo                                                                  | Default      | Descripción                                                               |
| ---------------- | --------------------------------------------------------------------- | ------------ | ------------------------------------------------------------------------- |
| `enabled`        | `bool`                                                                | `true`       | Habilita o deshabilita la inicialización global del subscriber            |
| `use-env-filter` | `bool`                                                                | `true`       | Intenta leer directivas desde `RUST_LOG` antes de usar `filter`           |
| `filter`         | `String`                                                              | `"info"`     | Filtro por defecto usado cuando no existe `RUST_LOG` o está deshabilitado |
| `format`         | `full \| pretty \| compact \| dev \| json`                            | `full`       | Formato de salida del subscriber                                          |
| `time-style`     | `system \| uptime \| local \| utc \| none`                            | `system`     | Fuente y estilo del timestamp                                             |
| `time-pattern`   | `String?`                                                             | `None`       | Patrón `strftime` usado por `local` y `utc`                               |
| `with-fields`    | `target[] \| file[] \| line-number[] \| thread-id[] \| thread-name[]` | `["target"]` | Lista de metadata opcional a incluir en cada evento                       |

## Formatos disponibles

### Formato `full`

Usa el formatter estándar de `tracing-subscriber`. Es el formato por defecto y prioriza exponer más metadata.

### Formato `pretty`

Usa el formatter multilínea legible de `tracing-subscriber`.

Es útil en desarrollo cuando quieres ver bloques más claros por evento, pero ocupa más espacio vertical.

### Formato `compact`

Usa una variante más densa en una sola línea, cercana al estilo clásico de `tracing-subscriber`.

### Formato `dev`

Formato propio de Sword orientado a desarrollo en consola.

Ejemplo:

```text
INFO  Initialized tracing subscriber
       format: Dev
       filter: info,sword=info
       use_env_filter: true
```

### Formato `json`

Usa el formatter JSON nativo de `tracing-subscriber` con los fields del evento aplanados al nivel raíz.

Es una buena base para agregación de logs y pipelines simples de observabilidad.

## Configuración del tiempo

El timestamp se controla con `time-style` y `time-pattern`.

## Campos opcionales con `with-fields`

La metadata opcional del log se controla con una sola clave: `with-fields`.

Valores soportados:

- `target`
- `file`
- `line-number`
- `thread-id`
- `thread-name`

Incluye target y ubicación fuente.

### `time-style`

Valores soportados:

- `system`: usa el formatter de tiempo por defecto de `tracing-subscriber`
- `uptime`: imprime tiempo transcurrido desde la inicialización del subscriber
- `local`: imprime fecha/hora local usando un patrón `strftime`
- `utc`: imprime fecha/hora UTC usando un patrón `strftime`
- `none`: no imprime timestamps

### `time-pattern`

`time-pattern` solo aplica a `local` y `utc`.

Sword usa sintaxis `strftime`, igual que `chrono`. Algunos ejemplos útiles:

| Patrón                 | Resultado aproximado   |
| ---------------------- | ---------------------- |
| `"%H:%M:%S"`           | `14:32:11`             |
| `"%Y-%m-%d %H:%M:%S"`  | `2026-04-02 14:32:11`  |
| `"%Y-%m-%dT%H:%M:%S"`  | `2026-04-02T14:32:11`  |
| `"%Y-%m-%dT%H:%M:%SZ"` | `2026-04-02T17:32:11Z` |

Defaults usados por Sword:

- `local`: `"%Y-%m-%d %H:%M:%S"`
- `utc`: `"%Y-%m-%dT%H:%M:%SZ"`

## Env Filter `RUST_LOG` y `filter`

Si `use-env-filter = true`, Sword intenta leer `RUST_LOG`.

Si `RUST_LOG` no existe o no puede interpretarse, se usa `filter`.

Si `use-env-filter = false`, siempre se usa `filter`.
