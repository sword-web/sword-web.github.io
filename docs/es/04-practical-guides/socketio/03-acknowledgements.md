---
title: "ACKs"
description: "Cuando un cliente envía un evento Socket.IO con callback, el servidor puede responder usando un ACK."
outline: [2, 3]
---

# Acknowledgements (ACKs)

Cuando un cliente envía un evento con un callback, el servidor puede responder usando un acknowledgement (reconocimiento).

Puedes encontrar la referencia de los métodos `has_ack()` y `ack(...)`, en la [referencia de SocketContext](/es/practical-guides/socketio/event-handling).

## Detectar si el evento espera acknowledgement

```rust
if ctx.has_ack() {
    // ...
}
```

## Responder con `ack(...)`

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

## Cuándo usar este mecanismo

Los ACKs son útiles cuando el cliente necesita una confirmación explícita de que el servidor procesó el evento correctamente o quiere recibir un resultado inmediato de la operación.
