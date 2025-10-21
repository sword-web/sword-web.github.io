---
title: Application Structure - Sword Framework
description: Learn about Sword's Application and ApplicationBuilder structures. Master the Builder pattern for configuring web applications in Rust.
keywords: ["application structure", "builder pattern", "sword framework", "rust web app", "application configuration"]
---

# The Application and ApplicationBuilder Structures

Sword uses the **Builder** pattern to construct web applications. This pattern is implemented through two main structs:

- **`ApplicationBuilder`**: A structure that provides a fluent interface for configuring your application. It stores configuration, middleware, controllers, and other components incrementally.
- **`Application`**: The final structure that represents your built web application and is ready to run.

## Building the Application

The build flow is straightforward: you call `Application::builder()` to get an `ApplicationBuilder`, configure your application's components by chaining methods, and finally call `.build()` to get the final `Application` instance:

```rust
let app = Application::builder()
    .with_controller::<SomeController>()
    .build();
```

### How Does the Builder Pattern Work?

1. **`Application::builder()`**: Creates a new `ApplicationBuilder` that initializes:

   - The internal router (empty at first)
   - The application's shared state
   - Configuration loaded from `config/config.toml`

2. **Configuration methods** (`.with_controller()`, `.with_layer()`, etc.): Each method returns `self`, allowing you to chain calls and configure your application fluently.

3. **`.build()`**: Finalizes the construction, applies automatic middleware, and returns an `Application` instance ready to run.

### Builder Constructor Methods

These are the methods available on `ApplicationBuilder` to configure your application before building it.

#### `with_controller`

Registers a controller that implements the `Controller` trait. Controllers define routes and handle HTTP requests.

##### Parameters

- `C`: A struct that implements the `Controller` trait.

##### Example

```rust
use sword::prelude::*;

#[controller("/api")]
struct SomeController;

#[routes]
impl SomeController {
    #[get("/hello")]
    async fn hello(&self) -> HttpResponse {
        HttpResponse::Ok().message("Hello, World!")
    }
}

let app = Application::builder()
    .with_controller::<SomeController>()
    .build();
```

[Learn more about controllers in the [Controllers](../key-concepts/controllers/definition.md) section.]

#### `with_dependency_container`

Registers a dependency container for the application. **IMPORTANT**: This method must be called before registering any controllers.

##### Parameters

- `container`: An instance of `DependencyContainer`.

##### Example

```rust
let container = DependencyContainer::builder()
    .register_component::<SomeInjectable>()
    .build();

let app = Application::builder()
    .with_dependency_container(container)
    .build();
```

#### `with_layer`

Registers a Tower middleware layer globally for the application.

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

#### `with_prefix`

Registers a global URL prefix for all routes in the application.

##### Parameters

- `prefix`: A string representing the prefix to be registered.

##### Example

```rust
let app = Application::builder()
    .with_prefix("/api")
    .with_controller::<SomeController>()
    .build();
```

#### `build`

Finalizes the `ApplicationBuilder` construction and returns an `Application` instance ready to run.

This method:

- Applies all configured middleware (Content-Type validation, body size limits, etc.)
- Enables the cookie layer if configured
- Applies the route prefix if one was set
- Returns a fully constructed `Application` instance

##### Example

```rust
let app = Application::builder()
    .with_controller::<SomeController>()
    .with_prefix("/api")
    .build();
```

## Running the Application

Once you've built an `Application` instance using the builder pattern, you can run it with the `run()` method:

```rust
#[sword::main]
async fn main() {
    let app = Application::builder()
        .with_controller::<SomeController>()
        .build();

    app.run().await;
}
```

The `run()` method starts the web server and begins listening for incoming HTTP requests. If you've enabled the `graceful-shutdown` option in your configuration, the application will handle termination signals gracefully by allowing in-flight requests to complete before shutting down.

### Useful Application Methods

#### `router()`

Returns a clone of the application's internal router. This is useful if you need to access the router for advanced operations or to inspect route configuration.

##### Example

```rust
let app = Application::builder()
    .with_controller::<SomeController>()
    .build();

let router = app.router();
```

#### `run()`

Starts the web server and begins listening for incoming HTTP requests.

If you've enabled the `graceful-shutdown` option in your configuration, the application will handle termination signals gracefully by allowing in-flight requests to complete before shutting down the server.

##### Example

```rust
#[sword::main]
async fn main() {
    let app = Application::builder()
        .with_controller::<SomeController>()
        .build();

    app.run().await;
}
```

#### `run_with_graceful_shutdown()`

This method allows you to run the application with a custom shutdown signal.

For example, you want to listen for a Ctrl+C signal to gracefully shut down your application (allowing time for in-flight requests to complete):

If you want to use the default graceful shutdown signal provided by Sword, enable the `graceful-shutdown` option in your configuration file. (See [Configuration](../key-concepts/configuration/application.md))

If you want to use a custom signal instead, you can do it like this:

First, disable the `graceful_shutdown` option in your configuration file.

```rust
use tokio::signal;
use sword::prelude::*;

#[sword::main]
async fn main() {
    let app = Application::builder()
        .with_controller::<SomeController>()
        .build();

    app.run_with_graceful_shutdown(shutdown_signal()).await;
}

async fn shutdown_signal() {
    let ctrl_c = async {
        signal::ctrl_c()
            .await
            .expect("failed to install Ctrl+C handler");
    };

    #[cfg(unix)]
    let terminate = async {
        signal::unix::signal(signal::unix::SignalKind::terminate())
            .expect("failed to install signal handler")
            .recv()
            .await;
    };

    #[cfg(not(unix))]
    let terminate = std::future::pending::<()>();

    tokio::select! {
        _ = ctrl_c => {},
        _ = terminate => {},
    }
}
```
