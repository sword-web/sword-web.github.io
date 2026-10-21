---
title: "Configuration"
description: "Configuring a gRPC application in Sword: the [grpc] section and its additional settings."
outline: [2, 3]
---

# Configuration

Besides the shared configuration, a gRPC application is configured with the `[grpc]` section.

| Key          | Type                  | Default     | Description                                        |
| ------------ | --------------------- | ----------- | -------------------------------------------------- |
| `host`       | `String`              | `"0.0.0.0"` | gRPC server host                                   |
| `port`       | `u16`                 | `50051`     | gRPC server port                                   |
| `body-limit` | `GrpcBodyLimitConfig` | `4MB`       | Size limit for incoming and outgoing gRPC messages |

### TOML example

```toml
[grpc]
host = "0.0.0.0"
port = 50051
body-limit = { max-decoding-message-size = "4MB", max-encoding-message-size = "4MB" }
```

## Additional settings

- **Access logger**: see [Access Logger](/en/practical-guides/grpc/access-logger).
- **Clients**: see [Clients](/en/practical-guides/grpc/clients).
- **Reflection**: exposes the descriptor to introspection clients such as `grpcurl`. See [Reflection](/en/practical-guides/grpc/protocol-buffers#reflection).
