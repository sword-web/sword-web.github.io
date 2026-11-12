---
title: "Access Logger"
description: "Registra una línea por RPC al responder mediante la sección configurable [grpc.logger]."
outline: [2, 3]
---

# Access Logger

Sword puede registrar una línea por RPC una vez enviada la respuesta. La línea incluye la ruta, el código de status gRPC, la latencia y el request id. Esto es independiente del subscriber global de `[tracing]` y se controla únicamente con la sección `[grpc.logger]`.

El logger está desactivado salvo que la sección esté presente.

## Configuración

```toml
[grpc.logger]
enabled = true
level = "auto"
skip-paths = [
  "/grpc.health.v1.Health/Check",
  "/grpc.reflection.v1.ServerReflection/ServerReflectionInfo",
]
```

| Key          | Tipo           | Default | Descripción                                                     |
| ------------ | -------------- | ------- | --------------------------------------------------------------- |
| `enabled`    | `bool`         | `true`  | Habilita o deshabilita el logger                                |
| `level`      | `auto \| info` | `auto`  | Política de nivel de log. Ver [Niveles](#niveles)               |
| `skip-paths` | `String[]`     | `[]`    | Rutas RPC a excluir del log (coincidencia exacta o por prefijo) |

## Niveles

- `info` registra cada RPC en `INFO` sin importar el código de status.
- `auto` elige el nivel según el código gRPC leído del header `grpc-status` de la respuesta.

| Código                         | Nivel   |
| ------------------------------ | ------- |
| `Ok`                           | `INFO`  |
| errores de cliente             | `WARN`  |
| errores de servidor (el resto) | `ERROR` |

## Campos del log

| Campo        | Descripción                                                                            |
| ------------ | -------------------------------------------------------------------------------------- |
| `status`     | Código de status gRPC, renderizado desde `Code` (por ejemplo `Ok`, `InvalidArgument`). |
| `latency`    | Tiempo de procesamiento, formateado desde `Duration` (por ejemplo `1.234ms`).          |
| `request_id` | Valor de `x-request-id`, o `-` si el header no está presente.                          |
| `rpc`        | Ruta del RPC, por ejemplo `/users.UserService/GetUser`.                                |

Los RPC que coinciden con `skip-paths` no se miden ni se registran.

## Identificador de solicitud

El logger reutiliza el header `x-request-id` que fija el `RequestIdLayer` integrado, el cual también se aplica a las solicitudes gRPC para correlación. Si el header no está presente, usa un placeholder `-`.
