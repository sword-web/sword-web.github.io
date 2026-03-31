# ACKs

Cuando un cliente envía un evento Socket.IO con callback, el servidor puede responder usando un ACK.

En Sword esto se maneja desde `SocketContext`.

## Detectar si el evento espera ACK

```rust
if ctx.has_ack() {
    // ...
}
```

## Responder con `ack(...)`

```rust
use serde::Serialize;
use sword::prelude::*;

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

## Cuándo usar ACKs

Los ACKs son útiles cuando el cliente necesita una confirmación explícita de que el servidor procesó el evento correctamente o quiere recibir un resultado inmediato de la operación.
