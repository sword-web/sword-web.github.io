---
title: "Application"
description: "How to build, run, and bootstrap a Sword application: builder, instance, and main function."
outline: [2, 3]
---

# The Sword Application

The central piece of a Sword application is the `Application` struct. It represents your application instance and provides methods to build, configure, and run it.

## Application Construction

Sword uses a builder pattern to create applications. It is implemented in the `ApplicationBuilder` struct, which lets you configure the application before building the `Application` instance.

The flow starts with `Application::builder()` and chains the configuration methods:

```rust
let app = Application::builder()
    .with_module::<SomeModule>()
    .build();
```

Internally, the `builder()` method:

- Initializes the shared application state.
- Loads the configuration from the TOML file.

<ApiSection title="API Reference: Methods and attributes of the 'ApplicationBuilder' struct">

#### Accessing the application configuration

```rust
pub config: Config
```

A public attribute that gives access to the application configuration loaded from the configuration file. For more details, see the [Configuration](./configuration) section.

#### Registering modules

Registers a module that implements the `Module` trait. Modules group related controllers, components, and providers. [Learn more](./modules)

```rust
pub fn with_module<M: Module>(self) -> Self
```

**Parameters**

- `M`: a type that implements the `Module` trait.

---

#### Registering 'Tower Layers'

Registers a Tower `Layer` globally in the application.

```rust
pub fn with_layer<L>(mut self, layer: L) -> Self
```

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

---

#### Building from a custom configuration path

Loads the application configuration from a `.toml` file at a custom path.

```rust
pub fn from_config_path<P: AsRef<Path>>(path: P) -> ApplicationBuilder
```

---

#### Building from a 'Config' instance

Loads the application configuration from a manually created `Config` instance.

```rust
pub fn from_config(config: Config) -> Self
```

---

#### Building the application

Finishes the `ApplicationBuilder` and returns an `Application` instance ready to run.

```rust
pub fn build(mut self) -> Application
```

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

<ApiSection title="API Reference: Methods and attributes of the 'Application' struct">

#### Starting the application

Starts the core of the selected application type and begins listening for requests.

```rust
pub async fn run(&self)
```

If the `graceful-shutdown` option is enabled, the application handles termination signals gracefully, allowing ongoing requests to complete before shutting down.

---

#### Accessing the internal router

Available for Web and Socket.IO applications, it returns a clone of the application's internal router (`axum::Router`).

```rust
pub fn router(&self) -> axum::Router
```

Use it for advanced operations or to inspect the route configuration.

**Example**

```rust
let app = Application::builder()
    .with_module::<SomeModule>()
    .build();

let router: axum::Router = app.router();
```

</ApiSection>

## The 'main' function

In Rust, program execution begins at the `main` function. In asynchronous frameworks, that function must be marked with a special attribute.

Sword provides the `#[sword::main]` macro, which initializes the application's internal `tokio` runtime and runs the `main` function asynchronously:

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

With this approach, you do not need to add `tokio` as a dependency unless you need it for other features.
