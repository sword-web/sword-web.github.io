---
title: "Event Handling and SocketContext Reference"
description: 'In Sword, Socket.IO controllers work with events (#[on("...")]) and receive a SocketContext.'
outline: [2, 3]
---

# Event Handling and SocketContext Reference

Just like web controllers, Socket.IO controllers work with methods on the struct, and each of them can use a general context extractor.

This structure, called `SocketContext`, encapsulates relevant information about the connection, the event, and the socket state.

## SocketContext reference

### Method `id()`

```rust
pub fn id(&self) -> &Sid
```

**Returns**

- The socket identifier (`socketioxide::Sid`).

**When to use it**

- Logging, traceability, associating events with a specific connection.

<hr/>

### Method `connected()`

```rust
pub fn connected(&self) -> bool
```

**Returns**

- `true` if the socket is connected to the namespace.

**When to use it**

- To check whether the socket is still active before performing operations.

<hr/>

### Method `ns()`

```rust
pub fn ns(&self) -> &str
```

**Returns**

- The current namespace path of this socket.

<hr/>

### Method `rooms()`

```rust
pub fn rooms(&self) -> Vec<Room>
```

**Returns**

- All room names this socket is connected to.

<hr/>

### Method `event()`

```rust
pub fn event(&self) -> Option<&str>
```

**Returns**

- `Some(event_name)` in message handlers.

**When to use it**

- To route logic by event name or record per-event metrics.

:::info
Using this method in the `connection` or `disconnection` event returns `None`.
:::

<hr/>

### Method `disconnect_reason()`

```rust
pub fn disconnect_reason(&self) -> Option<&DisconnectReason>
```

**Returns**

- `Some(reason)` in disconnection handlers.
- `None` in `connect`/`message`.

**When to use it**

- To audit why a connection is closed.

<hr/>

### Method `protocol_version()`

```rust
pub fn protocol_version(&self) -> ProtocolVersion
```

**Returns**

- The negotiated Socket.IO protocol version.

**When to use it**

- Diagnostics and client compatibility.

<hr/>

### Method `transport_type()`

```rust
pub fn transport_type(&self) -> TransportType
```

**Returns**

- The active transport (`websocket` or `polling`).

**When to use it**

- Telemetry, transport-based rules, handshake debugging.

<hr/>

### Method `try_data::<T>()`

```rust
pub fn try_data<T: DeserializeOwned>(&self) -> Result<T, SocketError>
```

**Returns**

- `Ok(T)` if the payload could be deserialized.
- `Err(SocketError)` if no payload is available or parsing fails.

**When to use it**

- When you need to deserialize the payload without schema validation.

:::info
In the `connection` event, this method tries to read the handshake `auth` payload.
:::

:::warning
This method consumes the internal payload. A second call in the same handler fails.
:::

<hr/>

### Method `try_validated_data::<T>()`

```rust
pub fn try_validated_data<T>(&self) -> Result<T, SocketError>
where
    T: DeserializeOwned + Validate
```

**Returns**

- `Ok(T)` if it deserializes and validates correctly.
- `Err(SocketError)` if parsing fails, there is no payload, or validation fails.

**When to use it**

- When the payload must comply with schema validation rules.

:::info
In the `connection` event, this method tries to read the handshake `auth` payload.
:::

:::warning
This method consumes the internal payload. A second call in the same handler fails.
:::

<hr/>

### Method `has_data()`

```rust
pub fn has_data(&self) -> bool
```

**Returns**

- `true` if the payload has not been consumed yet.

**When to use it**

- To avoid trying to parse twice.

<hr/>

### Method `query::<T>()`

```rust
pub fn query<T: DeserializeOwned>(&self) -> Result<Option<T>, SocketError>
```

**Returns**

- `Ok(Some(T))` if the query string exists and is valid.
- `Ok(None)` if there is no query string.
- `Err(SocketError)` if the query exists but does not deserialize.

**When to use it**

- To read URL query parameters during the connection.

<hr/>

### Method `emit()`

```rust
pub fn emit<T>(&self, event: impl AsRef<str>, data: &T) -> Result<(), SocketError>
where
    T: Serialize + ?Sized
```

**Returns**

- `Ok(())` if the event is sent.
- `Err(SocketError)` if sending fails.

**When to use it**

- To send events to the connected client.

<hr/>

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

<hr/>

### Method `broadcast()`

```rust
pub fn broadcast(&self) -> BroadcastOperators<A>
```

**Returns**

- A broadcast operator that sends to all connected clients (except the sender).

**When to use it**

- To transmit a message to every connected client.

<hr/>

### Method `local()`

```rust
pub fn local(&self) -> BroadcastOperators<A>
```

**Returns**

- A broadcast operator that sends only to clients of this node.

**When to use it**

- Broadcast only to the current server instance (multi-node deployments).

<hr/>

### Method `to()`

```rust
pub fn to(&self, rooms: impl RoomParam) -> BroadcastOperators<A>
```

**Returns**

- A broadcast operator limited to the specified rooms.

**When to use it**

- To send to specific rooms the socket belongs to.

<hr/>

### Method `within()`

```rust
pub fn within(&self, rooms: impl RoomParam) -> BroadcastOperators<A>
```

**Returns**

- A broadcast operator limited to the specified rooms (alias of `to()`).

<hr/>

### Method `except()`

```rust
pub fn except(&self, rooms: impl RoomParam) -> BroadcastOperators<A>
```

**Returns**

- A broadcast operator that excludes the specified rooms.

**When to use it**

- Broadcast to everyone except certain rooms.

<hr/>

### Method `timeout()`

```rust
pub fn timeout(&self, timeout: Duration) -> ConfOperators<'_, A>
```

**Returns**

- A configuration operator with a custom timeout for the acknowledgement.

**When to use it**

- To set a timeout when sending a message with acknowledgement.

<hr/>

### Method `join()`

```rust
pub fn join(&self, rooms: impl RoomParam)
```

**When to use it**

- To add the current socket to one or more rooms.

<hr/>

### Method `leave()`

```rust
pub fn leave(&self, rooms: impl RoomParam)
```

**When to use it**

- To remove the current socket from one or more rooms.

<hr/>

### Method `leave_all()`

```rust
pub fn leave_all(&self)
```

**When to use it**

- To remove the current socket from all its rooms.

<hr/>

### Method `has_ack()`

```rust
pub fn has_ack(&self) -> bool
```

**Returns**

- `true` if the current event includes an ACK callback.

**When to use it**

- Before calling `ack(...)` in message handlers.

<hr/>

### Method `ack()`

```rust
pub fn ack<D>(self, data: &D) -> Result<(), SendError>
where
    D: Serialize + ?Sized
```

**Returns**

- `Ok(())` if the ACK is sent.
- `Err(SendError)` if no ACK is available or sending fails.

**When to use it**

- To respond to client callbacks when `has_ack()` is `true`.

**When not to use it**

- In handlers without an associated ACK.

::: warning
It consumes `self`, meaning you cannot reuse the context after calling it.
:::

<hr/>

### Method `req_parts()`

```rust
pub fn req_parts(&self) -> &Parts
```

**Returns**

- The parts of the initial handshake HTTP request.

**When to use it**

- To access raw HTTP data (method, URI, etc.).

<hr/>

### Method `headers()`

```rust
pub fn headers(&self) -> &HeaderMap
```

**Returns**

- A reference to the socket request headers.

**When to use it**

- To read HTTP headers from the initial handshake.

<hr/>

### Method `authorization()`

```rust
pub fn authorization(&self) -> Option<&str>
```

**Returns**

- The value of the `Authorization` header, if present.

**When to use it**

- To extract Bearer tokens or other authentication data from the handshake.

<hr/>

### Method `extensions()`

```rust
pub fn extensions(&self) -> &Extensions
```

**Returns**

- The extension store associated with the socket.

**When to use it**

- To share state for the lifetime of the connection.

<hr/>

### Method `http_extensions()`

```rust
pub fn http_extensions(&self) -> &HttpExtensions
```

**Returns**

- The HTTP extensions of the initial handshake.

**When to use it**

- To reuse data written by HTTP interceptors/layers during the handshake.

<hr/>

### Method `disconnect()`

```rust
pub fn disconnect(self) -> Result<(), SocketError>
```

**Returns**

- `Ok(())` if the disconnection is performed.
- `Err(SocketError)` if closing the connection fails.

**When to use it**

- When the server decides to actively terminate the connection.

::: warning
It consumes `self`, meaning you cannot reuse the context after calling it.
:::

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
