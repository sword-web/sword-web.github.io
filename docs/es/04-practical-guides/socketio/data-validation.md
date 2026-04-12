# Validación de datos

Sword permite validar datos entrantes en eventos Socket.IO usando el crate `validator`, de forma similar a la validación en controladores web.

Para la referencia completa de `try_data` y `try_validated_data`, revisa [Manejo de eventos y referencia de SocketContext](/es/practical-guides/socketio/event-handling).

## Habilitar `validation-validator`

Para usar validación en `SocketContext`, debes habilitar la feature `validation-validator`.

```toml
[dependencies]
validator = { features = ["derive"] }
sword = { version = "x.y.z", features = ["validation-validator"] }
serde = { features = ["derive"] }
```

## DTO validable

```rust
use serde::Deserialize;
use validator::Validate;

#[derive(Debug, Deserialize, Validate)]
struct IncomingMessageDto {
    #[validate(length(min = 1, max = 200))]
    pub content: String,
}
```

## Usar `try_validated_data`

```rust
use sword::prelude::*;
use sword::socketio::*;

#[controller(kind = Controller::SocketIo, namespace = "/chat")]
pub struct ChatController;

impl ChatController {
    #[on("message")]
    async fn handle_message(&self, ctx: SocketContext) {
        let Ok(data) = ctx.try_validated_data::<IncomingMessageDto>() else {
            eprintln!("Failed to validate message data");
            return;
        };

        ctx.socket.emit("message", &data.content).ok();
    }
}
```

## Diferencia con `try_data`

- `try_data::<T>()` solo deserializa el payload
- `try_validated_data::<T>()` deserializa y luego ejecuta `Validate`

Si la validación falla, el método retorna error y puedes decidir cómo manejarlo dentro del handler.
