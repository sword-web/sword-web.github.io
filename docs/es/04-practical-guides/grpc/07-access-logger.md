---
title: "Access Logger"
description: "Registra una línea por RPC al responder mediante la sección configurable [grpc.logger]."
outline: [2, 3]
---

# Access Logger

Sword puede registrar una línea por RPC una vez enviada la respuesta: ruta, código de status corto, latencia y un request id truncado. Esto es independiente del subscriber global de `[tracing]` y se controla únicamente con la sección `[grpc.logger]`.

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
- `auto` elige el nivel según el código gRPC leído del header `grpc-status` de la respuesta:

| Código                         | Nivel   |
| ------------------------------ | ------- |
| `ok`                           | `INFO`  |
| errores de cliente             | `WARN`  |
| errores de servidor (el resto) | `ERROR` |

## Identificador de solicitud

El logger reutiliza el header `x-request-id` que fija el `RequestIdLayer` integrado, el cual también se aplica a las solicitudes gRPC para correlación. Cuando está presente, solo registra los primeros 8 caracteres; en caso contrario usa un placeholder `-`.
