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

# The `Application` struct

Once you have built an `Application` instance using the builder pattern, you can execute it with the `run()` method:

```rust
#[sword::main]
async fn main() {
    let app = Application::builder()
        .with_module::<SomeModule>()
        .build();

    app.run().await;
}
```

The `run()` method starts the server and begins listening for incoming requests. If you have enabled the `graceful-shutdown` option in your configuration, the application will handle termination signals gracefully, allowing ongoing requests to complete before shutting down.

### Key Methods and Attributes

#### `config` Attribute

A public attribute that allows access to the application configuration loaded from the configuration file.

<hr/>

#### `router()` Method

Returns a clone of the internal application router (`axum::Router`). This is useful if you need to access the router for advanced operations or to inspect the route configuration.

::: info
Only available if you have enabled the `web-controllers` or `socketio-controllers` features in your project.
:::

##### Example

```rust
let app = Application::builder()
    .with_module::<SomeModule>()
    .build();

let router: axum::Router = app.router();
```

<hr/>

#### `run()` Method

Starts the Sword application and its associated controllers.

If you have enabled `graceful-shutdown` in your configuration, the application will handle termination signals gracefully, allowing active requests to finish before stopping the process.

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

#### Graceful Shutdown

Sword manages graceful shutdowns via the `graceful-shutdown` option in the application configuration.

```toml
[application]
graceful-shutdown = true
```

When this option is enabled, `app.run().await` starts the server with the framework's built-in signal handling.
