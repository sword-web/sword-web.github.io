---
title: "Validación de datos"
description: "Sword permite validar datos entrantes en eventos Socket.IO usando el crate validator, de forma similar a la validación en controladores web."
outline: [2, 3]
---

# Validación de datos

Al igual que en controladores web, es posible validar datos entrantes en eventos Socket.IO usando el crate `validator`.

Para la referencia completa de `try_data` y `try_data_validator`, revisa [Manejo de eventos y referencia de SocketContext](/es/0.6/practical-guides/socketio/event-handling).

## Activación de la feature

Para usar validación en `SocketContext`, debes habilitar la feature `socketio-validator`.

```toml
[dependencies]
sword = { version = "0.6.0", features = ["socketio", "socketio-validator"] }
serde = { version = "x.y.z", features = ["derive"] }
validator = { version = "x.y.z", features = ["derive"] }
```

## Ejemplo de uso

::: code-group

```rust [dtos.rs]
use serde::Deserialize;
use validator::Validate;

#[derive(Debug, Deserialize, Validate)]
struct IncomingDataDto {
    #[validate(length(min = 1, max = 200))]
    pub content: String,
}
```

```rust [controller.rs]
use sword::prelude::*;
use sword::socketio::*;

#[controller(kind = Controller::SocketIo, namespace = "/chat")]
pub struct ChatController;

impl ChatController {
    #[on("message")]
    async fn handle_message(&self, socket: SocketContext) {
        let Ok(data) = socket.try_data_validator::<IncomingDataDto>() else {
            eprintln!("Failed to validate message data");
            return;
        };

        socket.emit("message", &data.content).ok();
    }
}
```

:::

## Diferencia con el método 'try_data'

- `try_data::<T>()` solo deserializa el payload.
- `try_data_validator::<T>()` deserializa y luego ejecuta `Validate`.

Si la validación falla, el método retorna un error y puedes decidir cómo manejarlo dentro del handler.
