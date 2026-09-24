---
title: "Modules"
description: "Organizing Sword applications using modules."
outline: [2, 3]
---

# Modules

A module groups one capability of the application: its controllers, components, and providers. Each module implements the `Module` trait and registers those pieces in the dependency container, so the application only needs to declare the modules it uses.

## The `Module` trait

The base contract is:

```rust
pub trait Module {
    fn register_controllers(controllers: &ControllerRegistry) {}
    fn register_components(components: &ComponentRegistry) {}
    async fn register_providers(config: &Config, providers: &ProviderRegistry) {}
}
```

All methods have an empty default implementation, so each module implements only the ones it needs.

<ApiSection title="Methods of the Module trait">

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

Registers `#[injectable(provider)]` structs, usually external connections or clients such as databases, caches, or remote services. It is async because initializing those resources may require async operations.

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

**Notes**

- It runs once, during application construction, not on every request.

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

## Application registration

Modules are registered with `with_module::<M>()` in the `ApplicationBuilder` (see [Application](./application)). The application does not need to know the inside of a module: it only declares it.

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

Modules are independent from each other: they do not reference or register one another. The order in which they are declared determines the order in which their pieces are registered.

## File structure

A module usually maps to a directory:

```text
users/
  controller.rs
  service.rs
  repository.rs
  mod.rs
```

`mod.rs` holds the `impl Module` that registers each piece. For details on each kind of piece, see [Controllers](./controllers) and [Dependency Injection](./dependency-injection).
