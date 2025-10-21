---
title: Custom Configuration - Sword Framework
description: Create custom configurations in Sword using the #[config] macro. Learn to manage application-specific settings and database configurations.
keywords: ["custom configuration", "config macro", "sword configuration", "toml settings", "application settings"]
---

# Custom Configuration

Sword allows you to create your own custom configurations beyond the default application configuration. This is useful when your application needs additional parameters specific to your business logic.

## Using the `#[config]` Macro

To create a custom configuration, mark your struct with the `#[config]` macro and specify the TOML key where this configuration will be found:

```rust
use serde::Deserialize;
use sword::prelude::*;

#[derive(Debug, Clone, Deserialize)]
#[config(key = "my-custom-section")]
pub struct MyConfig {
    database_url: String,
    max_connections: u32,
    debug_mode: bool,
}
```

### Required Traits

For a struct to be used as custom configuration, it must derive (or implement) the following traits:

- **`Debug`**: Required if you want to print or log the configuration for debugging purposes.
- **`Clone`**: The configuration is cloned into the application state.
- **`Deserialize`**: From `serde`. Allows deserializing the struct from TOML.

The `#[config(key = "...")]` macro automatically generates:

- Implementation of the `ConfigItem` trait
- Implementation of `TryFrom<&State>` for dependency injection
- Automatic registration in the application state during initialization

## Configuration Structure in the TOML File

Custom configuration must be placed in the `config/config.toml` file under the specified key:

```toml
[application]
host = "0.0.0.0"
port = 8080
# ... other application configuration ...

[my-custom-section]
database_url = "postgres://user:password@localhost/mydb"
max_connections = 50
debug_mode = true
```

## Accessing Configuration Values

Once you've defined your custom configuration, Sword automatically registers it in the application state. You can access it in several ways:

```rust
use sword::prelude::*;

#[sword::main]
async fn main() {
    let app = Application::builder();
    let my_app_conf = app.config::<ApplicationConfig>().expect("Failed to get app config");

    dbg!(my_app_conf);

    let app = app
        .with_controller::<AppController>()
        .build();

    app.run().await;
}
```

Additionally, you can extract configuration from other parts of your application, such as controllers or services, using dependency injection. See the [Dependency Injection](../dependency-injection.md) section for more details.
