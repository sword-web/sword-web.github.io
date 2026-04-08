---
title: Socket.IO Controllers
description: Definition, supported events, SocketContext, and configuration of Socket.IO controllers in Sword.
outline: [2, 3]
prev:
  text: Web Controllers
  link: /en/application-components/controllers/web-controllers
next:
  text: Dependency Injection
  link: /en/application-components/di/
---

# Socket.IO Controllers

In Sword, a Socket.IO controller is a `struct` annotated with `#[controller(kind = Controller::SocketIo, namespace = "...")]`, whose methods handle events declared with `#[on("...")]`.

## Defining a Controller

```rust
use sword::prelude::*;
use sword::socketio::*;

#[controller(kind = Controller::SocketIo, namespace = "/chat")]
pub struct ChatController;

impl ChatController {
    #[on("connection")]
    async fn on_connect(&self, ctx: SocketContext) {
        println!("Client connected: {}", ctx.id());
    }

    #[on("message")]
    async fn on_message(&self, ctx: SocketContext) {
        let Ok(message) = ctx.try_data::<String>() else {
            return;
        };

        ctx.socket.emit("message", &message).ok();
    }
}
```

## Supported Events

### Special Events

- `#[on("connection")]`
- `#[on("disconnection")]`
- `#[on("fallback")]`

### Custom Events

- `#[on("message")]`
- `#[on("chat-message")]`
- `#[on("room:join")]`

## `SocketContext`

`SocketContext` is the primary extractor in Socket.IO handlers.

### Quick API Summary

| API | Usage |
| --- | --- |
| `ctx.socket` | Direct access to `emit`, `join`, `leave`, `broadcast`, etc. |
| `ctx.id()` | Read the socket identifier. |
| `ctx.event()` | Read the name of the current event. |
| `ctx.try_data::<T>()` | Deserialize the payload. |
| `ctx.try_validated_data::<T>()` | Deserialize and validate the payload. |
| `ctx.ack(&value)` | Respond with an ACK. |
| `ctx.has_ack()` | Check if an ACK is expected. |
| `ctx.has_data()` | Check if payload data is still available. |
| `ctx.disconnect_reason()` | Read the reason for disconnection. |
| `ctx.disconnect()` | Close the connection from the server. |
| `ctx.extensions()` | Socket extensions. |
| `ctx.http_extensions()` | HTTP extensions from the handshake. |
| `ctx.transport_type()` | Current transport type. |

`ctx.try_data::<T>()` consumes the internal payload. If called twice in the same handler, the second call will fail because the data is no longer available.

### Connection, Message, and Disconnection Example

```rust
use sword::prelude::*;
use sword::socketio::*;

#[controller(kind = Controller::SocketIo, namespace = "/chat")]
pub struct ChatController;

impl ChatController {
    #[on("connection")]
    async fn on_connect(&self, ctx: SocketContext) {
        println!("connected: {}", ctx.id());
    }

    #[on("message")]
    async fn on_message(&self, ctx: SocketContext) {
        let Ok(message) = ctx.try_data::<String>() else {
            return;
        };

        ctx.socket.emit("message", &message).ok();
    }

    #[on("disconnection")]
    async fn on_disconnect(&self, ctx: SocketContext) {
        println!("disconnect reason: {:?}", ctx.disconnect_reason());
    }
}
```

## ACKs

If a client sends an event with an ACK callback, the handler can respond using `ctx.ack(...)`.

```rust
use serde::Serialize;
use sword::prelude::*;
use sword::socketio::*;

#[derive(Serialize)]
struct AckPayload {
    ok: bool,
}

#[controller(kind = Controller::SocketIo, namespace = "/chat")]
pub struct ChatController;

impl ChatController {
    #[on("ping")]
    async fn ping(&self, ctx: SocketContext) {
        if ctx.has_ack() {
            let _ = ctx.ack(&AckPayload { ok: true });
        }
    }
}
```

`ctx.has_ack()` allows you to check if the current event includes an ACK callback.

## Connection Interceptors

Socket.IO in Sword supports connection interceptors via `OnConnect` and `OnConnectWithConfig`.

```rust
use sword::prelude::*;
use sword::socketio::*;

#[derive(Interceptor)]
pub struct AuthConnectInterceptor;

impl OnConnect for AuthConnectInterceptor {
    type Error = String;

    async fn on_connect(&self, ctx: SocketContext) -> Result<(), Self::Error> {
        let Some(auth) = ctx.socket.req_parts().headers.get("authorization") else {
            return Err("missing authorization header".to_string());
        };

        let token = auth.to_str().map_err(|_| "invalid authorization header")?;

        if token.is_empty() {
            return Err("empty token".to_string());
        }

        Ok(())
    }
}
```

Applying it to the controller:

```rust
#[controller(kind = Controller::SocketIo, namespace = "/chat")]
#[interceptor(AuthConnectInterceptor)]
pub struct ChatController;
```

If the interceptor returns `Err`, the connection is rejected. The error type must implement `Display`.

## Registering in a Module

```rust
use sword::prelude::*;

pub struct ChatModule;

impl Module for ChatModule {
    fn register_controllers(controllers: &ControllerRegistry) {
        controllers.register::<ChatController>();
    }
}
```

## `[socketio]` Configuration

To enable Socket.IO, you must compile with the `socketio-controllers` feature and define the `[socketio]` section in your configuration.

```toml
[socketio]
enabled = true
parser = "common"
transports = ["websocket", "polling"]
ping-timeout = "20s"
ping-interval = "25s"
```

### Fields available in `SocketIoServerConfig`

| Key | Type | Default | Description |
| --- | --- | --- | --- |
| `ack-timeout` | `Option<TimeConfig>` | `5s` | Maximum time for an outgoing ACK. |
| `connect-timeout` | `Option<TimeConfig>` | `45s` | Limit to complete the initial connection. |
| `max-buffer-size` | `Option<usize>` | `128` | Maximum packets in buffer per connection. |
| `max-payload` | `Option<ByteConfig>` | `100KB` | Maximum size for an outgoing payload. |
| `ping-interval` | `Option<TimeConfig>` | `25s` | Server ping interval. |
| `ping-timeout` | `Option<TimeConfig>` | `20s` | Pong timeout before disconnecting. |
| `req-path` | `Option<String>` | `"/socket.io"` | HTTP path where Socket.IO is mounted. |
| `transports` | `Option<Vec<String>>` | `["polling", "websocket"]` | Allowed transports. |
| `parser` | `"common" \| "msgpack"` | `"common"` | Payload parser. |
| `ws-read-buffer-size` | `Option<usize>` | `4096` | WebSocket read buffer size. |
| `display` | `bool` | `false` | Shows this config at startup. |

## See Also

- [Event Handling](/en/practical-guides/socketio/event-handling)
- [ACKs](/en/practical-guides/socketio/acknowledgements)
- [Context and Extensions](/en/practical-guides/socketio/context-and-extensions)
- [Interceptors with Configuration](/en/application-components/interceptors/with-config)
