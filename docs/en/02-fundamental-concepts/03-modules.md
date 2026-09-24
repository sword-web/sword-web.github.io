---
title: "Modules"
description: "Organizing Sword applications using modules."
outline: [2, 3]
---

# Modules

A module groups one capability of the application: its controllers, components, and providers. Each module implements the `Module` trait and registers those pieces in the dependency container, so the application only needs to declare the modules it uses.

<ApiSection title="Methods of the Module trait" :collapsed="false">

The `Module` trait defines these three methods, all with an empty default implementation, so each module implements only the ones it needs.

#### The `register_controllers(controllers)` Method

```rust
fn register_controllers(controllers: &ControllerRegistry)
```

Registers the module's external entry points: HTTP, Socket.IO, and gRPC controllers, plus any struct that implements `ControllerSpec`.

**Parameters**

- `controllers`: the registry where the module's controllers are declared.

**Example**

```rust
fn register_controllers(controllers: &ControllerRegistry) {
    controllers.register::<UsersController>();
}
```

#### The `register_components(components)` Method

```rust
fn register_components(components: &ComponentRegistry)
```

Registers `#[injectable]` structs that the container builds automatically.

**Parameters**

- `components`: the registry where the module's components are declared.

**Example**

```rust
fn register_components(components: &ComponentRegistry) {
    components.register::<UserRepository>();
    components.register::<UsersService>();
}
```

#### The `register_providers(config, providers)` Method

```rust
async fn register_providers(config: &Config, providers: &ProviderRegistry)
```

Registers `#[injectable(provider)]` structs, usually external connections or clients such as databases, caches, or remote services.

**Parameters**

- `config`: the loaded configuration, to read the provider's values.
- `providers`: the registry where the module's providers are declared.

**Example**

```rust
async fn register_providers(config: &Config, providers: &ProviderRegistry) {
    let db_config = config.expect::<DatabaseConfig>();

    providers.register(
        Database::new(db_config)
            .await
            .expect("Failed to create Database provider"),
    );
}
```

</ApiSection>

## Full example

```rust
use sword::prelude::*;

pub struct UsersModule;

impl Module for UsersModule {
    fn register_controllers(controllers: &ControllerRegistry) {
        controllers.register::<UsersController>();
    }

    fn register_components(components: &ComponentRegistry) {
        components.register::<UserRepository>();
        components.register::<UsersService>();
    }

    async fn register_providers(config: &Config, providers: &ProviderRegistry) {
        let db_config = config.expect::<DatabaseConfig>();

        providers.register(
            Database::new(db_config)
                .await
                .expect("Failed to create Database provider"),
        );
    }
}
```

## File structure

A module usually maps to a directory or a group of them. For example, a users module could have this structure:

```text
users/
  controller.rs
  service.rs
  dtos.rs
  repository.rs
  mod.rs
```

`mod.rs` holds the `impl Module` that registers each piece. For details on each kind of piece, see [Controllers](./controllers) and [Dependency Injection](./dependency-injection).

## Application registration

Modules are registered with `with_module::<M>()` in the `ApplicationBuilder`

```rust
#[sword::main]
async fn main() {
    let app = Application::builder()
        .with_module::<SharedModule>()
        .with_module::<UsersModule>()
        .build();

    app.run().await;
}
```
