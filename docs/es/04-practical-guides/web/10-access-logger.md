---
title: "Access Logger"
description: "Registra una línea por solicitud al responder mediante la sección configurable [web.logger]."
outline: [2, 3]
---

# Access Logger

Sword puede registrar una línea por solicitud una vez enviada la respuesta. La línea incluye el método, la URI, el status, la latencia y el request id. Esto es independiente del subscriber global de `[tracing]` y se controla únicamente con la sección `[web.logger]`.

El logger está desactivado salvo que la sección esté presente.

## Configuración

```toml
[web.logger]
enabled = true
level = "auto"
skip-paths = ["/api/health"]
log-query = false
```

| Key          | Tipo           | Default | Descripción                                                 |
| ------------ | -------------- | ------- | ----------------------------------------------------------- |
| `enabled`    | `bool`         | `true`  | Habilita o deshabilita el logger                            |
| `level`      | `auto \| info` | `auto`  | Política de nivel de log. Ver [Niveles](#niveles)           |
| `skip-paths` | `String[]`     | `[]`    | Rutas a excluir del log (coincidencia exacta o por prefijo) |
| `log-query`  | `bool`         | `false` | Incluye el query string en la uri registrada                |

## Niveles

- `info` registra cada solicitud en `INFO` sin importar el status.
- `auto` elige el nivel según el status de la respuesta.

| Status        | Nivel   |
| ------------- | ------- |
| `2xx` / `3xx` | `INFO`  |
| `4xx`         | `WARN`  |
| `5xx`         | `ERROR` |

## Campos del log

| Campo        | Descripción                                                                   |
| ------------ | ----------------------------------------------------------------------------- |
| `status`     | Código de status HTTP.                                                        |
| `latency`    | Tiempo de procesamiento, formateado desde `Duration` (por ejemplo `1.234ms`). |
| `request_id` | Primeros 8 caracteres de `x-request-id`, o `-` si el header no está presente. |
| mensaje      | `MÉTODO URI`, incluyendo el query string solo cuando `log-query = true`.      |

Las solicitudes que coinciden con `skip-paths` no se miden ni se registran.

## Request ID

El logger reutiliza el header `x-request-id` que fija el `RequestIdLayer` integrado. Cuando está presente, registra solo los primeros 8 caracteres, en caso contrario usa un placeholder `-`.
