---
title: "Interceptors in Socket.IO Controllers"
description: "How to apply interceptors to Socket.IO controllers in Sword: OnConnect, OnConnectWithConfig, and the role of Tower."
outline: [2, 3]
---

# Interceptors in Socket.IO Controllers

Sword lets you apply interceptors to Socket.IO controllers to handle client connections to a `namespace`.

## Traditional interceptors

### The `OnConnect` Trait

This trait allows you to define custom logic that runs before a client connects to a specific `namespace`.

Unlike web controller interceptors, the `OnConnect` interceptor runs only during the initial handshake (the `#[on("connection")]` event). Subsequent events within the `namespace` will not trigger the interceptor.

```rust
use sword::prelude::*;
use sword::socketio::*;

#[derive(Interceptor)]
struct EventLogger;

impl OnConnect for EventLogger {
    type Error = String;

    async fn on_connect(&self, ctx: SocketContext) -> Result<(), Self::Error> {
        println!("[Socket.IO] - New connection - Socket ID: {}", ctx.id());

        Ok(())
    }
}
```

As you may have noticed, it is necessary to define an associated error type. This can have any structure or format you find appropriate, but it must implement the `Display` trait.

Next, you can apply this interceptor to a Socket.IO controller:

```rust
use sword::prelude::*;
use sword::socketio::*;

#[controller(kind = Controller::SocketIo, namespace = "/events")]
#[interceptor(EventLogger)]
struct EventController;

impl EventController {
    #[on("connection")]
    async fn on_connect(&self, ctx: SocketContext) {
        println!("Client connected: {}", ctx.id());
    }

    #[on("event")]
    async fn handle_message_event(&self, ctx: SocketContext) {
        let payload: Event = ctx.try_data().expect("Failed to parse event data");

        println!("Received 'event' from {}: {payload:?}", ctx.id());
    }
}
```

In this example, the interceptor runs before the `#[on("connection")]` event. Any interaction in other events associated with the controller will not pass through the applied interceptor.

## Interceptors with configuration

### The `OnConnectWithConfig` Trait

Like `OnConnect`, this trait lets you define custom logic that runs before a client connects to a specific `namespace`, but it also accepts an extra `T` parameter that gives you an additional level of configuration.

```rust
use sword::prelude::*;
use sword::socketio::*;

#[derive(Interceptor)]
struct EventLogger;

impl OnConnectWithConfig<&str> for EventLogger {
    type Error = String;

    async fn on_connect(
        &self,
        config: &str,
        ctx: SocketContext,
    ) -> Result<(), Self::Error> {
        println!("[Socket.IO] - New connection - Socket ID: {}", ctx.id());
        println!("Using '&str' config with value: {config}");

        Ok(())
    }
}
```

As you may have noticed, it is necessary to define an associated error type. This can have any structure or format you find appropriate, but it must implement the `Display` trait.

Next, you can apply this interceptor to a Socket.IO controller:

```rust
use sword::prelude::*;
use sword::socketio::*;

#[controller(kind = Controller::SocketIo, namespace = "/events")]
#[interceptor(EventLogger, config = "some &str")]
struct EventController;

impl EventController {
    #[on("connection")]
    async fn on_connect(&self, ctx: SocketContext) {
        println!("Client connected: {}", ctx.id());
    }

    #[on("event")]
    async fn handle_message_event(&self, ctx: SocketContext) {
        let payload: Event = ctx.try_data().expect("Failed to parse event data");

        println!("Received 'event' from {}: {payload:?}", ctx.id());
    }
}
```

In this example, the interceptor runs before the `#[on("connection")]` event. Any interaction in other events associated with the controller will not pass through the applied interceptor.

## Tower and Socket.IO

With Socket.IO it is worth distinguishing two things:

- **Global layers**: they do apply, because Socket.IO is mounted on the application's web runtime. For example, a global CORS layer can affect the initial handshake and the HTTP request associated with the `polling` or `websocket` transport.
- **Local layers via `#[interceptor(expr)]`**: they are not supported for connection logic.

If you need connection-specific logic in Socket.IO, the right way is through `OnConnect` or `OnConnectWithConfig`.

## Extensions

With Socket.IO there is a related but different concept from web extensions:

- `ctx.extensions()` gives access to the socket's extensions.
- `ctx.http_extensions()` gives access to the HTTP extensions associated with the initial request.

This is useful when you need to share information between the HTTP handshake and the subsequent real-time event phase. For more details, check [Context and extensions](/en/practical-guides/socketio/context-and-extensions).
