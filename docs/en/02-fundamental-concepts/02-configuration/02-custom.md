# Custom Configuration

Sword lets you define your own configuration alongside the framework's base configuration. This is useful when your app needs domain-specific or integration-specific settings.

The configuration system also supports shared capabilities such as environment variable interpolation and loading values from files.

## Using the `#[config]` macro

To create custom configuration, annotate your struct with `#[config]` and set the TOML key where this configuration should be loaded:

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

## Required traits

For a struct to be used as custom configuration, it must derive or implement:

- `Debug`
- `Clone`
- `Deserialize`

The `#[config(key = "...")]` macro automatically generates:

- `ConfigItem` implementation
- `TryFrom<&State>` implementation for dependency injection
- Automatic registration in application state during initialization

## TOML file structure

Custom configuration must exist under the key declared in `#[config(key = "...")]`.

```toml
[application]
host = "0.0.0.0"
port = 8080

[database]
database_url = "postgres://user:password@localhost/mydb"
max_connections = 50
```

## Environment variable interpolation

Configuration loading supports direct interpolation of environment variables.

```toml
[database]
database_url = "${DATABASE_URL:postgres://localhost/app}"
max_connections = "${DB_MAX_CONNECTIONS:20}"
```

Syntax: `${VARIABLE_NAME:default_value}`.

If no default is defined and the variable does not exist, loading fails.

## Loading content from files

`thisconfig` can load file content into TOML values using the `file:` prefix.

```toml
[auth]
jwt_secret = "file:secrets/jwt_secret.txt"
```

This is useful for secrets, certificates, and private keys.

## Special Units

Thanks to `thisconfig`, you can use human-readable units for size and duration settings. The two unit structs are `ByteConfig` for byte sizes and `TimeConfig` for time durations.

These structs do not just keep the parsed value: they also preserve the original raw value (`raw`) for logging and config display.

### `ByteConfig` unit

This struct represents byte sizes in a human-readable format.

```rust
pub struct ByteConfig {
    pub parsed: usize,
    pub raw: String,
}
```

- `raw`: original TOML string (for example, `"10MB"`)
- `parsed`: value converted to bytes (`usize`) for runtime use

##### Valid examples

```toml
max-payload = "100KB"
body-limit = "1MB"
```

You can also use binary units such as `KiB`, `MiB`, and so on.

### `TimeConfig` unit

This struct represents time durations in a human-readable format.

```rust
pub struct TimeConfig {
    pub parsed: Duration,
    pub raw: String,
}
```

- `raw`: original string (for example, `"30s"`, `"1h 30m"`)
- `parsed`: `std::time::Duration` ready to use in timeouts, intervals, etc.

#### Valid examples

```toml
request-timeout = { enabled = true, timeout = "10s", display = true }
ping-timeout = "20s"
ping-interval = "25s"
```

### Formats

- `ByteConfig`: see [byte-unit](https://docs.rs/byte-unit/latest)
- `TimeConfig`: see [duration_str](https://docs.rs/duration_str/latest/)
