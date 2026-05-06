---
title: "Event Handling and SocketContext Reference"
description: "In Sword, Socket.IO controllers work with events (#[on(\"...\")]) and receive a SocketContext."
outline: [2, 3]
---
# Event Handling and SocketContext Reference

In Sword, Socket.IO controllers work with events (`#[on("...")]`) and receive a `SocketContext`.
This page combines event flow guidance with a reference for the public `SocketContext` API, based on the real implementation in the `sword-socketio` crate.

## Event types

The most common handlers are:

- `connection`
- `disconnection`
- custom events such as `message`, `chat-message`, or `room:join`

## Behavior by handler type

- In `connection`, `event()` returns `None`; `try_data::<T>()` tries to read handshake `auth`.
- In `message`, `event()` returns `Some(event_name)` and `try_data::<T>()` reads event payload.
- In `disconnection`, `disconnect_reason()` can return the disconnect reason.

## SocketContext reference

### Attribute `socket`

```rust
pub socket: SocketRef<A>
```

**Returns**

- Direct access to the underlying `socketioxide` socket.

**When to use it**

- For `emit`, `join`, `leave`, `broadcast`, `to(room)`, and similar operations.

**When not to use it**

- When you only need context metadata (`id`, `event`, `transport_type`, etc.).

### Method `id()`

```rust
pub fn id(&self) -> &Sid
```

**Returns**

- Socket identifier (`socketioxide::Sid`).

**When to use it**

- Logging, traceability, and associating events with a specific connection.

### Method `event()`

```rust
pub fn event(&self) -> Option<&str>
```

**Returns**

- `Some(event_name)` in message handlers.
- `None` in `connection` and `disconnection`.

**When to use it**

- Routing logic by event name or tracking per-event metrics.

### Method `protocol_version()`

```rust
pub fn protocol_version(&self) -> ProtocolVersion
```

**Returns**

- Negotiated Socket.IO protocol version.

**When to use it**

- Client compatibility checks and diagnostics.

### Method `transport_type()`

```rust
pub fn transport_type(&self) -> TransportType
```

**Returns**

- Active transport (`websocket` or `polling`).

**When to use it**

- Telemetry, transport-specific behavior, and handshake debugging.

### Method `disconnect_reason()`

```rust
pub fn disconnect_reason(&self) -> Option<&DisconnectReason>
```

**Returns**

- `Some(reason)` in disconnect handlers.
- `None` in connect/message handlers.

**When to use it**

- Auditing why a connection closed.

### Method `try_data::<T>()`

```rust
pub fn try_data<T: DeserializeOwned>(&self) -> Result<T, SocketError>
```

**Returns**

- `Ok(T)` when payload deserialization succeeds.
- `Err(SocketError)` when payload is missing or parsing fails.

**When to use it**

- Deserializing payload (or connect `auth`) without validator-based validation.

**When not to use it**

- When you need declarative validation rules. In that case, use `try_validated_data::<T>()`.

**Notes**

- This method consumes internal payload. A second call in the same handler fails.

### Method `try_validated_data::<T>()`

```rust
pub fn try_validated_data<T>(&self) -> Result<T, SocketError>
where
    T: DeserializeOwned + Validate
```

**Returns**

- `Ok(T)` when deserialization and validation both succeed.
- `Err(SocketError)` when parsing fails, payload is missing, or validation fails.

**When to use it**

- When payload must satisfy `validator` rules.

**When not to use it**

- If you have not enabled the `validation-validator` feature.

**Notes**

- Internally, this method uses `try_data()`, so it also consumes payload.

### Method `has_data()`

```rust
pub fn has_data(&self) -> bool
```

**Returns**

- `true` if payload has not been consumed yet.

**When to use it**

- To avoid parsing payload twice.

### Method `has_ack()`

```rust
pub fn has_ack(&self) -> bool
```

**Returns**

- `true` if the current event includes an ACK callback.

**When to use it**

- Before calling `ack(...)` in message handlers.

### Method `ack(&value)`

```rust
pub fn ack<D>(self, data: &D) -> Result<(), SendError>
where
    D: Serialize + ?Sized
```

**Returns**

- `Ok(())` when ACK is sent.
- `Err(SendError)` if ACK is unavailable or sending fails.

**When to use it**

- To answer client callbacks when `has_ack()` is `true`.

**When not to use it**

- In handlers without ACK support.

**Notes**

- Consumes `self`; you cannot keep using the same `SocketContext` after calling `ack(...)`.

### Method `extensions()`

```rust
pub fn extensions(&self) -> &Extensions
```

**Returns**

- Socket extension storage.

**When to use it**

- Sharing state across the lifetime of a connection.

### Method `http_extensions()`

```rust
pub fn http_extensions(&self) -> &HttpExtensions
```

**Returns**

- HTTP extensions from the initial handshake request.

**When to use it**

- Reusing values written by HTTP layers/interceptors during handshake.

### Method `disconnect()`

```rust
pub fn disconnect(self) -> Result<(), SocketError>
```

**Returns**

- `Ok(())` when disconnect succeeds.
- `Err(SocketError)` if the connection cannot be closed cleanly.

**When to use it**

- When the server needs to close a connection explicitly.

**Notes**

- Consumes `self`; after calling it, you cannot reuse the same context.

## Base example

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

        if ctx.has_ack() {
            let _ = ctx.ack(&"ok");
            return;
        }

        ctx.socket.emit("message", &message).ok();
    }

    #[on("disconnection")]
    async fn on_disconnect(&self, ctx: SocketContext) {
        println!("reason: {:?}", ctx.disconnect_reason());
    }
}
```

## See also

- [Data validation](/en/practical-guides/socketio/data-validation)
- [ACKs](/en/practical-guides/socketio/acknowledgements)
- [Context and extensions](/en/practical-guides/socketio/context-and-extensions)
