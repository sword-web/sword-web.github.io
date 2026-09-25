---
title: "Configuration"
description: "Configuring a gRPC application in Sword: the [grpc] section and its additional settings."
outline: [2, 3]
---

# Configuration

On top of the common configuration (see [Configuration](/en/fundamental-concepts/configuration)), a gRPC application is tuned with the `[grpc]` section.

## `[grpc]` section

| Key          | Type                          | Default     | Description                                        |
| ------------ | ----------------------------- | ----------- | -------------------------------------------------- |
| `host`       | `String`                      | `"0.0.0.0"` | gRPC server host                                   |
| `port`       | `u16`                         | `50051`     | gRPC server port                                   |
| `body-limit` | `Option<GrpcBodyLimitConfig>` | `10MB`      | Size limit for incoming and outgoing gRPC messages |

### TOML example

```toml
[grpc]
host = "0.0.0.0"
port = 50051
body-limit = { max-decoding-message-size = "4MB", max-encoding-message-size = "4MB" }
```

## Additional settings

- **Access logger** (`[grpc.logger]`): see [Access Logger](/en/practical-guides/grpc/access-logger).
- **Reflection** (`enable-tonic-reflection`): see [Service Inspection with grpcurl](/en/practical-guides/grpc/service-inspection-grpcurl).
