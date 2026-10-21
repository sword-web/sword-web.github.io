---
title: "Event Handling and SocketContext Reference"
description: 'In Sword, Socket.IO controllers work with events (#[on("...")]) and receive a SocketContext.'
outline: [2, 3]
---

# Event Handling and SocketContext Reference

As with web controllers, Socket.IO controllers work with struct methods, and each method can use a general context extractor.

This struct, called `SocketContext`, holds information about the connection, the event, and the socket state.

<ApiSection title="API Reference: Methods of the 'SocketContext' struct" :collapsed="false">

#### Accessing the socket identifier

```rust
pub fn id(&self) -> &Sid
```

**Returns**

- The `&Sid` that identifies this socket.

**When to use it**

- Logging, tracing, and linking events to a specific connection.

---

#### Checking whether the socket is connected

Checks whether the socket is still active before running operations that depend on the connection.

```rust
pub fn connected(&self) -> bool
```

**Returns**

- `true` or `false` depending on whether the socket is connected.

---

#### Accessing the socket namespace

```rust
pub fn ns(&self) -> &str
```

**Returns**

- The namespace path of this socket.

---

#### Accessing the socket rooms

```rust
pub fn rooms(&self) -> Vec<Room>
```

**Returns**

- Every room name this socket is connected to.

---

#### Accessing the current event name

```rust
pub fn event(&self) -> Option<&str>
```

**Returns**

- `Some(event_name)` in message handlers.

:::info
When you call this method in the `connection` or `disconnection` event, it returns `None`.
:::

---

#### Accessing the disconnect reason

```rust
pub fn disconnect_reason(&self) -> Option<&DisconnectReason>
```

**Returns**

- `Some(reason)` in disconnection handlers.
- `None` in `connect`/`message`.

**When to use it**

- Auditing why a connection was closed.

---

#### Accessing the protocol version in use

```rust
pub fn protocol_version(&self) -> ProtocolVersion
```

**Returns**

- The negotiated Socket.IO protocol version.

**When to use it**

- Diagnostics and client compatibility checks.

---

#### Accessing the transport type in use

```rust
pub fn transport_type(&self) -> TransportType
```

**Returns**

- The active transport (`websocket` or `polling`).

**When to use it**

- Telemetry, transport-specific rules, and handshake debugging.

---

#### Accessing the event payload

```rust
pub fn try_data<T: DeserializeOwned>(&self) -> Result<T, SocketError>
```

**Parameters**

- `T`: the expected data type. It must implement `DeserializeOwned`.

**Returns**

- `Ok(T)` if the payload was deserialized.
- `Err(SocketError)` if no payload is available or parsing fails.

:::info
In the `connection` event, this method tries to read the `auth` payload from the handshake.
:::

:::warning
This method consumes the internal payload. A second call in the same handler fails.
:::

---

#### Accessing the event payload with validation

```rust
pub fn try_validated_data<T>(&self) -> Result<T, SocketError>
where
    T: DeserializeOwned + Validate
```

**Returns**

- `Ok(T)` if the payload deserializes and validates.
- `Err(SocketError)` if parsing fails, no payload is available, or validation fails.

**When to use it**

- When the payload must follow schema validation rules.

:::info
In the `connection` event, this method tries to read the `auth` payload from the handshake.
:::

:::warning
This method consumes the internal payload. A second call in the same handler fails.
:::

---

#### Checking whether a payload is available

```rust
pub fn has_data(&self) -> bool
```

**Returns**

- `true` if the payload has not been consumed yet.

**When to use it**

- To avoid parsing the same payload twice.

---

#### Accessing the URL query parameters

```rust
pub fn query<T: DeserializeOwned>(&self) -> Result<Option<T>, SocketError>
```

**Parameters**

- `T`: the expected data type. It must implement `DeserializeOwned`.

**Returns**

- `Ok(Some(T))` if the query string exists and is valid.
- `Ok(None)` if there is no query string.
- `Err(SocketError)` if the query exists but cannot be deserialized.

**When to use it**

- To read URL query parameters during the connection.

---

#### Emitting an event to the client

```rust
pub fn emit<T>(&self, event: impl AsRef<str>, data: &T) -> Result<(), SocketError>
where
    T: Serialize + ?Sized
```

**Parameters**

- `event`: the name of the event to emit.
- `data`: the serializable payload to send.

**Returns**

- `Ok(())` if the event is sent.
- `Err(SocketError)` if sending fails.

**When to use it**

- To send events to the connected client.

---

#### Emitting an event to the client and waiting for confirmation

```rust
pub fn emit_with_ack<T: ?Sized + Serialize, V>(
    &self,
    event: impl AsRef<str>,
    data: &T,
) -> Result<AckStream<V>, SocketError>
```

**Parameters**

- `event`: the name of the event to emit.
- `data`: the serializable payload to send.

**Returns**

- An `AckStream` that resolves when the client confirms the event.

**When to use it**

- When you need the client to confirm that it received the event.

---

#### Accessing a broadcast operator

```rust
pub fn broadcast(&self) -> BroadcastOperators<A>
```

**Returns**

- A broadcast operator that sends to every connected client except the sender.

**When to use it**

- To send a message to every connected client.

---

#### Accessing a broadcast operator limited to specific rooms

```rust
pub fn to(&self, rooms: impl RoomParam) -> BroadcastOperators<A>
```

**Returns**

- A broadcast operator limited to the specified rooms.

**When to use it**

- To send to specific rooms the socket belongs to.

---

#### Accessing a broadcast operator that excludes certain rooms

```rust
pub fn except(&self, rooms: impl RoomParam) -> BroadcastOperators<A>
```

**Returns**

- A broadcast operator that excludes the specified rooms.

**When to use it**

- To broadcast to everyone except certain rooms.

---

#### Accessing a configuration operator for acknowledgements

```rust
pub fn timeout(&self, timeout: Duration) -> ConfOperators<'_, A>
```

**Returns**

- A configuration operator with a custom timeout for the acknowledgement.

**When to use it**

- To set a timeout when sending a message with confirmation.

---

#### Adding the socket to one or more rooms

```rust
pub fn join(&self, rooms: impl RoomParam)
```

**When to use it**

- To add the current socket to one or more rooms.

---

#### Removing the socket from one or more rooms

```rust
pub fn leave(&self, rooms: impl RoomParam)
```

**When to use it**

- To remove the current socket from one or more rooms.

---

#### Removing the socket from all its rooms

```rust
pub fn leave_all(&self)
```

**When to use it**

- To remove the current socket from all its rooms.

---

#### Checking whether the current event includes an ACK callback

```rust
pub fn has_ack(&self) -> bool
```

**Returns**

- `true` if the current event includes an ACK callback.

**When to use it**

- Before calling `ack(...)` in message handlers.

---

#### Responding to a client ACK callback

```rust
pub fn ack<D>(self, data: &D) -> Result<(), SendError>
where
    D: Serialize + ?Sized
```

**Parameters**

- `data`: the serializable payload to send as the callback response.

**Returns**

- `Ok(())` if the ACK is sent.
- `Err(SendError)` if no ACK is available or sending fails.

**When to use it**

- To answer client callbacks when `has_ack()` is `true`.

**When not to use it**

- In handlers without an associated ACK.

::: warning
It consumes `self`, so you cannot reuse the context after calling it.
:::

---

#### Getting the HTTP request parts from the initial handshake

```rust
pub fn req_parts(&self) -> &Parts
```

**Returns**

- The HTTP request parts from the initial handshake.

**When to use it**

- To access raw HTTP data such as the method or URI.

---

#### Getting the HTTP headers from the initial handshake

```rust
pub fn headers(&self) -> &HeaderMap
```

**Returns**

- A reference to the socket request headers.

**When to use it**

- To read HTTP headers from the initial handshake.

---

#### Getting the 'Authorization' header from the initial handshake

```rust
pub fn authorization(&self) -> Option<&str>
```

**Returns**

- The `Authorization` header value, if present.

**When to use it**

- To extract Bearer tokens or other authentication data from the handshake.

---

#### Accessing the socket extensions store

```rust
pub fn extensions(&self) -> &Extensions
```

**Returns**

- The extensions store associated with the socket.

**When to use it**

- To share state during the connection.

---

#### Accessing the HTTP extensions store from the initial handshake

```rust
pub fn http_extensions(&self) -> &HttpExtensions
```

**Returns**

- The HTTP extensions from the initial handshake.

**When to use it**

- To reuse data written by HTTP interceptors or layers during the handshake.

---

#### Closing the socket connection

```rust
pub fn disconnect(self) -> Result<(), SocketError>
```

**Returns**

- `Ok(())` if the disconnection runs.
- `Err(SocketError)` if closing the connection fails.

**When to use it**

- When the server decides to close the connection itself.

::: warning
It consumes `self`, so you cannot reuse the context after calling it.
:::

</ApiSection>

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
