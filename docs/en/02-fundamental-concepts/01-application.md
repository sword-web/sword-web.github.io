---
title: "Application"
description: "How to build, run, and bootstrap a Sword application: builder, instance, and main function."
outline: [2, 3]
---

# The Sword Application

The central piece of a Sword application is the `Application` struct. It represents your application instance and provides methods to build, configure, and run it.

## Application Construction

Sword uses a builder pattern to create applications. It is implemented in the `ApplicationBuilder` struct, which lets you configure aspects of the application fluently before building the `Application` instance.

The flow consists of calling `Application::builder()` and chaining methods:

```rust
let app = Application::builder()
    .with_module::<SomeModule>()
    .build();
```

Internally, the `builder()` method:

- Initializes the internal runtime of the selected application type.
- Initializes the shared application state.
- Loads the configuration from the `.toml` file.

<ApiSection title="Methods and attributes of the ApplicationBuilder struct">

#### The `config` Attribute

```rust
pub config: Config
```

A public attribute that gives access to the application configuration loaded from the configuration file. For more details, see the [Configuration](./configuration) section.

#### The `with_module::<M>()` Method

```rust
pub fn with_module<M>(self) -> Self
where
    M: Module,
```

Registers a module that implements the `Module` trait. Modules group related controllers, components, and providers.

**Parameters**

- `M`: a type that implements the `Module` trait.

Learn more in the [Modules](./modules) section.

#### The `with_layer::<L>(layer: L)` Method

```rust
pub fn with_layer<L>(mut self, layer: L) -> Self
```

Registers a Tower `Layer` globally in the application.

**Parameters**

- `layer`: an instance that implements the `Layer` trait.

**Example**

```rust
use tower_http::cors::*;

let cors_layer = CorsLayer::new()
    .allow_origin(Any)
    .allow_methods(vec!["GET", "POST"]);

let app = Application::builder()
    .with_layer(cors_layer)
    .build();
```

For more details on Tower, see [Interceptors in Web Controllers](/en/practical-guides/web/interceptors).

#### The `from_config_path::<P>(path: P)` Method

```rust
pub fn from_config_path<P: AsRef<Path>>(path: P) -> ApplicationBuilder
```

Loads the application configuration from a `.toml` file located at a custom path.

#### The `from_config(config: Config)` Method

```rust
pub fn from_config(config: Config) -> Self
```

Loads the application configuration from a manually created `Config` instance.

#### The `build()` Method

```rust
pub fn build(mut self) -> Application
```

Finalizes the `ApplicationBuilder` construction and returns an `Application` instance ready to be executed.

</ApiSection>

## Application Instance

Once you build an `Application` instance with `build()`, you can run it with `run()`:

```rust
#[sword::main]
async fn main() {
    let app = Application::builder()
        .with_module::<SomeModule>()
        .build();

    app.run().await;
}
```

<ApiSection title="Methods and attributes of the Application struct">

#### The `run()` Method

```rust
pub async fn run(&self)
```

Starts the core of the selected application type and begins listening for requests.

If the `graceful-shutdown` option is enabled, the application handles termination signals gracefully, allowing ongoing requests to complete before shutting down.

#### The `router()` Method

```rust
pub fn router(&self) -> axum::Router
```

Returns a clone of the internal application router (`axum::Router`). It is useful for advanced operations or to inspect the route configuration.

It is only available if you enabled the `web` or `socketio` features.

**Example**

```rust
let app = Application::builder()
    .with_module::<SomeModule>()
    .build();

let router: axum::Router = app.router();
```

</ApiSection>

## The `main` function

In Rust, program execution begins at the `main` function. In asynchronous frameworks, that function must be marked with a special attribute.

Sword provides the `#[sword::main]` macro, which initializes the application's internal runtime with `tokio` and runs the `main` function asynchronously:

```rust
use sword::prelude::*;

#[sword::main]
async fn main() {
    let app = Application::builder()
        .with_module::<SomeModule>()
        .build();

    app.run().await;
}
```

Also, with this approach you do not need to add `tokio` as a dependency in your project, unless you explicitly need it for other features.
