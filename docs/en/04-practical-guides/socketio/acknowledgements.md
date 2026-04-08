# ACKs

When a client sends a Socket.IO event with a callback, the server can respond using an ACK.

In Sword, this is handled through the `SocketContext`.

## Detecting if the event expects an ACK

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
    async fn ping(&self, ctx: SocketContext) {
        if ctx.has_ack() {
            let _ = ctx.ack(&AckPayload { ok: true });
        }
    }
}
```

## When to use ACKs

ACKs are useful when the client needs explicit confirmation that the server processed the event correctly or wants to receive an immediate result from the operation.
