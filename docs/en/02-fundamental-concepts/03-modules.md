---
title: "Modules"
description: "Organizing Sword applications using modules."
outline: [2, 3]
---

# Modules

A module is the unit that groups one capability of the application. In Sword, a module is a struct that implements the `Module` trait and declares which controllers, components, and providers it provides. It follows the module composition and cohesion model from NestJS, with a simpler and more flexible approach.

Each module declares only what it contributes, and the application is built by composing those pieces.

<ApiSection title="API Reference: Methods of the 'Module' trait" :collapsed="false">

The `Module` trait defines three methods, all with an empty default implementation, so each module implements only the ones it needs.

#### Registering controllers

Registers the controllers defined in the application, whether Web, Socket.IO, gRPC, Events, or Jobs. [Learn more](./controllers.md)

```rust
fn register_controllers(controllers: &ControllerRegistry) {}
```

**Parameters**

- `controllers`: a reference to the application's shared controller registry.

**Example**

```rust
fn register_controllers(controllers: &ControllerRegistry) {
    controllers.register::<UsersController>();
}
```

---

#### Registering components

Registers injectable structs that the dependency container builds automatically. [Learn more](./dependency-injection.md)

```rust
fn register_components(components: &ComponentRegistry)
```

**Parameters**

- `components`: the registry where the module's components are declared.

**Example**

```rust
fn register_components(components: &ComponentRegistry) {
    components.register::<UserRepository>();
    components.register::<UsersService>();
}
```

---

#### Registering providers

Registers injectable structs that are built manually, called 'providers'. They are usually external connections or clients such as databases, caches, or remote services. [Learn more](./dependency-injection.md)

```rust
async fn register_providers(config: &Config, providers: &ProviderRegistry)
```

**Parameters**

- `config`: the loaded configuration, used to get the provider's settings.
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

::: details View the full example of a users module

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

:::

## File structure

A module usually maps to a directory or a group of directories. For example, a users module could have this structure:

```text
users/
  controller.rs
  service.rs
  dtos.rs
  repository.rs
  mod.rs
```

The module declaration and implementation live in `mod.rs`, where each piece is registered.

## Application registration

Modules are registered with the `ApplicationBuilder`'s `with_module` method. For example, to register a users module and a shared module:

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
