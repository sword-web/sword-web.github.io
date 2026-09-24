---
title: "Configuration"
description: "Common configuration of a Sword application: loading, the [application] section, custom configuration, and extraction."
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

Thanks to `thisconfig`, you can use human-readable units for sizes and durations. They do not just keep the parsed value; they also preserve the original raw value (`raw`) for logging and config display.

**`ByteConfig`** represents byte sizes:

- `raw`: original TOML string (for example, `"10MB"`)
- `parsed`: value converted to bytes (`usize`) for runtime use

::: code-group

```rust [Rust]
pub struct ByteConfig {
    pub parsed: usize,
    pub raw: String,
}
```

```toml [TOML]
max-payload = "100KB"
body-limit = "1MB"
```

:::

You can also use binary units such as `KiB`, `MiB`, and so on.

**`TimeConfig`** represents durations:

- `raw`: original string (for example, `"30s"`, `"1h 30m"`)
- `parsed`: `std::time::Duration` ready to use in timeouts, intervals, etc.

::: code-group

```rust [Rust]
pub struct TimeConfig {
    pub parsed: Duration,
    pub raw: String,
}
```

```toml [TOML]
request-timeout = { enabled = true, timeout = "10s", display = true }
ping-timeout = "20s"
ping-interval = "25s"
```

:::

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

## Configuration per application type

The configuration specific to each application type lives in its practical guide:

- [Configuration of a web application](/en/practical-guides/web/configuration)
- [Configuration of a Socket.IO application](/en/practical-guides/socketio/configuration)
- [Configuration of a gRPC application](/en/practical-guides/grpc/configuration)
