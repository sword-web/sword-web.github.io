---
title: "ACKs"
description: "When a client sends a Socket.IO event with a callback, the server can respond using an ACK."
outline: [2, 3]
---

# Acknowledgements (ACKs)

When a client sends an event with a callback, the server can respond using an acknowledgement (ACK).

You can find the reference for the `has_ack()` and `ack(...)` methods in the [SocketContext reference](/en/practical-guides/socketio/event-handling).

## Detecting if the event expects an acknowledgement

```rust
if ctx.has_ack() {
    // ...
}
```

## Responding with `ack(...)`

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
    async fn ping(&self, socket: SocketContext) {
        if socket.has_ack() {
            let _ = socket.ack(&AckPayload { ok: true });
        }
    }
}
```

## When to use this mechanism

ACKs are useful when the client needs explicit confirmation that the server processed the event correctly or wants to receive an immediate result from the operation.
