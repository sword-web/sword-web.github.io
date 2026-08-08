---
title: "Context and Extensions"
description: "This guide focuses on sharing state through extensions during the lifecycle of a Socket.IO connection."
outline: [2, 3]
---
# Context and Extensions

This guide focuses on sharing state through extensions during the lifecycle of a Socket.IO connection.

For the full `SocketContext` reference (methods, signatures, and behavior by handler type), see [Event handling and SocketContext reference](/en/practical-guides/socketio/event-handling).

## Socket extensions

`ctx.extensions()` gives you access to socket extension storage.

Recommended uses:

- Store state tied to a specific connection.
- Share data across different events from the same client.

## HTTP extensions from handshake

`ctx.http_extensions()` lets you read extensions from the initial HTTP handshake request.

Recommended uses:

- Reuse values added by HTTP layers or interceptors before entering Socket.IO flow.

## Conceptual example

```rust
use sword::socketio::SocketContext;

fn read_shared_data(ctx: &SocketContext) {
    let _socket_ext = ctx.extensions();
    let _http_ext = ctx.http_extensions();
}
```
