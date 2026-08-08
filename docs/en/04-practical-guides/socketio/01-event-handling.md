---
title: "Event Handling and SocketContext Reference"
description: "In Sword, Socket.IO controllers work with events (#[on(\"...\")]) and receive a SocketContext."
outline: [2, 3]
---

# Event Handling and SocketContext Reference

In Sword, Socket.IO controllers work with events (`#[on("...")]`) and receive a `SocketContext`.
This page combines event flow guidance with a reference for the public `SocketContext` API.

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

### Method `id()`

```rust
pub fn id(&self) -> &Sid
```

**Returns**

- Socket identifier (`socketioxide::Sid`).

**When to use it**

- Logging, traceability, and associating events with a specific connection.

### Method `connected()`

```rust
pub fn connected(&self) -> bool
```

**Returns**

- `true` if the socket is connected to the namespace.

**When to use it**

- Checking if the socket is still active before performing operations.

### Method `ns()`

```rust
pub fn ns(&self) -> &str
```

**Returns**

- The current namespace path for this socket.

### Method `rooms()`

```rust
pub fn rooms(&self) -> Vec<Room>
```

**Returns**

- All room names this socket is connected to.

### Method `event()`

```rust
pub fn event(&self) -> Option<&str>
```

**Returns**

- `Some(event_name)` in message handlers.
- `None` in `connection` and `disconnection`.

**When to use it**

- Routing logic by event name or tracking per-event metrics.

### Method `disconnect_reason()`

```rust
pub fn disconnect_reason(&self) -> Option<&DisconnectReason>
```

**Returns**

- `Some(reason)` in disconnect handlers.
- `None` in connect/message handlers.

**When to use it**

- Auditing why a connection closed.

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

### Method `query::<T>()`

```rust
pub fn query<T: DeserializeOwned>(&self) -> Result<Option<T>, SocketError>
```

**Returns**

- `Ok(Some(T))` if query string exists and is valid.
- `Ok(None)` if no query string is present.
- `Err(SocketError)` if query exists but cannot be deserialized.

**When to use it**

- Reading URL query parameters during connection.

### Method `emit()`

```rust
pub fn emit<T>(&self, event: impl AsRef<str>, data: &T) -> Result<(), SocketError>
where
    T: Serialize + ?Sized
```

**Returns**

- `Ok(())` when the event is sent.
- `Err(SocketError)` if sending fails.

**When to use it**

- Sending events to the connected client.

### Method `emit_with_ack()`

```rust
pub fn emit_with_ack<T: ?Sized + Serialize, V>(
    &self,
    event: impl AsRef<str>,
    data: &T,
) -> Result<AckStream<V>, SocketError>
```

**Returns**

- An `AckStream` that resolves when the client acknowledges the event.

**When to use it**

- When you need confirmation from the client that the event was received.

### Method `broadcast()`

```rust
pub fn broadcast(&self) -> BroadcastOperators<A>
```

**Returns**

- A broadcast operator that sends to all connected clients (except the sender).

**When to use it**

- Broadcasting a message to every connected client.

### Method `local()`

```rust
pub fn local(&self) -> BroadcastOperators<A>
```

**Returns**

- A broadcast operator that sends only to clients connected to this node.

**When to use it**

- Broadcasting only to the current server instance (multi-node deployments).

### Method `to()`

```rust
pub fn to(&self, rooms: impl RoomParam) -> BroadcastOperators<A>
```

**Returns**

- A broadcast operator scoped to the specified rooms.

**When to use it**

- Sending to specific rooms that the socket belongs to.

### Method `within()`

```rust
pub fn within(&self, rooms: impl RoomParam) -> BroadcastOperators<A>
```

**Returns**

- A broadcast operator scoped to the specified rooms (alias for `to()`).

### Method `except()`

```rust
pub fn except(&self, rooms: impl RoomParam) -> BroadcastOperators<A>
```

**Returns**

- A broadcast operator that excludes the specified rooms.

**When to use it**

- Broadcasting to all except certain rooms.

### Method `timeout()`

```rust
pub fn timeout(&self, timeout: Duration) -> ConfOperators<'_, A>
```

**Returns**

- A configuration operator with a custom timeout for acknowledgement.

**When to use it**

- Setting a custom timeout when sending a message with an acknowledgement.

### Method `join()`

```rust
pub fn join(&self, rooms: impl RoomParam)
```

**When to use it**

- Adding the current socket to one or more rooms.

### Method `leave()`

```rust
pub fn leave(&self, rooms: impl RoomParam)
```

**When to use it**

- Removing the current socket from one or more rooms.

### Method `leave_all()`

```rust
pub fn leave_all(&self)
```

**When to use it**

- Removing the current socket from all its rooms.

### Method `has_ack()`

```rust
pub fn has_ack(&self) -> bool
```

**Returns**

- `true` if the current event includes an ACK callback.

**When to use it**

- Before calling `ack(...)` in message handlers.

### Method `ack()`

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

### Method `req_parts()`

```rust
pub fn req_parts(&self) -> &Parts
```

**Returns**

- The HTTP request parts from the initial handshake.

**When to use it**

- Accessing raw HTTP request data (method, URI, etc.).

### Method `headers()`

```rust
pub fn headers(&self) -> &HeaderMap
```

**Returns**

- A reference to the socket's request headers.

**When to use it**

- Reading HTTP headers from the initial handshake request.

### Method `authorization()`

```rust
pub fn authorization(&self) -> Option<&str>
```

**Returns**

- The value of the `Authorization` header, if present.

**When to use it**

- Extracting bearer tokens or other auth data from the handshake.

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
    async fn on_connect(&self, socket: SocketContext) {
        println!("connected: {}", socket.id());

        let query: Option<MyQuery> = socket.query().unwrap();
    }

    #[on("message")]
    async fn on_message(&self, socket: SocketContext) {
        let Ok(message) = socket.try_data::<String>() else {
            return;
        };

        if socket.has_ack() {
            let _ = socket.ack(&"ok");
            return;
        }

        socket.emit("message", &message).ok();
    }

    #[on("disconnection")]
    async fn on_disconnect(&self, socket: SocketContext) {
        println!("reason: {:?}", socket.disconnect_reason());
    }
}
```

## See also

- [Data validation](/en/practical-guides/socketio/data-validation)
- [ACKs](/en/practical-guides/socketio/acknowledgements)
- [Context and extensions](/en/practical-guides/socketio/context-and-extensions)
