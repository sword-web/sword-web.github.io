# Manejo de eventos

Los controladores Socket.IO en Sword trabajan sobre eventos en lugar de rutas HTTP. Cada método del controller se asocia a un evento usando `#[on("...")]`.

## Eventos más comunes

Los eventos más frecuentes son:

- `connection`
- `disconnection`
- eventos personalizados como `message`, `chat-message` o `room:join`

## Ejemplo básico

```rust
use sword::prelude::*;

#[controller(kind = Controller::SocketIo, namespace = "/chat")]
pub struct ChatController;

impl ChatController {
    #[on("connection")]
    async fn on_connect(&self, ctx: SocketContext) {
        println!("New client connected: {}", ctx.id());
    }

    #[on("message")]
    async fn on_message(&self, ctx: SocketContext) {
        let Ok(message) = ctx.try_data::<String>() else {
            return;
        };

        ctx.socket.emit("message", &message).ok();
    }

    #[on("disconnection")]
    async fn on_disconnect(&self, ctx: SocketContext) {
        println!("Disconnect reason: {:?}", ctx.disconnect_reason());
    }
}
```

## Leer el nombre del evento

En handlers de mensaje puedes consultar el nombre del evento actual con `ctx.event()`:

```rust
if let Some(event) = ctx.event() {
    println!("Incoming event: {event}");
}
```

## Emit y broadcast

Desde `ctx.socket` puedes interactuar con el cliente actual o emitir hacia otros sockets:

```rust
ctx.socket.emit("message", &payload).ok();

ctx.socket.broadcast().emit("message", &payload).await.ok();
```
