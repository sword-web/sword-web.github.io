---
title: Application Structure - Sword Framework
description: Learn about Sword's Application and ApplicationBuilder structures. Master the Builder pattern for configuring web applications in Rust.
keywords:
  [
    "application structure",
    "builder pattern",
    "sword framework",
    "rust web app",
    "application configuration",
  ]
---

# The `Application` structure

Once you've built an `Application` instance using the builder pattern, you can run it with the `run()` method:

```rust
#[sword::main]
async fn main() {
    let app = Application::builder()
        .with_module::<SomeModule>()
        .build();

    app.run().await;
}
```

The `run()` method starts the web server and begins listening for incoming HTTP requests. If you've enabled the `graceful-shutdown` option in your configuration, the application will handle termination signals gracefully by allowing in-flight requests to complete before shutting down.

### Methods and attributes of the structure

#### `config`

Public attribute that allows access to the application configuration loaded from the configuration file.

<hr/>

#### `router()`

Returns a copy of the application's internal router. This is useful if you need to access the router for advanced operations or to inspect route configuration.

##### Example

```rust
let app = Application::builder()
    .with_module::<SomeModule>()
    .build();

let router = app.router();
```

<hr/>

#### `run()`

Starts the web server and begins listening for incoming HTTP requests.

If you've enabled the `graceful-shutdown` option in your configuration, the application will handle termination signals gracefully by allowing in-flight requests to complete before shutting down the server.

##### Example

```rust
#[sword::main]
async fn main() {
    let app = Application::builder()
        .with_module::<SomeModule>()
        .build();

    app.run().await;
}
```

<hr/>

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
        .with_module::<SomeModule>()
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
