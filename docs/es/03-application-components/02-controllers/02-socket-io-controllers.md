---
title: "Controladores Socket.IO"
description: "Definición y eventos soportados de controladores Socket.IO en Sword."
outline: [2, 3]

prev:
    text: Controladores Web
    link: /es/application-components/controllers/web-controllers
next:
    text: Inyección de Dependencias
    link: /es/application-components/di/
---
# Controladores Socket.IO

En Sword, un controlador Socket.IO es un `struct` anotado con `#[controller(kind = Controller::SocketIo, namespace = "...")]` cuyos métodos manejan eventos declarados con `#[on("...")]`.

## Definir un controlador

```rust
use sword::prelude::*;
use sword::socketio::*;

#[controller(kind = Controller::SocketIo, namespace = "/chat")]
pub struct ChatController;

impl ChatController {
    #[on("connection")]
    async fn on_connect(&self, ctx: SocketContext) {
        println!("Client connected: {}", ctx.id());
    }

    #[on("message")]
    async fn on_message(&self, ctx: SocketContext) {
        let Ok(message) = ctx.try_data::<String>() else {
            return;
        };

        ctx.socket.emit("message", &message).ok();
    }
}
```

## Eventos soportados

### Eventos especiales

- `#[on("connection")]`
- `#[on("disconnection")]`
- `#[on("fallback")]`

### Eventos personalizados

- `#[on("message")]`
- `#[on("chat-message")]`
- `#[on("room:join")]`

## Registro en un módulo

```rust
use sword::prelude::*;

pub struct ChatModule;

impl Module for ChatModule {
    fn register_controllers(controllers: &ControllerRegistry) {
        controllers.register::<ChatController>();
    }
}
```


## Ver también

- [Manejo de eventos](/es/practical-guides/socketio/event-handling)
- [ACKs](/es/practical-guides/socketio/acknowledgements)
- [Contexto y extensiones](/es/practical-guides/socketio/context-and-extensions)
- [Interceptores con Configuración](/es/application-components/interceptors/with-config)
