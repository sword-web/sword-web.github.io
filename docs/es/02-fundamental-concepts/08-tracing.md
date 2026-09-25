---
title: "Configuración de Tracing"
description: "Configura el subscriber global de logging y tracing de Sword mediante la sección [tracing]."
outline: [2, 3]
---

# Configuración de Tracing

Sword puede configurar un subscriber global de `tracing` para capturar trazas en toda la aplicación. Se configura desde la sección `[tracing]` del archivo TOML. Este subscriber se inicializa automáticamente durante la construcción de la aplicación.

## Campos soportados en la configuración

| Key              | Tipo                                                                  | Default      | Descripción                                                               |
| ---------------- | --------------------------------------------------------------------- | ------------ | ------------------------------------------------------------------------- |
| `enabled`        | `bool`                                                                | `true`       | Habilita o deshabilita la inicialización global del subscriber            |
| `use-env-filter` | `bool`                                                                | `true`       | Intenta leer directivas desde `RUST_LOG` antes de usar `filter`           |
| `filter`         | `String`                                                              | `"info"`     | Filtro por defecto usado cuando no existe `RUST_LOG` o está deshabilitado |
| `format`         | `full \| pretty \| compact \| dev \| json`                            | `full`       | Formato de salida del subscriber                                          |
| `time-style`     | `system \| uptime \| local \| utc \| none`                            | `system`     | Fuente y estilo del timestamp                                             |
| `time-pattern`   | `String?`                                                             | `None`       | Patrón `strftime` usado por `local` y `utc`                               |
| `with-fields`    | `target[] \| file[] \| line-number[] \| thread-id[] \| thread-name[]` | `["target"]` | Lista de metadata opcional a incluir en cada evento                       |

## Ejemplo de configuración

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

## Formato de salida

El formato se elige con la clave `format`.

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

El timestamp se controla con dos claves: `time-style` (fuente del tiempo) y `time-pattern` (patrón de formato).

### Estilo de tiempo

Valores que acepta `time-style`:

| Valor    | Descripción                                                |
| -------- | ---------------------------------------------------------- |
| `system` | Formatter de tiempo por defecto de `tracing-subscriber`    |
| `uptime` | Tiempo transcurrido desde la inicialización del subscriber |
| `local`  | Fecha/hora local usando un patrón `strftime`               |
| `utc`    | Fecha/hora UTC usando un patrón `strftime`                 |
| `none`   | No imprime timestamps                                      |

### Patrón de tiempo

`time-pattern` solo se aplica a `local` y `utc`. Sword usa sintaxis `strftime`, igual que `chrono`; algunos ejemplos:

| Patrón                 | Resultado aproximado   |                 |
| ---------------------- | ---------------------- | --------------- |
| `"%H:%M:%S"`           | `14:32:11`             |                 |
| `"%Y-%m-%d %H:%M:%S"`  | `2026-04-02 14:32:11`  | (Default local) |
| `"%Y-%m-%dT%H:%M:%S"`  | `2026-04-02T14:32:11`  |                 |
| `"%Y-%m-%dT%H:%M:%SZ"` | `2026-04-02T17:32:11Z` | (Default utc)   |

## Filtros de eventos

Sword combina dos fuentes de filtrado: `RUST_LOG` (directivas de entorno) y `filter` (filtro del TOML).

Con `use-env-filter = true`, Sword intenta leer `RUST_LOG` y usa `filter` solo cuando no existe o no puede interpretarse. Con `use-env-filter = false`, Sword usa siempre `filter`.
