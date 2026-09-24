---
title: "Configuración"
description: "Configuración de una aplicación gRPC en Sword: la sección [grpc] y sus ajustes adicionales."
outline: [2, 3]
---

# Configuración

Además de la configuración común (ver [Configuración](/es/fundamental-concepts/configuration)), una aplicación gRPC se ajusta con la sección `[grpc]`.

## Sección `[grpc]`

| Key                       | Tipo                          | Default     | Descripción                                                                |
| ------------------------- | ----------------------------- | ----------- | -------------------------------------------------------------------------- |
| `host`                    | `String`                      | `"0.0.0.0"` | Host o IP de bind del servidor gRPC                                        |
| `port`                    | `u16`                         | `50051`     | Puerto del servidor gRPC                                                   |
| `enable-tonic-reflection` | `bool`                        | `false`     | Habilita el servicio de reflection de tonic                                |
| `body-limit`              | `Option<GrpcBodyLimitConfig>` | `10MB`      | Configuración de límite de tamaño para mensajes gRPC entrantes y salientes |

::: details Ejemplo en formato TOML

```toml
[grpc]
host = "0.0.0.0"
port = 50051
enable-tonic-reflection = true
body-limit = { max-decoding-message-size = "4MB", max-encoding-message-size = "4MB" }
```

:::

## Ajustes adicionales

- **Logger de acceso** (`[grpc.logger]`): ver [Access Logger](/es/practical-guides/grpc/access-logger).
- **Reflection** (`enable-tonic-reflection`): ver [Inspección con grpcurl](/es/practical-guides/grpc/service-inspection-grpcurl).
