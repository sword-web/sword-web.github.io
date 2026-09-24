---
title: "Access Logger"
description: "Log one line per RPC on response with the configurable [grpc.logger] section."
outline: [2, 3]
---

# Access Logger

Sword can log one line per RPC once the response is sent: path, short status code, latency and a truncated request id. This is separate from the global `[tracing]` subscriber and is driven entirely by the `[grpc.logger]` section.

The logger is off unless the section is present.

## Configuration

```toml
[grpc.logger]
enabled = true
level = "auto"
skip-paths = [
  "/grpc.health.v1.Health/Check",
  "/grpc.reflection.v1.ServerReflection/ServerReflectionInfo",
]
```

| Key          | Type           | Default | Description                                               |
| ------------ | -------------- | ------- | --------------------------------------------------------- |
| `enabled`    | `bool`         | `true`  | Enables or disables the logger                            |
| `level`      | `auto \| info` | `auto`  | Log level policy. See [Levels](#levels)                   |
| `skip-paths` | `String[]`     | `[]`    | RPC paths to exclude from logging (exact or prefix match) |

## Levels

- `info` logs every RPC at `INFO` regardless of the status code.
- `auto` picks the level from the gRPC status code read from the `grpc-status` response header:

| Code                                                                                                                                                                     | Level   |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------- |
| `ok`                                                                                                                                                                     | `INFO`  |
| client errors (`invalid_argument`, `not_found`, `already_exists`, `permission_denied`, `failed_precondition`, `out_of_range`, `unauthenticated`, `aborted`, `cancelled`) | `WARN`  |
| server errors (the rest)                                                                                                                                                 | `ERROR` |

## Request ID

The logger reuses the `x-request-id` header set by the built-in `RequestIdLayer`, which is also applied to gRPC requests for correlation. When present, the logger logs only the first 8 characters; otherwise it uses a `-` placeholder.
