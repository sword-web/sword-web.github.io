---
title: "Configuration"
description: "Common configuration for a Sword application: the Config struct, the [application] section, and custom configuration."
outline: [2, 3]
---

# Configuration

Most applications need configuration values to connect to databases, external services, or define internal behavior. Sword provides a flexible configuration system for this.

Configuration uses the `thisconfig` crate to load TOML files. By default, building the application looks for `config/config.toml`, but you can also set a different path. If the file is missing or contains invalid TOML, the application fails to build.

## The 'Config' struct

Once the configuration is loaded, it is represented by the `Config` struct. This struct gives you typed, checked access to the configuration values.

You can access it through the `config` field of an `ApplicationBuilder` or `Application` instance, or through dependency injection in other components.

<ApiSection title="API Reference: Methods and attributes of the 'Config' struct">

:::details Assuming the following snippet for the examples:

```rust
use sword::prelude::*;
use serde::Deserialize;

#[config(key = "database")]
#[derive(Debug, Clone, Deserialize)]
struct DatabaseConfig {
    database_url: String,
    max_connections: u32,
}

impl Default for DatabaseConfig {
    fn default() -> Self {
        Self {
            database_url: "postgres://user:password@localhost/mydb".to_string(),
            max_connections: 10,
        }
    }
}
```

:::

#### Getting a configuration section

Extracts a configuration struct and returns `Option<T>`.

```rust
pub fn get<T>(&self) -> Option<T>
where
    T: DeserializeOwned + ConfigItem,
```

**Parameters**

- `T`: the configuration struct to extract. It must implement `DeserializeOwned` and `ConfigItem`.

**Example**

```rust
let database = config.get::<DatabaseConfig>();
```

---

#### Getting a configuration section or its default value

Extracts the struct or returns its `Default` if it is not present.

```rust
pub fn get_or_default<T>(&self) -> T
where
    T: DeserializeOwned + ConfigItem + Default,
```

**Parameters**

- `T`: the configuration struct to extract. It must implement `DeserializeOwned`, `ConfigItem`, and `Default`.

**Example**

```rust
let database = config.get_or_default::<DatabaseConfig>();
```

---

#### Getting a configuration section or panicking

Extracts the struct or panics if it is not present.

```rust
pub fn expect<T>(&self) -> T
where
    T: DeserializeOwned + ConfigItem,
```

**Parameters**

- `T`: the configuration struct to extract. It must implement `DeserializeOwned` and `ConfigItem`.

**Example**

```rust
let database = config.expect::<DatabaseConfig>();
```

This is useful when the configuration is required and the application cannot continue without it. It is equivalent to:

```rust
let database = config.get::<DatabaseConfig>().expect("Expected configuration item not found");
```

</ApiSection>

## Application configuration

Sword defines a shared configuration for every application type:

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

Sword lets you define your own configuration on top of the framework's base configuration. This is useful when the application needs domain-specific or integration-specific settings.

Annotate a struct with the `#[config]` macro and set the TOML key where it will be loaded:

:::code-group

```rust [database.rs]
use serde::Deserialize;
use sword::prelude::*;

#[config(key = "database")]
#[derive(Debug, Clone, Deserialize)]
pub struct DatabaseConfig {
    database_url: String,
    max_connections: u32,
}
```

```toml [config.toml]
[database]
database_url = "postgres://user:password@localhost/mydb"
max_connections = 50
```

```toml [Cargo.toml]
[dependencies]
sword = { version = "x.y.z" }
serde = { version = "x.y.z", features = ["derive"] }
```

:::

**Required traits**

To use a struct as custom configuration, it must derive or implement:

- `Debug`
- `Clone`
- `Deserialize`

The macro generates the `ConfigItem` implementation and registers the configuration in the application state.

## Environment variables

Configuration supports direct interpolation of environment variables.

```toml
[database]
database_url = "${DATABASE_URL:postgres://localhost/app}"
max_connections = "${DB_MAX_CONNECTIONS:20}"
```

The syntax is `${VARIABLE_NAME:default_value}`. If you do not set a default and the variable does not exist, loading fails.

## Loading content from files

You can load file content into TOML values with the `file:` prefix:

```toml
[auth]
jwt_secret = "file:secrets/jwt_secret.txt"
```

This is useful for secrets, certificates, and private keys.

## Special units

You can also use human-readable units for sizes and durations. These units keep the parsed value and the original raw value (`raw`) for logging and display.

### Byte representation

`ByteConfig` represents byte sizes:

- `raw`: the original string read from TOML (for example, `"10MB"`).
- `parsed`: the value converted to bytes (`usize`) for internal use.

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

You can also use binary units such as `KiB`, `MiB`, etc. See the available formats in [`byte-unit`](https://docs.rs/byte-unit/latest/).

### Time representation

`TimeConfig` represents durations:

- `raw`: the original string (for example, `"30s"`, `"1h 30m"`).
- `parsed`: a `std::time::Duration` ready for timeouts, intervals, etc.

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

See the available formats in [`duration-str`](https://docs.rs/duration-str/latest/).

## Configuration per application type

You can find configuration examples for each Sword application type in the practical guides:

- [Configuration of a web application](/en/practical-guides/web/configuration)
- [Configuration of a Socket.IO application](/en/practical-guides/socketio/configuration)
- [Configuration of a gRPC application](/en/practical-guides/grpc/configuration)
