---
title: "Interceptors in Socket.IO Controllers"
description: "How to apply interceptors to Socket.IO controllers in Sword: OnConnect and the role of Tower."
outline: [2, 3]
---

# Interceptors in Socket.IO Controllers

In Socket.IO controllers, interceptors work differently from web controller interceptors. This is because the nature of real-time connections and the event flow differs from the traditional HTTP request flow.

Unlike web controller interceptors, the interceptor runs only during the initial handshake (the `connection` event). After that, each event under the namespace will not execute the interceptor.

## Traditional interceptors

### The 'OnConnect' Trait

This trait lets you define custom logic that runs before a client connects to a specific namespace.

::: code-group

```rust [interceptor.rs]
use sword::prelude::*;
use sword::socketio::*;

#[derive(Interceptor)]
struct EventLogger;

impl OnConnect for EventLogger {
    type Error = String;

    async fn on_connect(&self, ctx: SocketContext) -> Result<(), Self::Error> {
        println!("New connection - Socket ID: {}", ctx.id());

        Ok(())
    }
}
```

```rust [controller.rs]
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
        // ... do something with the event
    }
}
```

:::

:::info
As you may have noticed, you must define an associated error type. It can have whatever structure or format you see fit, but it must implement the `Display` trait.

:::

## Tower and Socket.IO

With Socket.IO it is worth distinguishing two things:

- **Global layers**: they do apply, because Socket.IO is mounted on the application's web runtime. For example, a global CORS layer can affect the initial handshake and the HTTP request associated with the `polling` or `websocket` transport.
- **Local layers via `#[interceptor(expr)]`**: they are not supported for connection logic.

If you need connection-specific logic in Socket.IO, the right way is through `OnConnect`.

## Extensions

With Socket.IO there is a related but different concept from web extensions:

- `ctx.extensions()` gives access to the socket's extensions.
- `ctx.http_extensions()` gives access to the HTTP extensions associated with the initial request.

### Example of using extensions

The interceptor can read information from the handshake and leave it ready for handlers in later events:

::: code-group

```rust [interceptor.rs]
use sword::prelude::*;
use sword::socketio::*;
use sword_layers::request_id::RequestId;

#[derive(Interceptor)]
struct UserInterceptor;

impl OnConnect for UserInterceptor {
    type Error = String;

    async fn on_connect(&self, ctx: SocketContext) -> Result<(), Self::Error> {
        let request_id = ctx
            .http_extensions()
            .get::<RequestId>()
            .map(|r| r.to_string())
            .unwrap_or_default();

        ctx.extensions().insert(request_id);

        Ok(())
    }
}
```

```rust [controller.rs]
use sword::prelude::*;
use sword::socketio::*;

#[controller(kind = Controller::SocketIo, namespace = "/events")]
#[interceptor(UserInterceptor)]
struct EventController;

impl EventController {
    #[on("message")]
    async fn handle_message(&self, ctx: SocketContext) {
        let request_id = ctx.extensions().get::<String>();
        // ... use the stored request id
    }
}
```

:::

### Difference between the 'extensions' and 'http_extensions' methods

**Method 'extensions'**

Gives access to the socket data. It lives for the whole connection and is shared across all events of the socket. This is where the interceptor writes and where handlers read the data they need during the connection.

**Method 'http_extensions'**

Gives access to the HTTP extensions of the handshake request that established the connection.
