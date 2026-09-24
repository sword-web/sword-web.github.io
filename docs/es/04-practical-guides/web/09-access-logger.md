---
title: "Access Logger"
description: "Registra una línea por solicitud al responder mediante la sección configurable [web.logger]."
outline: [2, 3]
---

# Access Logger

Sword puede registrar una línea por solicitud una vez enviada la respuesta: método, uri, status, latencia y un request id truncado. Esto es independiente del subscriber global de `[tracing]` y se controla únicamente con la sección `[web.logger]`.

El logger está desactivado salvo que la sección esté presente.

## Configuración

```toml
[web.logger]
enabled = true
level = "auto"
skip-paths = ["/api/health"]
log-query = false
```

| Key          | Tipo             | Default | Descripción                                                            |
| ------------ | ---------------- | ------- | ---------------------------------------------------------------------- |
| `enabled`    | `bool`           | `true`  | Habilita o deshabilita el logger                                        |
| `level`      | `auto \| info`   | `auto`  | Política de nivel de log. Ver [Niveles](#niveles)                       |
| `skip-paths` | `String[]`       | `[]`    | Rutas a excluir del log (coincidencia exacta o por prefijo)             |
| `log-query`  | `bool`           | `false` | Incluye el query string en la uri registrada                            |

## Niveles

- `info` registra cada solicitud en `INFO` sin importar el status.
- `auto` elige el nivel según el status de la respuesta:

| Status | Nivel |
| ------ | ----- |
| `2xx` / `3xx` | `INFO` |
| `4xx` | `WARN` |
| `5xx` | `ERROR` |

## Request ID

El logger reutiliza el header `x-request-id` que fija el `RequestIdLayer` integrado. Cuando está presente, solo se registran los primeros 8 caracteres; en caso contrario se usa un placeholder `-`.
