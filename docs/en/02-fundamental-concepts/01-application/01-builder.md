---
title: "Building an Application"
description: "Sword uses a **Builder** pattern to construct applications."
outline: [2, 3]
---
# Building an Application

Sword uses a **Builder** pattern to construct web applications. This pattern is implemented in the `ApplicationBuilder` struct, which allows configuring various aspects of your application in a fluid way before finally building the `Application` instance.

## Application Construction

The construction flow is straightforward: you call `Application::builder()` to get an `ApplicationBuilder`, configure your application components by chaining methods, and finally call `.build()` to obtain the final `Application` instance:

```rust
let app = Application::builder()
    .with_module::<SomeModule>()
    .build();
```

### How does the Builder pattern work?

**Application::builder()**: Creates a new `ApplicationBuilder` that initializes:

- The application's internal runtime.
- The shared application state.
- Configuration loading from the `.toml` file.

### Key Methods and Attributes

The struct has key fields and methods that allow you to customize your application:

#### `config` Attribute

A public attribute that allows access to the application configuration loaded from the configuration file. For more details on the configuration, check the [Configuration](../configuration/application) section.

<hr/>

#### `with_module::<M>()` Method

A method that registers a module implementing the `Module` trait. Modules define entry points to group related controllers, components, and providers.

##### Parameters

- `M`: A type that implements the `Module` trait.

Learn more about modules in the [Modules](../../application-components/modules) section.

<hr/>

#### `with_layer::<L>(layer: L)` Method

Registers a Tower `Layer` globally in the application.

##### Parameters

- `layer`: An instance that implements the `Layer` trait.

##### Example

```rust
use tower_http::cors::*;

let cors_layer = CorsLayer::new()
    .allow_origin(Any)
    .allow_methods(vec!["GET", "POST"]);

let app = Application::builder()
    .with_layer(cors_layer)
    .build();
```

For more details on Tower, check the [Tower Layers](/en/application-components/interceptors/tower) section.

<hr/>

#### `from_config_path<P: AsRef<Path>>(path: P)` Method

Allows loading the application configuration from a `.toml` file located at a custom path.

<hr/>

#### `from_config(config: Config)` Method

Allows loading the application configuration from a manually created `Config` instance.

<hr/>

#### `build()` Method

Finalizes the `ApplicationBuilder` construction and returns an `Application` instance ready to be executed.
