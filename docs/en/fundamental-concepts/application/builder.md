# The ApplicationBuilder

Sword uses the **Builder** pattern to construct web applications. This pattern is implemented in the `ApplicationBuilder` struct, which allows you to configure various aspects of your application in a fluent way before finally building the `Application` instance.

## Building the Application

The build flow is straightforward: you call `Application::builder()` to get an `ApplicationBuilder`, configure your application's components by chaining methods, and finally call `.build()` to get the final `Application` instance:

```rust
let app = Application::builder()
    .with_module::<SomeModule>()
    .build();
```

### How Does the Builder Pattern Work?

**Application::builder()**: Creates a new `ApplicationBuilder` that initializes:

- The internal router
- The application's shared state
- Loading configuration from the `.toml` file

### Methods and attributes of the structure

The structure has key fields and methods that allow you to customize your application:

#### `config`

Public attribute that allows access to the application configuration loaded from the configuration file.

<hr/>

#### `with_module::<M>()`

Method that registers a module that implements the `Module` trait. Modules define entry points for grouping related gateways, components and providers.

##### Parameters

- `M`: A type that implements the `Module` trait.

Learn more about modules in the [Modules](../../application-components/modules) section.

<hr/>

#### `with_layer::<L>(layer: L)`

Registers a Tower middleware `Layer` globally for the application. (Applied over the application Router).

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

Learn more about middleware in the [Middleware](../key-concepts/middlewares/tower.md) section.

<hr/>

#### `build()`

Finalizes the `ApplicationBuilder` construction and returns an `Application` instance ready to run.
