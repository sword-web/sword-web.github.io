---
title: Application Configuration
description: Structure of the [application] section for web and gRPC runtimes in Sword.
outline: [2, 3]
---

# Application Configuration

Sword uses `thisconfig` to load one or more TOML files.

By default, `ApplicationBuilder` loads `config/config.toml` during initialization. If the file is missing or contains invalid TOML, application build fails.

If you need a different path, you can build the application with:

- `Application::from_config(...)`.
- `Application::from_config_path(...)`.

## `[application]` section

This section contains general application-level values:

| Key                 | Type             | Default | Description                                                       |
| ------------------- | ---------------- | ------- | ----------------------------------------------------------------- |
| `name`              | `Option<String>` | `None`  | Application name                                                  |
| `environment`       | `Option<String>` | `None`  | Environment name                                                  |
| `graceful-shutdown` | `bool`           | `false` | Enables graceful shutdown when termination signals are received   |

::: details TOML example

```toml
[application]
name = "My Sword App"
environment = "development"
graceful-shutdown = true
```

:::

## Runtime-specific configuration

As shown in [Application Types](../01-application/00-application-types.md), Sword supports two runtime types: Web and gRPC. Each one has its own section.

### `[web]` configuration

This applies to web applications and web extensions such as `socketio`.

| Key               | Type                           | Default     | Description                                                             |
| ----------------- | ------------------------------ | ----------- | ----------------------------------------------------------------------- |
| `host`            | `String`                       | `"0.0.0.0"` | Bind host or IP for the web application                                 |
| `port`            | `u16`                          | `8000`      | Web application port                                                    |
| `router-prefix`   | `Option<String>`               | `None`      | Global prefix for web routes                                            |
| `request-timeout` | `Option<RequestTimeoutConfig>` | `None`      | Timeout configuration for web controllers                               |
| `body-limit`      | `Option<BodyLimitConfig>`      | `10MB`      | Body size limit configuration for web request extraction                |

::: details TOML example

```toml
[web]
host = "0.0.0.0"
port = 8000
router-prefix = "/api"
body-limit = "2MB"
request-timeout = { enabled = true, timeout = "30s" }
```

:::

### `[socketio]` configuration

In Sword, `socketio` is a web extension. So when you use it, you configure the web runtime first and then add the dedicated Socket.IO section.

| Key                   | Type                    | Default                    | Description                                   |
| --------------------- | ----------------------- | -------------------------- | --------------------------------------------- |
| `ack-timeout`         | `Option<TimeConfig>`    | `5s`                       | Maximum time for outgoing ACKs                |
| `connect-timeout`     | `Option<TimeConfig>`    | `45s`                      | Time limit to complete initial connection     |
| `max-buffer-size`     | `Option<usize>`         | `128`                      | Max buffered packets per connection           |
| `max-payload`         | `Option<ByteConfig>`    | `100KB`                    | Maximum outgoing payload size                 |
| `ping-interval`       | `Option<TimeConfig>`    | `25s`                      | Server ping interval                          |
| `ping-timeout`        | `Option<TimeConfig>`    | `20s`                      | Pong timeout before disconnect                |
| `req-path`            | `Option<String>`        | `"/socket.io"`             | HTTP path where Socket.IO is mounted          |
| `transports`          | `Option<Vec<String>>`   | `["polling", "websocket"]` | Allowed transports                            |
| `parser`              | `"common" \| "msgpack"` | `"common"`                 | Payload parser                                |
| `ws-read-buffer-size` | `Option<usize>`         | `4096`                     | WebSocket read buffer size                    |

::: details TOML example

```toml
[socketio]
ack-timeout = "5s"
connect-timeout = "45s"
max-buffer-size = 128
max-payload = "100KB"
ping-interval = "25s"
ping-timeout = "20s"
req-path = "/socket.io"
transports = ["polling", "websocket"]
parser = "common"
ws-read-buffer-size = 4096
```

:::

### `[grpc]` configuration

This section applies to gRPC applications and is unrelated to the web runtime.

| Key                       | Type                          | Default     | Description                                                              |
| ------------------------- | ----------------------------- | ----------- | ------------------------------------------------------------------------ |
| `host`                    | `String`                      | `"0.0.0.0"` | Bind host or IP for the gRPC server                                      |
| `port`                    | `u16`                         | `50051`     | gRPC server port                                                         |
| `enable-tonic-reflection` | `bool`                        | `false`     | Enables tonic reflection service                                         |
| `body-limit`              | `Option<GrpcBodyLimitConfig>` | `10MB`      | Size limit config for incoming/outgoing gRPC messages                   |

::: details TOML example

```toml
[grpc]
host = "0.0.0.0"
port = 50051
enable-tonic-reflection = true
body-limit = { max-decoding-message-size = "4MB", max-encoding-message-size = "4MB" }
```

:::
