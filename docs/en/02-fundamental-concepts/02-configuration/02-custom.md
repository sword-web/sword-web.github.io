# Custom Configuration

Sword allows you to define your own configurations in addition to the framework's base settings. This is useful when your application needs domain-specific parameters or integration details.

Furthermore, the configuration system supports general capabilities such as environment variable interpolation and loading content from files.

## Using the `#[config]` Macro

To create a custom configuration, you must mark your struct with the `#[config]` macro and specify the TOML key where that configuration will be loaded:

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

## Required Traits

For a struct to be used as a custom configuration, it must derive or implement the following traits:

- `Debug`
- `Clone`
- `Deserialize`

The `#[config(key = "...")]` macro automatically generates:

- The implementation of `ConfigItem`.
- The implementation of `TryFrom<&State>` for dependency injection.
- Automatic registration in the application state during initialization.

## TOML File Structure

Custom configuration must exist under the key specified in `#[config(key = "...")]`.

```toml
[application]
host = "0.0.0.0"
port = 8080

[database]
database_url = "postgres://user:password@localhost/mydb"
max_connections = 50
```

## Environment Variable Interpolation

Configuration loading supports direct interpolation of environment variables.

```toml
[database]
database_url = "${DATABASE_URL:postgres://localhost/app}"
max_connections = "${DB_MAX_CONNECTIONS:20}"
```

The syntax is `${VARIABLE_NAME:default_value}`.

If no default value is specified and the environment variable does not exist, loading will fail.

## Loading Content from Files

`thisconfig` allows loading file content into the TOML using the `file:` prefix.

```toml
[auth]
jwt_secret = "file:secrets/jwt_secret.txt"
```

This is useful for secrets, certificates, or private keys.

## Scope of these Capabilities

Environment variable interpolation and `file:` loading are features of the underlying `thisconfig`-based system, not limited to a specific TOML section.

As such, they can be used in both custom configurations and the framework's base configuration.
