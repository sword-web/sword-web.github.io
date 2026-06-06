---
title: "Modules"
description: "Organizing Sword applications using Module, controllers, components, and providers."
outline: [2, 3]

prev:
    text: Custom Configuration
    link: /en/fundamental-concepts/configuration/custom
next:
    text: Controllers
    link: /en/application-components/controllers
---

# Modules in Sword

In Sword, a module groups related pieces of the same application capability, such as controllers, components, and providers.

## What problem do they solve?

As an application grows, registering everything directly in `main.rs` becomes unmaintainable. Modules allow you to:

- Group related functionality.
- Encapsulate dependency registration.
- Separate concerns by domain.
- Maintain a stable architecture as the app scales.

## The `Module` Trait

The base contract is:

```rust
pub trait Module {
    fn register_controllers(controllers: &ControllerRegistry) {}
    fn register_components(components: &ComponentRegistry) {}
    async fn register_providers(config: &Config, providers: &ProviderRegistry) {}
}
```

All methods have an empty default implementation.

## What each method registers

::: details `register_controllers(...)`

Registers external entry points: HTTP, Socket.IO, and other controller types supported by the framework.

```rust
fn register_controllers(controllers: &ControllerRegistry) {
    controllers.register::<UsersController>();
}
```

:::

::: details `register_components(...)`

Registers `#[injectable]` structs that should be constructed from the dependency container.

```rust
fn register_components(components: &ComponentRegistry) {
    components.register::<UserRepository>();
    components.register::<UsersService>();
}
```

:::

::: details `register_providers(...)`

Registers `#[injectable(provider)]` structs, typically external connections or clients: databases, caches, or remote services.

This method is `async`.

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

:::

## Module Example

```rust
use sword::prelude::*;

pub struct UsersModule;

impl Module for UsersModule {
    fn register_components(components: &ComponentRegistry) {
        components.register::<UserRepository>();
        components.register::<UsersService>();
    }

    fn register_controllers(controllers: &ControllerRegistry) {
        controllers.register::<UsersController>();
    }
}
```

## Application Registration

Modules are registered using `with_module::<M>()` in the `ApplicationBuilder`.

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

## `with_module` Behavior

Each call to `with_module::<M>()` executes the module registration in this order:

1. `register_providers(...)`
2. `register_components(...)`
3. `register_controllers(...)`

This order describes the module's internal registration, not the final dependency resolution.

The actual construction of components and container resolution happen later, during `build()`, when Sword executes the global container construction process with all registered modules.

## Separation of Concerns

::: code-group

```text [Controller]
Exposes an external interface.
Examples: HTTP endpoint, Socket.IO namespace.
```

```text [Component]
Internal logic auto-constructed by DI.
Examples: domain service, repository, hasher.
```

```text [Provider]
External resource or async initialization.
Examples: database, Redis client, external SDK.
```

:::

## Standard Structure

A common structure is:

```text
users/
  controller.rs
  service.rs
  repository.rs
  mod.rs
```

And in `mod.rs`:

```rust
pub struct UsersModule;

impl Module for UsersModule {
    // register users domain
}
```

## See Also

- [Controllers](/en/application-components/controllers/)
- [Providers](/en/application-components/di/providers)
- [Components](/en/application-components/di/components)
- [Injecting Dependencies](/en/application-components/di/injecting)
