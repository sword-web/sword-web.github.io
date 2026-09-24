---
title: "Configuration"
description: "How to configure a Sword application: base sections, per-application-type configuration, custom configuration, and extraction."
outline: [2, 3]
---

# Configuration

Sword uses `thisconfig` to load one or more TOML files. By default, the builder pattern loads `config/config.toml` during initialization. If the file is missing or contains invalid TOML, the application fails to build.

If you need a different path, you can build the application with `Application::from_config(...)` or `Application::from_config_path(...)`.

## `[application]` section

It holds the general application values:

| Key                 | Type             | Default | Description                                                     |
| ------------------- | ---------------- | ------- | --------------------------------------------------------------- |
| `name`              | `Option<String>` | `None`  | Application name                                                |
| `environment`       | `Option<String>` | `None`  | Environment name                                                |
| `graceful-shutdown` | `bool`           | `false` | Enables graceful shutdown when termination signals are received |

::: details TOML example

```toml
[application]
name = "My Sword App"
environment = "development"
graceful-shutdown = true
```

:::

## Per-application-type configuration

As explained in [Application Types](/en/fundamental-concepts/application/application-types), Sword has three application types (Web, Socket.IO, and gRPC). Each one adds its own configuration section.

### `[web]` section

This applies to `web` and `socketio` applications.

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

### `[socketio]` section

In Sword, `socketio` depends on the `web` feature. When you use it, you configure the web runtime first and then add the dedicated Socket.IO section.

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

### `[grpc]` section

This applies to gRPC applications and is unrelated to the web runtime.

| Key                       | Type                          | Default     | Description                                                              |
| ------------------------- | ----------------------------- | ----------- | ------------------------------------------------------------------------ |
| `host`                    | `String`                      | `"0.0.0.0"` | Bind host or IP for the gRPC server                                      |
| `port`                    | `u16`                         | `50051`     | gRPC server port                                                         |
| `enable-tonic-reflection` | `bool`                        | `false`     | Enables tonic reflection service                                         |
| `body-limit`              | `Option<GrpcBodyLimitConfig>` | `10MB`      | Size limit config for incoming/outgoing gRPC messages                    |

::: details TOML example

```toml
[grpc]
host = "0.0.0.0"
port = 50051
enable-tonic-reflection = true
body-limit = { max-decoding-message-size = "4MB", max-encoding-message-size = "4MB" }
```

:::

## Custom configuration

Sword lets you define your own configuration alongside the framework's base configuration. It is useful when your app needs domain-specific or integration-specific settings. The system also supports environment variable interpolation and loading values from files.

### Using the `#[config]` macro

Annotate your struct with `#[config]` and set the TOML key where it should be loaded:

```rust
use serde::Deserialize;
use sword::prelude::*;

#[config(key = "database")]
#[derive(Debug, Clone, Deserialize)]
pub struct DatabaseConfig {
    database_url: String,
    max_connections: u32,
}
```

### Required traits

For a struct to be used as custom configuration, it must derive or implement:

- `Debug`
- `Clone`
- `Deserialize`

The `#[config(key = "...")]` macro automatically generates:

- the `ConfigItem` implementation;
- the `TryFrom<&State>` implementation for dependency injection;
- automatic registration in application state during initialization.

### TOML file structure

Custom configuration must exist under the key declared in `#[config(key = "...")]`.

```toml
[application]
host = "0.0.0.0"
port = 8080

[database]
database_url = "postgres://user:password@localhost/mydb"
max_connections = 50
```

### Environment variable interpolation

Configuration loading supports direct interpolation of environment variables.

```toml
[database]
database_url = "${DATABASE_URL:postgres://localhost/app}"
max_connections = "${DB_MAX_CONNECTIONS:20}"
```

The syntax is `${VARIABLE_NAME:default_value}`. If no default is defined and the variable does not exist, loading fails.

### Loading content from files

`thisconfig` can load file content into TOML values using the `file:` prefix.

```toml
[auth]
jwt_secret = "file:secrets/jwt_secret.txt"
```

This is useful for secrets, certificates, and private keys.

### Special units

Thanks to `thisconfig`, you can use human-readable units for sizes and durations: `ByteConfig` for byte sizes and `TimeConfig` for durations. They do not just keep the parsed value; they also preserve the original raw value (`raw`) for logging and config display.

**`ByteConfig`** represents byte sizes:

```rust
pub struct ByteConfig {
    pub parsed: usize,
    pub raw: String,
}
```

- `raw`: original TOML string (for example, `"10MB"`)
- `parsed`: value converted to bytes (`usize`) for runtime use

```toml
max-payload = "100KB"
body-limit = "1MB"
```

You can also use binary units such as `KiB`, `MiB`, and so on.

**`TimeConfig`** represents durations:

```rust
pub struct TimeConfig {
    pub parsed: Duration,
    pub raw: String,
}
```

- `raw`: original string (for example, `"30s"`, `"1h 30m"`)
- `parsed`: `std::time::Duration` ready to use in timeouts, intervals, etc.

```toml
request-timeout = { enabled = true, timeout = "10s", display = true }
ping-timeout = "20s"
ping-interval = "25s"
```

Formats:

- `ByteConfig`: see the [byte-unit](https://docs.rs/byte-unit/latest) documentation.
- `TimeConfig`: see the [duration_str](https://docs.rs/duration_str/latest/) documentation.

## Extracting configuration

Once defined, Sword automatically registers the configuration in the application state. You can access it from an `ApplicationBuilder` or `Application` instance through the `config` field:

- `get::<T>()`: extracts a configuration struct and returns `Option<T>`.
- `get_or_default::<T>()`: extracts the struct or returns its `Default` if not present. Returns `T`.
- `expect::<T>()`: extracts the struct or triggers a `panic!` if not present. Returns `T`.

`expect::<T>()` is equivalent to `get::<T>().expect("Expected configuration item not found")`, and it is useful when a critical configuration must be present and you do not want to handle its absence.

You can also extract configuration from other parts of your application, such as controllers or components, through dependency injection. See the [Dependency Injection](/en/fundamental-concepts/dependency-injection) section.

## Additional configuration per application type

The sections above cover the base configuration. Each application type adds its own settings, documented in its practical guides:

- **Web:** access logger (`[web.logger]`) in [Access Logger](/en/practical-guides/web/access-logger), and `[web.openapi]` in [OpenAPI & Swagger UI](/en/practical-guides/web/openapi).
- **gRPC:** access logger (`[grpc.logger]`) in [Access Logger](/en/practical-guides/grpc/access-logger), and `[grpc]` reflection in [Service Inspection with grpcurl](/en/practical-guides/grpc/service-inspection-grpcurl).
- **Socket.IO:** its options are covered in the `[socketio]` section of this page.
