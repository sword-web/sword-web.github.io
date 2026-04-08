# Context and Extensions

`SocketContext` is the central point of access for a Socket.IO connection's state within a handler.

## Basic Socket Information

You can access data for the current socket using methods such as:

- `ctx.id()`
- `ctx.event()`
- `ctx.protocol_version()`
- `ctx.transport_type()`
- `ctx.disconnect_reason()`

Example:

```rust
println!("Socket ID: {}", ctx.id());

if let Some(event) = ctx.event() {
    println!("Current event: {event}");
}
```

## Socket Extensions

`ctx.extensions()` provides access to the socket's own extension storage.

This can be used to share state throughout the life of the connection.

## HTTP Extensions

`ctx.http_extensions()` provides access to the HTTP extensions from the initial handshake request.

This is useful when an HTTP layer or interceptor stores information in the request that you subsequently need to reuse within the Socket.IO context.

## Closing the Connection

You can close the connection from the server with:

```rust
let _ = ctx.disconnect();
```
